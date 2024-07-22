'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container, FormControl, FormErrorMessage, FormHelperText, Box, Heading, VStack } from '@chakra-ui/react'
import OtpInput from 'react-otp-input'
import { useAuth } from '@/app/credit-score/hooks/useAuth'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'
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
    router.push('result')
  }, [ authStatus, router ] )

  const isInvalid = authStatus === 'invalid-otp'
  const showValidatingOTP = authStatus === 'validating-otp' || authStatus === 'auth-ok'

  return (
    <Container maxW='sm' mt='4'>
      <HeaderLogo />
      <FormControl isInvalid={isInvalid}>
        <VStack spacing={3} alignItems="start">
          <Heading fontSize='24'>Enter the 4 digit code</Heading>
          <OtpInput
            value={otp ?? undefined}
            onChange={setOTP}
            numInputs={otpLength}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            containerStyle="otp-container"
            shouldAutoFocus
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
    </Container>
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