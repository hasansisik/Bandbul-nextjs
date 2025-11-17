"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser, clearError } from "@/redux/actions/userActions"
import { usePathname } from "next/navigation"

export function UserLoader() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.user)

  useEffect(() => {
    
    // Clear any existing error when on login page
    if (pathname === "/giris") {
      dispatch(clearError())
      return
    }

    // Always try to load user if token exists
    const token = localStorage.getItem("accessToken")
    
    if (token) {
      // Force load user every time if not authenticated or no user data
      if (!isAuthenticated || !user) {
        dispatch(loadUser())
      }
    }
  }, [dispatch, pathname, isAuthenticated, user]) // Add dependencies back but keep pathname as primary trigger

  // This component doesn't render anything
  return null
}
