'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Box, Container, Heading, SimpleGrid, Circle, Center, Text, VStack, Spinner } from '@chakra-ui/react'
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

  const handleProductSelection = (product: Product) => {
    updateValues({ product })
    router.push('apply')
  }

  useEffect(() => {
    getScore({ mobileNumber, otp })
  }, [ mobileNumber, otp, getScore ])

  if (isChecking) return null

  return (
    <Box minH='100vh' bg='gray.100'>
      <Box 
        height='64'
        pt='5'
        px={['4', '10']}
        borderBottom="1px solid #e5e7eb"
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


const CreditRepairRefer = () => {

  return (
    <Box w='full' mt='6'>
      <Heading>Credit Repair Australia</Heading>
      <Text>Your credit score is a bit low to apply for any products</Text>
      <Text>Credit Repair Australia has been helping Aussies fix their credit reports for 20 years.s</Text>
      <Text>CRA will assess your credit report and provide options that help improve your credit rating, get you out of debt, or get your loan approved.</Text>
      <Text>To get started, click "Refer me" and we will send them your details, and Credit Repair Australia will reach out for a FREE consultation.</Text>
      <Button>Refer me</Button>
      <Text>By clicking the continue button, I give Driva persmission to share my information with the above partner. </Text>
    </Box>
  )
}

// Thank you for submitting a loan application with us
// Unfortunately we are unable to match you with a loan option at this time. However, we partner with Credit Repair Australia, who can help you develop a personalised plan to rebuild your credit and increase your chances of future loan approvals.

// Credit Repair Australia
// Credit Repair Australia has been helping Aussies fix their credit reports for 20 years. Learn more.

// To get started, click "Refer me" and we will send them your details, and Credit Repair Australia will reach out for a FREE consultation.


// Refer me
// By clicking the continue button, I agree with Driva to share my information with the partner.

// 1300 755 494
// contact@driva.com.au


// How Credit Repair Australia can help
// Credit Repair Australia (CRA) is one of Australia's foremost consumer credit restoration experts, assisting thousands of Australians to take control of their finances.

// CRA will assess your credit report and provide options that help improve your credit rating, get you out of debt, or get your loan approved.

// They will assess your credit report and provide a consultation to work with you to provide the solutions to improve your credit score.