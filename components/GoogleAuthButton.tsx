"use client"

import { useState, useEffect, useRef } from "react"
import { initializeGoogleAuth, GoogleUser } from "@/lib/googleAuth"
import { useAppDispatch } from "@/redux/hook"
import { googleAuth } from "@/redux/actions/userActions"
import { useRouter, useSearchParams } from "next/navigation"

interface GoogleAuthButtonProps {
  mode: 'login' | 'register'
  className?: string
}

export function GoogleAuthButton({ mode, className }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Google Auth when component mounts
    initializeGoogleAuth()
      .then(() => {
        setIsGoogleLoaded(true)
        setupGoogleAuth()
      })
      .catch((error) => {
        console.error('Failed to initialize Google Auth:', error)
      })
  }, [])

  const setupGoogleAuth = () => {
    if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
      console.error('Google Identity Services not available')
      return
    }

    try {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "323173892265-e9cqmdl32734c3ftk5kn7p9c7aps61n5.apps.googleusercontent.com",
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      console.log('Google Identity Services initialized successfully')

      // Render the button
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: '100%',
        })
        console.log('Google sign-in button rendered')
      } else {
        console.error('Button ref not available')
      }
    } catch (error) {
      console.error('Error setting up Google Auth:', error)
    }
  }

  const handleGoogleCallback = async (response: any) => {
    console.log('Google callback received:', response)
    setIsLoading(true)
    
    try {
      // Decode the JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      console.log('Decoded Google payload:', payload)
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        verified_email: payload.email_verified,
      }

      console.log('Google user data:', googleUser)

      // Prepare payload for Redux action
      const payload_data = {
        email: googleUser.email,
        name: googleUser.given_name || googleUser.name.split(' ')[0] || 'Google',
        surname: googleUser.family_name || googleUser.name.split(' ').slice(1).join(' ') || 'User',
        picture: googleUser.picture,
        googleId: googleUser.id,
      }

      console.log('Sending to backend:', payload_data)

      let result = await dispatch(googleAuth(payload_data))

      console.log('Backend response:', result)

      if (googleAuth.fulfilled.match(result)) {
        // Check for redirect parameter
        const redirectUrl = searchParams.get('redirect')
        
        // Role-based redirect
        const userRole = result.payload.role
        if (userRole === 'admin') {
          router.push("/dashboard")
        } else if (redirectUrl) {
          // Decode and redirect to the originally requested page
          const decodedUrl = decodeURIComponent(redirectUrl)
          router.push(decodedUrl)
        } else {
          router.push("/")
        }
      } else {
        console.error('Authentication failed:', result)
      }
    } catch (error) {
      console.error('Google authentication error:', error)
      alert('Google ile giriş yapılırken hata oluştu: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div 
        ref={buttonRef}
        id="google-signin-button"
        className="w-full"
      />
      {isLoading && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Yükleniyor...
        </div>
      )}
    </div>
  )
}
