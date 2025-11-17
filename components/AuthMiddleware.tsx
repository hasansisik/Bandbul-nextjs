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
  const { isAuthenticated, loading } = useAppSelector((state) => state.user)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      
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
      
      setIsChecking(false)
    }

    checkAuth()
  }, [dispatch, isAuthenticated, router])

  // Show loading while checking authentication
  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If not authenticated after check, don't render children
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
