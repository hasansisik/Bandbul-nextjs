"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser, clearError } from "@/redux/actions/userActions"
import { usePathname } from "next/navigation"

export function UserLoader() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    // Clear any existing error when on login page
    if (pathname === "/giris") {
      dispatch(clearError())
      return
    }

    // Check if user is already authenticated
    if (!isAuthenticated) {
      // Try to load user from localStorage token
      const token = localStorage.getItem("accessToken")
      if (token) {
        dispatch(loadUser())
      }
    }
  }, [dispatch, isAuthenticated, pathname])

  // This component doesn't render anything
  return null
}
