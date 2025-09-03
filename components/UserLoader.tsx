"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { loadUser } from "@/redux/actions/userActions"

export function UserLoader() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    // Check if user is already authenticated
    if (!isAuthenticated) {
      // Try to load user from localStorage token
      const token = localStorage.getItem("accessToken")
      if (token) {
        dispatch(loadUser())
      }
    }
  }, [dispatch, isAuthenticated])

  // This component doesn't render anything
  return null
}
