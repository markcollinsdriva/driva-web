'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { FormControl, FormErrorMessage, Button, Input, Heading, VStack, Text, Box } from '@chakra-ui/react'
import { useAuth } from '@/app/auth/hooks/useAuth'
import { useUTMs } from '@/app/auth/hooks/useUTMs'

export default function Page() {
  const router = useRouter()
  useUTMs()

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
    if (status === 'enter-otp') {
      router.push('/auth/enter-otp')
    }
  }, [ status, router ])

  const isInvalid = status === 'invalid-phone'
  
  return (
    <FormControl isInvalid={isInvalid}>
      <VStack spacing={5} alignItems="start">
        <Heading fontSize='24'>See your Credit Score</Heading>
        <Text fontSize='18' >Enter your mobile number</Text>
        <Input 
          type='tel'
          value={mobileNumber ?? ''}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder='Your mobile number'
        />
        <FormErrorMessage mt='0'>Invalid mobile number</FormErrorMessage>
        <Button 
          mt='1' w='full' 
          isDisabled={!mobileNumber || status === 'no-profile'}
          isLoading={status === 'sending-otp'}
          onClick={sendOTP} >
          Send code
        </Button>
      </VStack>
      {status === 'no-profile' ? <NoProfile /> : null}
    </FormControl>
  )
}


const NoProfile = () => {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    window.location.href = 'https://apply.driva.com.au/credit-score'
  }

  return (
    <Box>
      <Text mt='4' fontSize='14' color='gray.600'>
        We couldn't find a profile with that mobile number. Please check the number or create a new profile.
      </Text>
      <Button mt='4' w='full' onClick={handleClick}>Create a new profile</Button>
    </Box>
  )
}