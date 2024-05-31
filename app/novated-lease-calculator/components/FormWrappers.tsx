'use client'

import { 
  Button, 
  Box,
  Heading,
  Flex,
  VStack,
  Spacer,
 } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { pageConfigs } from '@/app/novated-lease-calculator/pageConfig'
import { PageName } from '@/app/novated-lease-calculator/types'
import { ArrowBackIcon } from '@chakra-ui/icons'

export const FormPage = ({ 
  pageName,
  children,
}: { 
  pageName: PageName
  children:  React.ReactNode,  
}) => {
  const pageConfig = pageConfigs.get(pageName)

  return (
    <Box>
      <VStack spacing='4' alignItems='start'>
        {pageConfig?.headingText ? <FormHeader>{pageConfig?.headingText}</FormHeader> : null}
        {children}
        <FormFooter 
          pageName={pageName}
          nextButtonText={pageConfig?.nextButtonText}
          />
      </VStack>
    </Box>
  ) 
}

export const FormHeader = ({ children }: { children: string }) => {
  return (
    <Box> 
      <Heading w='full'>{children}</Heading>
    </Box>
  )
}

export const FormFooter = ({ 
  pageName,
  nextButtonText = 'Next',
  hideBackButton = false, 
}: { 
  pageName: PageName,
  nextButtonText?: string|null,
  hideBackButton?: boolean, 
}) => {
  const router = useRouter()
  const pageConfig = pageConfigs.get(pageName)
  const previousPage = pageConfig?.previousPage()
  const nextPage = pageConfig?.nextPage()
  const showBackButton = !hideBackButton && previousPage
  const showNextButton = !!nextPage

  return (
    <Box w='full'>
      {showNextButton ?
        <Button 
          w='full'
          onClick={() => router.push(nextPage)}>
          {nextButtonText}
        </Button> : null}
      {showBackButton ? 
        <Button 
          mt='2'
          paddingLeft={0}
          paddingRight={0}
          variant='ghost'
          leftIcon={<ArrowBackIcon />}
          onClick={() => router.push(previousPage)}>
          Previous
        </Button> : null}
    </Box>
  )
}

