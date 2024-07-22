import Image from 'next/image'
import { Box } from '@chakra-ui/react'

export const HeaderLogo = () => {
  return (
    <Box py='4'>
      <Image 
        priority
        src='/images/driva-logo.svg' 
        width={0} height={0} 
        style={{ width: '100px', height: 'auto' }}
        alt='Driva logo' />
    </Box>
  )
}