'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Text} from '@chakra-ui/react'
import OtpInput from 'react-otp-input'
import { useAuth } from '@/app/credit-score/useAuth'
import Link from 'next/link'

const OTP_LENGTH = 4

export default function Page() {
  const router = useRouter()
  const [ 
    mobileNumber,
    otp,
    setAndValidateOTP,
    sendOTP,
    authStatus
  ] = useAuth(store => [ 
    store.mobileNumber,
    store.otp,
    store.setAndValidateOTP,
    store.sendOTP,
    store.status
  ])
  
  useEffect(() => {
    sendOTP()
  }, [])

  const handleOTPChange = async (otp: string) => {
    setAndValidateOTP(otp)
  }

  useEffect(() => {
    if (authStatus !== 'auth-ok') return
    router.push('result')
  }, [ authStatus] )

  return (
    <Box>
      <Heading>Enter the 4 digit code</Heading>
      {mobileNumber ? <Text>We sent an SMS to your phone ending with {mobileNumber?.slice(-3)}</Text> : null}
      <Link href='enter-phone'>Change mobile number</Link>
      <OtpInput
        value={otp ?? undefined}
        onChange={handleOTPChange}
        numInputs={OTP_LENGTH}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      {authStatus === 'validating-otp' ? <Box>Validating...</Box> : null}
      {authStatus === 'error' ? <Box>Incorrect code</Box> : null}
      <Box>Didn't receive the code?</Box>
      <Button onClick={sendOTP}>Try again</Button>
    </Box>
  )
}
