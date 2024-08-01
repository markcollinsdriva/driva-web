'use client'

import { CurrencyInput } from '@/components/CurrencyInput'
import { Box, FormControl, FormHelperText, FormLabel, Select } from '@chakra-ui/react'
import { useHomeLoanCalculator } from '@/app/calculator/home-loans/hooks/useHomeLoanCalculator'
import { Frequency, HomeLoan, NumberFrequency  } from '@/app/calculator/home-loans/config'

export const NumberFrequencyInput = ({ 
  label,
  helperText,
  value, 
  onValueChange, 
  frequencyValue, 
  onFrequencyChange 
}: { 
  label: string
  helperText?: string
  value: number, 
  onValueChange: (value?: number) => unknown, 
  frequencyValue: Frequency, 
  onFrequencyChange: (value: string) => unknown
}) => {
  return (
    <FormControl>
      <FormLabel fontWeight='bold'>{label}</FormLabel>
      <Box position='relative'>
        <CurrencyInput 
          value={value} 
          onValueChange={onValueChange}/>
        <Box position='absolute' right='0' top='0'>
          <FrequencySelect 
            border='none'
            value={frequencyValue}
            onChange={e => onFrequencyChange(e.target.value)}
          />
        </Box>
      </Box>

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  )
}

export const NumberFrequencyInputSimple = ({
  label,
  helperText,
  objectGetter
}: {
  label: string
  helperText?: string,
  objectGetter: (homeLoan: HomeLoan) => NumberFrequency
}) => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <NumberFrequencyInput 
      label={label}
      helperText={helperText}
      value={objectGetter(homeLoan).number} 
      onValueChange={value => updateValue(draft => {
        if (!value) return
        objectGetter(draft.homeLoan).number = value
      })}
      frequencyValue={objectGetter(homeLoan).frequency}
      onFrequencyChange={value => updateValue(draft => {
        objectGetter(draft.homeLoan).frequency = value as Frequency
      })}/>
  )
}

export const FrequencySelect = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select {...props} >
      <option value={Frequency.Weekly}>Weekly</option>
      <option value={Frequency.Fortnightly}>Fortnightly</option>
      <option value={Frequency.Monthly}>Monthly</option>
      <option value={Frequency.Yearly}>Yearly</option>
    </Select>
  )
}


