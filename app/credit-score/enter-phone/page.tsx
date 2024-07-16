'use client'

import { useRouter } from 'next/navigation'
import { Box, Button, Input, Heading} from '@chakra-ui/react'
import { useAuth } from '@/app/credit-score/useAuth'

export default function Page() {
  const router = useRouter()
  const [ mobileNumber, setMobileNumber ] = useAuth(store => [ store.mobileNumber, store.setMobileNumber ])
  
  const handleSendCode = () => {
    router.push('enter-otp')
  }
  
  return (
    <Box>
      <Heading>Enter your phone number</Heading>
      <Input 
        type='tel'
        value={mobileNumber ?? ''}
        onChange={(e) => setMobileNumber(e.target.value)}
        placeholder='Enter your mobile number'
      />
      <Button onClick={handleSendCode}>Send code</Button>
    </Box>
  )
}
