'use client'

import { FormControl, FormLabel } from '@chakra-ui/react'
import { useStore } from '@/app/novated-lease-calculator/store'
import { PageName } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'
import { CurrencyInput } from '@/components/CurrencyInput'

const pageName = PageName.Price

export default function Page() {
  const estimatedVehiclePrice = useStore(store => store.estimatedVehiclePrice)
  const updateValue = useStore(store => store.updateValue)

  return (<>
    <FormPage pageName={pageName}>
      <FormControl>
        <FormLabel>An estimate is fine</FormLabel>
        <CurrencyInput 
          value={estimatedVehiclePrice} 
          onValueChange={(value) => updateValue('estimatedVehiclePrice', value ?? null)}/>
      </FormControl>
    </FormPage>
  </>)
}
