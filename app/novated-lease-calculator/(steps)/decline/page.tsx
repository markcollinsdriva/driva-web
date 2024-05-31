'use client'

import { Box } from '@chakra-ui/react'
import { PageName } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'

const pageName = PageName.Decline

export default function Page() {
  return (<>
    <FormPage pageName={pageName}>
      <Box>We're really sorry, but based on the details provided you're not eligible for a novated lease estimate at this time. </Box>
    </FormPage>
  </>)
}
