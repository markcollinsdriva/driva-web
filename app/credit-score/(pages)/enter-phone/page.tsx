'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, FormControl, FormErrorMessage, Button, Input, Heading, VStack } from '@chakra-ui/react'
import { useAuth } from '@/app/credit-score/hooks/useAuth'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'
import { useUTMs } from '@/app/credit-score/hooks/useUTMs'

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
    if (status === 'sending-otp') {
      router.push('enter-otp')
    }
  }, [ status, router ])

  const isInvalid = status === 'invalid-phone'
  
  return (
    <Container maxW='sm' mt='4'>
      <HeaderLogo />
      <FormControl isInvalid={isInvalid}>
        <VStack spacing={3} alignItems="start">
          <Heading fontSize='24' >Enter your mobile number</Heading>
          <Input 
            type='tel'
            value={mobileNumber ?? ''}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder='Your mobile number'
          />
          <FormErrorMessage mt='0'>Invalid mobile number</FormErrorMessage>
          <Button 
            mt='1' w='full' 
            onClick={sendOTP} isLoading={status === 'sending-otp'}>
            Send code
          </Button>
        </VStack>
      </FormControl>
    </Container>
  )
}
