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

    // Only try to load user if token exists and user is not already authenticated
    const token = localStorage.getItem("accessToken")
    
    if (token && !isAuthenticated) {
      // Only load user if not already authenticated
      dispatch(loadUser())
    }
  }, [dispatch, pathname, isAuthenticated]) // Removed user dependency to prevent unnecessary calls

  // This component doesn't render anything
  return null
}
