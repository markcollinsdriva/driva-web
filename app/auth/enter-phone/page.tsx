'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { FormControl, FormErrorMessage, Button, Input, Heading, VStack, Text } from '@chakra-ui/react'
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
    if (status === 'sending-otp') {
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
          onClick={sendOTP} isLoading={status === 'sending-otp'}>
          Send code
        </Button>
      </VStack>
    </FormControl>
  )
}


const TrustPilot = () => (
  <>
  <Script  src="//widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.min.js" />
  <div 
    className="trustpilot-widget" data-locale="en-US" data-template-id="54ad5defc6454f065c28af8b"
    data-businessunit-id="5e4b32c580da5a0001aed9a1" data-style-height="200px" data-style-width="100%" data-theme="light" data-stars="2,3,4,5">
    <a href="https://www.trustpilot.com/review/bluevine.com" target="_blank">Trustpilot</a>
  </div>
</>
)