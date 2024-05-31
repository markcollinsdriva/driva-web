'use client'

import { Box } from '@chakra-ui/react'
import { PageName } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'

const pageName = PageName.Details

export default function Page() {
  return (<>
    <FormPage pageName={pageName}>
      <Box>TBD</Box>
    </FormPage>
  </>)
}
