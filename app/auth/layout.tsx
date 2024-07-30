
import { Container,  Box, Center } from '@chakra-ui/react'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'
import { TrustBox } from '@/components/TrustPilot'
import { Suspense } from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <Box bg='gray.100' minH='100vh'>
    <Box 
      height='44'
      pt='5'
      px={['4', '10']}
      borderBottom="1px solid #e5e7eb"
      backgroundColor='#97edcc'>
      <HeaderLogo />
    </Box>
    <Box p='4'>
      <Container 
        maxW='sm' 
        bg='white' 
        border="1px solid #e5e7eb"
        borderRadius='10'
        mt='-24' p='6' mb='16' >
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </Container>
    </Box>
    <Box pt='4'>
      <Center w='full'>
        <TrustBox />
      </Center>
    </Box>
  </Box>
  )
}

