'use client'

import {  FormControl, FormLabel } from '@chakra-ui/react'
import { LeaseTerm, PageName, leaseTermOptions } from '@/app/novated-lease-calculator/types'
import { FormPage } from '@/app/novated-lease-calculator/components/FormWrappers'
import { ToggleButtons } from '@/components/ToggleButtons'
import { useStore } from '@/app/novated-lease-calculator/store'

const pageName = PageName.Vehicle
const _leaseTermOptions = [...leaseTermOptions]
const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

export default function Page() {
  const isElectricOfPlugInHybrid = useStore(store => store.isElectricOfPlugInHybrid)
  const leaseTerm = useStore(store => store.leaseTerm)
  const updateValue = useStore(store => store.updateValue)

  const updateIsElectricOfPlugInHybrid = (value: string) => {
    updateValue('isElectricOfPlugInHybrid', value === 'true')
  }

  const checkIfElectricOrPlugInHybrid = (value: string) => isElectricOfPlugInHybrid === (value === 'true')

  const updateLeaseTerm = (value: string) => {
    const leaseTerm = Number(value)
    if (isNaN(leaseTerm)) return
    updateValue('leaseTerm', leaseTerm as LeaseTerm)
  } 

  return (<>
    <FormPage pageName={pageName}>
      <FormControl>
        <FormLabel>Is this an electric vehicle or plug-in hybrid?</FormLabel>
        <ToggleButtons 
          options={yesNoOptions}
          onChange={(option) => updateIsElectricOfPlugInHybrid(option.value)}
          getLabel={option => option.label}
          getIsSelected={option => checkIfElectricOrPlugInHybrid(option.value) }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Lease term</FormLabel>
        <ToggleButtons 
          options={_leaseTermOptions}
          onChange={(option) => updateLeaseTerm(option.value)}
          getLabel={option => option.label}
          getIsSelected={option => option.value === leaseTerm?.toString()}
        />
      </FormControl>
    </FormPage>
  </>)
}

