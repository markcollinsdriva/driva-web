'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, FormControl, FormErrorMessage, FormHelperText, Button, Heading, VStack } from '@chakra-ui/react'
import OtpInput from 'react-otp-input'
import { useAuth } from '@/app/credit-score/useAuth'
import Link from 'next/link'

import './otp.css';


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

  return (
    <Container maxW='sm' mt='4'>
      <FormControl isInvalid={isInvalid}>
        <VStack spacing={2} alignItems="start">
          <Heading fontSize='24'>Enter the 4 digit code</Heading>
          <OtpInput
            value={otp ?? undefined}
            onChange={setOTP}
            numInputs={otpLength}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            containerStyle="otp-container"
          />
          {authStatus === 'validating-otp' ? 
            <ValidatingOTP /> : null}
          <FormErrorMessage>Incorrect code</FormErrorMessage>
          <FormHelperText>
            Didn&apos;t receive the code? <span onClick={sendOTP}>Try again</span>
          </FormHelperText>
          <Link href='enter-phone'><FormHelperText>Change mobile number</FormHelperText></Link>
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