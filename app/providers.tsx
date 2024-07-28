'use client'

import { useEffect } from 'react'
import { init as initFullStory } from '@fullstory/browser'
import {
  ChakraProvider, 
  ColorModeScript,
} from '@chakra-ui/react'
import { IS_PROD } from '@/lib/config'
import { customTheme } from './theme'

const FULL_STORY_ORG_ID = 'YNW75'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if (!IS_PROD) return;
    initFullStory({ orgId: FULL_STORY_ORG_ID })
  }, [])

  return (
    <>
      <ColorModeScript initialColorMode='light' />
      <ChakraProvider 
        theme={customTheme}>
        {children}
      </ChakraProvider>
    </>
  );
}
