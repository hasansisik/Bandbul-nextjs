"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser, clearError } from "@/redux/actions/userActions"
import { usePathname } from "next/navigation"

// Pages that should not trigger user loading or redirects
const LOGGED_OUT_PAGES = [
  "/giris",
  "/kayitol",
  "/sifremi-unuttum",
  "/yeni-sifre",
  "/dogrulama",
]

export function UserLoader() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.user)

  useEffect(() => {
    // Don't load user on logged-out pages
    if (LOGGED_OUT_PAGES.includes(pathname)) {
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
