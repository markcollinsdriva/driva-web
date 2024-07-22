'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Box, Container, Heading, SimpleGrid, Circle, Center, Text, VStack, Spinner } from '@chakra-ui/react'
import { Product, ProductsList } from '@/app/credit-score/config'
import { useAuth } from '@/app/credit-score/hooks/useAuth'
import { useRedirectIfNoAuth } from '@/app/credit-score/hooks/useRedirectIfNoAuth'
import { useCreditScore} from '@/app/credit-score/hooks/useCreditScore'
import { useLoanApplication } from '@/app/credit-score/hooks/useLoanApplication'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'

export default function Page() {
  const { isChecking } =  useRedirectIfNoAuth()
  const router = useRouter()

  const [ 
    authStatus,
    mobileNumber,
    otp
  ] = useAuth(store => [ 
    store.status,
    store.mobileNumber,
    store.otp,
  ])

  const [ 
    score,
    profile,
    getScore,
    scoreStatus
  ] = useCreditScore(store => [ 
    store.score,
    store.profile,
    store.getScore, 
    store.status
  ])

  const [ 
    updateValues
  ] = useLoanApplication(store => [ 
    store.updateValues
  ])

  const isAuthenticated = authStatus === 'auth-ok'

  const handleProductSelection = (product: Product) => {
    updateValues({ product })
    router.push('apply')
  }

  useEffect(() => {
    getScore({ mobileNumber, otp })
  }, [ mobileNumber, otp, getScore ])

  if (!isAuthenticated) {
    router.push('enter-phone')
  }

  if (isChecking) return null

  return (
    <Box bg='gray.100' minH='100vh'>
      <Container pb='32'>
        <HeaderLogo />
        <VStack spacing='4' alignItems='start'> 
          {profile?.firstName ? <Heading>Welcome back {profile.firstName}</Heading> : null}
          <Center w='full' rounded='md' boxShadow='base' bg='white' p='8' borderWidth='1px' borderColor='gray.100' h='64'>
            <Box>
              <ScoreComponent score={score} scoreStatus={'loading'} />
            </Box>
          </Center>
          {scoreStatus === 'success' ? <ProductsComponent onProductSelected={handleProductSelection} /> : null }
        </VStack>
      </Container>
    </Box>
  )
}


const ScoreComponent = ({ score, scoreStatus }: { score: string|null, scoreStatus: 'success'|'error'|'loading'  }) => {
  if (scoreStatus === 'error') {
    return <Text>Error</Text>
  }

  if (scoreStatus === 'loading') {
    return (
      <Center>
        <VStack spacing={2}>
          <Spinner size='lg'/>
          <Text fontSize='16'>Getting your score</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Circle size='52' backgroundColor='#97edcc' boxShadow='base' borderWidth='1px' borderColor='gray.100'>
      <VStack spacing={0}>
        <Text fontSize='24'>Credit Score</Text>
        <Text fontSize='44' fontWeight='bold'>{score}</Text>
        <Text fontSize='16'>out of 1000</Text>
        <Text fontSize='12'>Powered by Equifax</Text>
      </VStack>
    </Circle>
  )
}


const ProductsComponent = ({ onProductSelected }: { onProductSelected: (product: Product) => void }) => {
  return (
    <Box w='full' mt='6'>
      <Heading>We can help with</Heading>
      <SimpleGrid columns={2} spacing={4} w='full' mt='4'>
        {ProductsList.map((product) => (
          <Center 
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
            onClick={() => onProductSelected(product)}
            rounded='md' boxShadow='base' bg='white' p='2' pt='4' border='1px' borderColor='gray.100'
            textAlign='center'
            key={product.name}>
            <VStack spacing={0}>
              <Text fontWeight='bold'>{product.label}</Text>
              <Image
                src={product.imgSrc}
                width={100}
                height={100}
                alt='Product'
              />
            </VStack>
          </Center>
        ))}
      </SimpleGrid>
    </Box>
  )
}