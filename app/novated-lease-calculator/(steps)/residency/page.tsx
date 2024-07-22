'use client'

import { FormControl, FormLabel } from '@chakra-ui/react'
import { PageName, residencyStatusOptions, livingSituationOptions, LivingSiutation } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'
import { ToggleButtons } from '@/components/ToggleButtons'
import { Dropdown } from '@/app/novated-lease-calculator/components/Dropdown'
import { useStore } from '@/app/novated-lease-calculator/store'


const pageName = PageName.Residency
const _residencyStatusOptions = [...residencyStatusOptions]
const _livingSituationOptions = [...livingSituationOptions]

export default function Page() {
  const residencyStatus = useStore(store => store.residencyStatus)
  const updateValue = useStore(store => store.updateValue)

  return (<>
    <FormPage pageName={pageName}>
      <FormControl>
        <FormLabel>What is your residency status?</FormLabel>
        <ToggleButtons
          options={_residencyStatusOptions}
          onChange={option => updateValue('residencyStatus', option.value)}
          getLabel={option => option.label}
          getIsSelected={option => option.value === residencyStatus}
        />
      </FormControl>
      <FormControl>
        <FormLabel>What is your current living situation?</FormLabel>
        <Dropdown 
          options={_livingSituationOptions}
          onChange={(option) => updateValue('livingSituation', option.value as LivingSiutation)}
        />
      </FormControl>
    </FormPage>
  </>)
}


