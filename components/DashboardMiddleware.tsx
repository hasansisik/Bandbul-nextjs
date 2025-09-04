"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser } from "@/redux/actions/userActions"

interface DashboardMiddlewareProps {
  children: React.ReactNode
}

export function DashboardMiddleware({ children }: DashboardMiddlewareProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.user)

  useEffect(() => {
    // Check if user is already authenticated
    if (!isAuthenticated) {
      // Try to load user from localStorage token
      const token = localStorage.getItem("accessToken")
      if (token) {
        dispatch(loadUser())
      } else {
        // No token, redirect to login
        router.push("/giris")
        return
      }
    }
  }, [dispatch, isAuthenticated, router])

  // Show loading while checking authentication
  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Check if user has admin role
  if (user && user.role !== "admin") {
    // User is authenticated but not admin, redirect to home page
    router.push("/")
    return null
  }

  // User is authenticated and has admin role, render children
  return <>{children}</>
}
