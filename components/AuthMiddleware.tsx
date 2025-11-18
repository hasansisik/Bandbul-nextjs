"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser } from "@/redux/actions/userActions"

interface AuthMiddlewareProps {
  children: React.ReactNode
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, isVerified, loading } = useAppSelector((state) => state.user)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      const currentPath = window.location.pathname
      
      // If user is on verification page and not authenticated, allow them to stay
      if (currentPath === "/dogrulama" && !token) {
        setIsChecking(false)
        return
      }
      
      if (!token) {
        // No token, redirect immediately
        router.push("/")
        return
      }

      if (!isAuthenticated) {
        try {
          const result = await dispatch(loadUser())
          if (loadUser.rejected.match(result)) {
            // loadUser failed, redirect to home
            router.push("/")
            return
          }
        } catch (error) {
          // Any error, redirect to home
          router.push("/")
          return
        }
      }
      
      // Check if user is verified after authentication
      if (isAuthenticated && isVerified === false) {
        // User is authenticated but not verified, redirect to verification page
        const userEmail = localStorage.getItem("userEmail") || ""
        router.push(`/dogrulama?email=${encodeURIComponent(userEmail)}`)
        return
      }
      
      setIsChecking(false)
    }

    checkAuth()
  }, [dispatch, isAuthenticated, isVerified, router])

  // Show loading while checking authentication
  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If user is on verification page, allow them to stay regardless of auth status
  const currentPath = window.location.pathname
  if (currentPath === "/dogrulama") {
    return <>{children}</>
  }

  // If not authenticated after check, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If user is not verified, don't render children (will be redirected)
  if (isVerified === false) {
    return null
  }

  // User is authenticated and verified, render children
  return <>{children}</>
}
