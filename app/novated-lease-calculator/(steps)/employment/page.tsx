'use client'

import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { useStore } from '@/app/novated-lease-calculator/store'
import { PageName } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'
import { CurrencyInput } from '@/components/CurrencyInput'
import { employmentTypeOptions } from '@/app/novated-lease-calculator/types'
import { Dropdown } from '@/components/Dropdown'

const pageName = PageName.Employment
const _employmentTypeOptions = [...employmentTypeOptions]

export default function Page() {
  const grossAnnualSalary = useStore(store => store.grossAnnualSalary)
  const updateValue = useStore(store => store.updateValue)

  return (<>
    <FormPage pageName={pageName}>
      <FormControl>
        <FormLabel>Annual Salary</FormLabel>
        <CurrencyInput 
           value={grossAnnualSalary} 
           onValueChange={(value) => updateValue('grossAnnualSalary', value ?? null)} />
        <FormHelperText>Gross salary, before tax and excluding super.</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Employment Type</FormLabel>
          <Dropdown 
            options={_employmentTypeOptions}
            onChange={(option) => updateValue('employmentType', option.value)}
            />
      </FormControl>
    </FormPage>
  </>)
}
