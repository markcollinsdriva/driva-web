'use client'

import React, { useState } from 'react'
import { 
  Stack, 
  Button, 
  FormControl, 
  FormLabel, 
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
 } from '@chakra-ui/react'
import { NumericFormat } from 'react-number-format'
import { RepaymentPeriod } from '@/app/lib/calculators'


interface Input {
  value: number,
  onValueChange: (value?: number) => unknown
}

export const LoanAmountInput = ({ value, onValueChange }: Input) => {
  return (
    <FormControl>
      <FormLabel>Loan Amount</FormLabel>
      <NumericFormat 
        prefix={'$'}
        allowNegative={false}
        thousandSeparator=','
        customInput={Input} 
        value={value} 
        onValueChange={(values) => onValueChange(values.floatValue)}  />
    </FormControl>
  )
}

export const LoanTermInput = ({ value, onValueChange }: Input) => {
  return (
    <FormControl>
      <FormLabel>Loan term (years)</FormLabel>
      <NumericFormat 
        value={value} 
        onValueChange={(values) => onValueChange(values.floatValue)}
        allowNegative={false}
        decimalScale={0}
        customInput={Input} />
    </FormControl>
  )
}

export const LoanRepaymentFrequencyInput = ({ value, onValueChange }: {
  value: RepaymentPeriod,  
  onValueChange: (value: RepaymentPeriod) => any
}) => {
  return (
    <FormControl>
      <FormLabel>Repayments</FormLabel>
      {/* <RadioGroup  */}
        {/* value={value} */}
        {/* > */}
        <Stack direction='row'>
          <CustomRadio<RepaymentPeriod> 
            isChecked={value === RepaymentPeriod.Weekly}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.Weekly}>
            Weekly
          </CustomRadio>
          {/* <CustomRadio<RepaymentPeriod> 
            isChecked={value === RepaymentPeriod.Fortnightly}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.Fortnightly}>
            Fortnightly
          </CustomRadio> */}
          <CustomRadio<RepaymentPeriod> 
            isChecked={value === RepaymentPeriod.Montly}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.Montly}>
            Montly
          </CustomRadio>
        </Stack>
      {/* </RadioGroup> */}
    </FormControl>
  )
}

interface CustomRadio<T>{ 
  children: React.ReactNode
  isChecked: boolean, 
  isDisabled?: boolean, 
  value: T, 
  onChange: (value: T) => any,
}

const CustomRadio = <T,>(props: CustomRadio<T>) => {
  const { isChecked, isDisabled = false, value, onChange, children } = props
  return (
    <Button
      // backgroundColor={isChecked ? "blue" : "gray"}
      aria-checked={isChecked}
      role="radio"
      onClick={() => onChange(value)}
      isDisabled={isDisabled}>
      {children}
    </Button>
  )
}


export const InterestRateInput = ({ value, onValueChange }: Input) => {
  const [ valueAsPercentage, setValueAsPercentage ] = useState<number|undefined>(100 * value)

  const handleValueChange = (newValue?: number) => {
    setValueAsPercentage(newValue)
    onValueChange(newValue ? newValue / 100 : newValue)
  }

  return (
    <>
    <FormControl>
      <FormLabel>Interest Rate</FormLabel>
      <NumericFormat 
        value={valueAsPercentage} 
        onValueChange={(values) => handleValueChange(values.floatValue)}
        suffix={'%'}
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        customInput={Input} />
    </FormControl>
    <Slider 
      value={valueAsPercentage}
      onChange={(val) => handleValueChange(val)}
      min={6} 
      max={16} 
      step={0.2}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={6} />
    </Slider>
  </>
  )
}

export const RepaymentInput = ({ value, onValueChange }: Input) => {
  return (
    <FormControl>
      <FormLabel>Repayment</FormLabel>
      <NumericFormat 
        value={value} 
        onValueChange={(values) => onValueChange(values.floatValue)}
        prefix={'$'}
        allowNegative={false}
        thousandSeparator=','
        customInput={Input} />
    </FormControl>
  )
}

