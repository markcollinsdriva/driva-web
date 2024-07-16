'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { useAuth } from '@/app/credit-score/useAuth'
import { useCreditScore} from '@/app/credit-score/useCreditScore'

const IS_PROD = false

export default function Page() {
  const [ 
    authStatus,
    mobileNumber,
    otp
  ] = useAuth(store => [ 
    store.status,
    store.mobileNumber,
    store.otp,
  ])

  const [ 
    score, 
    getScore,
    scoreStatus
  ] = useCreditScore(store => [ 
    store.score,
    store.getScore, 
    store.status
  ])

  const isAuthenticated = authStatus === 'auth-ok'

  useEffect(() => {
    if (!isAuthenticated || !mobileNumber || !otp) return
    getScore({ mobileNumber, otp })
  }, [ mobileNumber, otp ])

  if (!isAuthenticated) {
    redirect('/enter-otp')
  }

  if (scoreStatus === 'error') {
    return <Box>Error</Box>
  }

  if (scoreStatus == 'loading') {
    return <Box>Loading</Box>
  }
  return (
    <Box>
       <Box>Your credit score is: {score}</Box>
    </Box>
  )
}
