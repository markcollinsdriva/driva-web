'use client'

import Image from 'next/image'
import { Box } from '@chakra-ui/react'

export const HeaderLogo = () => {
  return (
    <Box pb='2'>
      <Image 
        priority
        src='/images/driva-logo-black.svg' 
        width={0} height={0} 
        style={{ width: '100px', height: 'auto' }}
        alt='Driva logo' />
    </Box>
  )
}