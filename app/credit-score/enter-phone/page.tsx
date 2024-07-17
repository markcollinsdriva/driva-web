'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, FormControl, FormErrorMessage, Text, Box, Button, Input, Heading, VStack} from '@chakra-ui/react'
import { useAuth } from '@/app/credit-score/useAuth'

export default function Page() {
  const router = useRouter()
  const [ 
    mobileNumber, 
    setMobileNumber, 
    sendOTP, 
    status 
  ] = useAuth(store => [ 
    store.mobileNumber, 
    store.setMobileNumber, 
    store.sendOTP,
    store.status 
  ])
  
  useEffect(() => {
    if (status === 'sending-otp') {
      router.push('enter-otp')
    }
  }, [status])

  const isInvalid = status === 'invalid-phone'
  
  return (
    <Container maxW='sm' mt='4'>
      <FormControl isInvalid={isInvalid}>
        <VStack spacing={1} alignItems="start">
          <Heading fontSize='24'>Enter your mobile number</Heading>
            <Input 
              type='tel'
              value={mobileNumber ?? ''}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder='Your mobile number'
            />
            <FormErrorMessage>Invalid mobile number</FormErrorMessage>
            <Button mt='1' onClick={sendOTP}>Send code</Button>
        </VStack>
      </FormControl>
    </Container>
  )
}
