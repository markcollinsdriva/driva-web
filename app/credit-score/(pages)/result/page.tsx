'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Circle, 
  Center, 
  Text, 
  VStack, 
  Button,
  Spinner
} from '@chakra-ui/react'
import { Product, ProductsList } from '@/app/credit-score/config'
import { useAuth } from '@/app/auth/hooks/useAuth'
import { useRedirectIfNoAuth } from '@/app/auth/hooks/useRedirectIfNoAuth'
import { useCreditScore} from '@/app/credit-score/hooks/useCreditScore'
import { useLoanApplication } from '@/app/credit-score/hooks/useLoanApplication'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'

export default function Page() {
  const { isChecking } =  useRedirectIfNoAuth()
  const router = useRouter()

  const [ 
    mobileNumber,
    otp
  ] = useAuth(store => [ 
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

  const handleProductSelection = (product: Product) => {
    updateValues({ product })
    router.push('apply')
  }

  useEffect(() => {
    getScore({ mobileNumber, otp })
  }, [ mobileNumber, otp, getScore ])

  console.log('isChecking', isChecking)

  if (isChecking) return null

  return (
    <Box minH='100vh' bg='gray.100'>
      <Box 
        height='64'
        pt='5'
        px={['4', '10']}
        borderBottom='1px solid #e5e7eb'
        backgroundColor='#97edcc'>
        <HeaderLogo />
      </Box>
      <Container pb='32'>
        <VStack spacing='4' alignItems='start' mt='-44'> 
          {profile?.firstName ? <Heading>Welcome back {profile.firstName}</Heading> : null}
          <Center w='full' rounded='md' boxShadow='base' bg='white' p='8' borderWidth='1px' borderColor='gray.100' h='64'>
            <Box>
              <ScoreComponent score={score} scoreStatus={scoreStatus} />
            </Box>
          </Center>
          {scoreStatus !== 'success' 
            ? null
            : showCreditRepair(score)
            ? <CreditRepairRefer />
            : <ProductsComponent onProductSelected={handleProductSelection} /> }
        </VStack>
      </Container>
    </Box>
  )
}

const showCreditRepair = (score: string|null) => score && Number(score) < 300

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
      <Heading>Your offers</Heading>
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


const CreditRepairRefer = () => {
  return (
    <Box w='full' mt='6'>
      <Box rounded='md' boxShadow='base' bg='white' p='6' border='1px' borderColor='gray.100'>
        <VStack spacing={4} alignItems='start'>
          <Image src='/images/credit-repair-logo.png' width={200} height={200} alt='Credit Repair Australia' />
          <Heading fontSize='22'>You might need Credit Repair</Heading>
          <Text >Your credit score is a bit low to apply for any products</Text>
          <Text>Credit Repair Australia has been helping Aussies fix their credit reports for 20 years. They will assess your credit report and provide options that help improve your credit rating, get you out of debt, or get your loan approved.</Text>
          <Text>To get started, click &quot;Refer me&quot; and we will send them your details, and Credit Repair Australia will reach out for a FREE consultation.</Text>
          <Button w='full'>Refer me</Button>
          <Text fontSize='12'>By clicking the continue button, I give Driva persmission to share my information with the above partner. </Text>
        </VStack>
      </Box>
    </Box>
  )
}

