import {
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react'

import { PPNeue } from './fonts'

const TEXT_COLOR = '#4A4A4A'
const BORDER = '#B3B3B3'
const BUTTON_COLOR = '#FFDD00'

export const customTheme = extendTheme(
  {
    initialColorMode: 'light',
    useSystemColorMode: false,
    styles: {
      global: {
        // styles for the `body`
        body: {
          // bg: 'gray.400',
          // color: 'white',
        },
        button: {
          color: BUTTON_COLOR,
        },
      },
    },
    fonts: {
      body: PPNeue.style.fontFamily,
      heading: PPNeue.style.fontFamily,
      mono: PPNeue.style.fontFamily,
    },
    colors: {
      brand: {
        100: '#FFED7A',
        200: '#FFEA65',
        300: '#FFE751',
        400: '#FFE53D',
        500: '#FFDD00',
        600: '#DABD00',
        700: '#B69D00',
        800: '#917E00',
        900: '#6D5E00',
      },
    },
    components: {
      Button: {
        baseStyle: {
          color: BUTTON_COLOR,
          fontWeight: 'semibold', // Normally, it is 'semibold'
        },
        variants: {
          outline: {
            borderColor: BORDER,
            color: TEXT_COLOR
          },
          solid: {
            bg: 'brand.500',
            color: TEXT_COLOR
          },
          ghost: {
            color: TEXT_COLOR
          }
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'brand' }),
)
