'use client'

import { useEffect, useState } from 'react'
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
  Spinner,
} from '@chakra-ui/react'
import { useAuth } from '@/app/auth/hooks/useAuth'
import { Product, ProductsList } from '@/app/credit-score/config'
import { referToCreditRepairAustralia } from '@/app/credit-score/referCreditRepairAustralia'
import { useRedirectIfNoAuth } from '@/app/auth/hooks/useRedirectIfNoAuth'
import { useCreditScore} from '@/app/credit-score/hooks/useCreditScore'
import { useApplication } from '@/app/credit-score/hooks/useApplication'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'
import { Footer } from '@/components/Footer'
import { openURLInNewTab } from '@/components/openURLInNewTab'
import { TrustBox } from "@/components/TrustPilot"
import { Profile } from '@/services/Supabase/init'
import { createApplication } from '@/app/credit-score/actions/createApplication'

const LENDI_REFER_LINK = 'https://www.lendi.com.au/lp/refinance-cashback-offer-generic/?utm_source=driva&utm_medium=cpc&utm_campaign=lendi_driva'

export default function Page() {
  const { isChecking } =  useRedirectIfNoAuth()
  const router = useRouter()

  useEffect(() => {
    router.prefetch('apply')
  }, [ router])

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
    utmCampaign,
    utmMedium,
    utmSource,
    updateApplicationValue
  ] = useApplication(store => [ 
    store.utmCampaign,
    store.utmMedium,
    store.utmSource,
    store.updateValues
  ])

  const handleProductSelection = async (product: Product) => {
    if (typeof window === 'undefined') return
    updateApplicationValue({ product })
    if (!profile) return

    await createApplication ({ 
      profileId: profile.id, 
      product: product.name, 
      orgName: product.name === 'HomeLoan' ? 'mab' : 'driva',
      utmSource,
      utmMedium,
      utmCampaign
    })

    if (product.name === 'HomeLoan') {
      openURLInNewTab(LENDI_REFER_LINK)
      return
    }
    
    router.push('apply')
  }

  useEffect(() => {
    getScore({ mobileNumber, otp })
  }, [ mobileNumber, otp, getScore ])

  if (isChecking) return null

  return (
    <Box minH='100vh' bg='gray.100' pb='10'>
      <Box 
        height='64'
        pt='5'
        px={['4', '10']}
        borderBottom='1px solid #e5e7eb'
        backgroundColor='#97edcc'>
        <HeaderLogo />
      </Box>
      <Container>
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
            ? <CreditRepairRefer profile={profile}/>
            : <ProductsComponent onProductSelected={handleProductSelection} /> }
        </VStack>
      </Container>
      <Box pt='16'>
        <Center w='full'>
          {scoreStatus === 'success' ? <TrustBox /> : null}
        </Center>
      </Box>
      {scoreStatus === 'loading' ? null : <Footer />}
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

const productsToShow = ProductsList.filter(product => product.showOnScorePage)

const ProductsComponent = ({ onProductSelected }: { onProductSelected: (product: Product) => void }) => {
  return (
    <Box w='full' mt='6'>
      <Heading>Your loan offers</Heading>
      <SimpleGrid columns={2} spacing={4} w='full' mt='4'>
        {productsToShow.map((product) => (
          <ProductComponent key={product.name} product={product} onProductSelected={onProductSelected} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

const ProductComponent = ({ product, onProductSelected }: { product: Product, onProductSelected: (product: Product) => void }) => {
  const [ isLoading, setIsLoading ] = useState(false)

  const handleOnProductSelected = () => {
    setIsLoading(true)
    onProductSelected(product)
  }

  return (
    <Center 
      _hover={{ bg: 'gray.50', cursor: 'pointer' }}
      onClick={handleOnProductSelected}
      rounded='md' boxShadow='base' bg='white' p='2' pt='4' border='1px' borderColor='gray.100'
      textAlign='center'>
      {isLoading 
        ? <Spinner/>
        : <VStack spacing={0}>
            <Text fontWeight='bold'>{product.label}</Text>
            <Image
              src={product.imgSrc}
              width={100}
              height={100}
              alt='Product'
            />
          </VStack>}
    </Center>
  )
}

const CreditRepairRefer = ({ profile }: { profile: Profile|null }) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isSubmitted, setIsSubmitted ] = useState(false)
  const [ 
    utmCampaign,
    utmMedium,
    utmSource,
  ] = useApplication(store => [ 
    store.utmCampaign,
    store.utmMedium,
    store.utmSource,
  ])

  const handleClick = async () => {
    if (!profile) return
    setIsLoading(true)
    await createApplication({ 
      profileId: profile.id, 
      product: 'credit-repair', 
      orgName: 'cra',
      utmSource,
      utmMedium,
      utmCampaign
    })
    await referToCreditRepairAustralia({ profile })
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <Box w='full' mt='6'>
      <Box rounded='md' boxShadow='base' bg='white' p='6' border='1px' borderColor='gray.100'>
        <VStack spacing={4} alignItems='start'>
          <Image src='/images/credit-repair-logo.png' width={200} height={200} alt='Credit Repair Australia' />
          <Heading fontSize='22'>You might need Credit Repair</Heading>
          <Text >Your credit score is a bit low to apply for any loans.</Text>
          <Text>Credit Repair Australia has been helping Aussies fix their credit reports for 20 years. They will assess your credit report and provide options that help improve your credit rating, get you out of debt, or get your loan approved.</Text>
          <Text>To get started, click &quot;Refer me&quot; and we will send them your details, and Credit Repair Australia will reach out for a FREE consultation.</Text>
          { isSubmitted
            ? <Text fontWeight='bold'>Thank you for your interest. Credit Repair Australia will be in touch soon.</Text>
            : <Button w='full' isLoading={isLoading} onClick={handleClick}>Refer me</Button> }
          <Text fontSize='12'>By clicking the continue button, I give Driva persmission to share my information with the above partner. </Text>
        </VStack>
      </Box>
    </Box>
  )
}

