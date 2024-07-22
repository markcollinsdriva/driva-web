'use client'

import { useRouter } from "next/navigation"
import { useAuth } from "./useAuth"
import { useEffect, useState } from "react"

export const useRedirectIfNoAuth = () => {
  const [ isChecking, setIsChecking ] = useState(true)
  const router = useRouter()
  const { status } = useAuth()
   
  useEffect(() => {
    if (status === 'auth-ok') {
      setIsChecking(false)
      return
    }
    router.push('enter-phone')
  }, [ status, router ])

  return {
    isChecking,
  }
}