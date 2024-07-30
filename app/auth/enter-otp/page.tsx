'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FormControl, FormErrorMessage, FormHelperText, Box, Heading, VStack } from '@chakra-ui/react'
import OtpInput from 'react-otp-input'
import { useAuth } from '@/app/auth/hooks/useAuth'
import './otp.css'

export default function Page() {
  const router = useRouter()
  const [ 
    otp,
    otpLength,
    setOTP,
    sendOTP,
    authStatus
  ] = useAuth(store => [ 
    store.otp,
    store.otpLength,
    store.setOTP,
    store.sendOTP,
    store.status
  ])

  useEffect(() => {
    if (authStatus !== 'auth-ok') return
    router.push('/credit-score/result')
  }, [ authStatus, router ] )

  const isInvalid = authStatus === 'invalid-otp'
  const showValidatingOTP = authStatus === 'validating-otp' || authStatus === 'auth-ok'

  const otpRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    setTimeout(() => otpRef?.current?.focusField(0), 250);
  }, [])


  return (
    <FormControl isInvalid={isInvalid}>
      <VStack spacing={4} alignItems="start">
        <Heading fontSize='24'>Enter the 4 digit code</Heading>
        <OtpInput
          // @ts-ignore
          ref={otpRef}
          value={otp ?? undefined}
          onChange={setOTP}
          numInputs={otpLength}
          inputType='number'
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle="otp-input"
          containerStyle="otp-container"
        />
        {showValidatingOTP ? <ValidatingOTP /> : null}
        <FormErrorMessage mt='0'>Incorrect code</FormErrorMessage>
        <FormHelperText>
          Didn&apos;t receive the code? <Box as="span" textDecoration='underline' onClick={sendOTP}>Try again</Box>
        </FormHelperText>
        <Link href='enter-phone'>
          <FormHelperText textDecoration='underline'>Change mobile number</FormHelperText>
        </Link>
      </VStack>
    </FormControl>
  )
}

const ValidatingOTP = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <FormHelperText>Validating {dots}</FormHelperText> 
  )
}