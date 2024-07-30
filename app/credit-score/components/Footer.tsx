'use client'

// import NextLink from 'next/link'
import { Container, VStack, Text } from "@chakra-ui/react"


export const Footer = () => {
  return (
    <Container pt='16'>
      <VStack alignItems='start'>
        <VStack alignItems='start' spacing={0}>
          <Text fontSize='sm'>1300 755 494</Text>
          <Text  fontSize='sm'>contact@driva.com.au</Text>
        </VStack>
        <VStack alignItems='start' spacing={0}>
          <Text fontSize='sm'>ABN 37 636 659 160</Text>
          <Text fontSize='sm'>Australian Credit Licence No. 531492</Text>
        </VStack>
        <VStack alignItems='start' spacing={0}>
          {/* <NextLink href='https://www.driva.com.au/legal/'><Text fontSize='sm'>Terms of Use</Text></NextLink>
          <NextLink href='https://www.driva.com.au/legal/'><Text fontSize='sm'>Privacy Policy</Text></NextLink> */}
        </VStack>
      </VStack>
    </Container>
  )
}