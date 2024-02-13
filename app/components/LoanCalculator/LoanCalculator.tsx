'use client'

import { 
  calculateLoanRepayment,
  calculateLoanAmount, 
  RepaymentPeriod, 
  LoanInputsOptional,
  LoanInputsBase 
} from '@/app/lib/calculators'
import { Button, ButtonProps, FormControl, FormLabel, Input, } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Radio, RadioGroup } from '@chakra-ui/react'
import React, { Children, useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'

interface Input {
  value?: number,
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
            isChecked={value === RepaymentPeriod.WEEKLY}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.WEEKLY}>
            Weekly
          </CustomRadio>
          {/* <CustomRadio<RepaymentPeriod> 
            isChecked={value === RepaymentPeriod.FORTNIGHTLY}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.FORTNIGHTLY}>
            Fortnightly
          </CustomRadio> */}
          <CustomRadio<RepaymentPeriod> 
            isChecked={value === RepaymentPeriod.MONTHLY}
            onChange={value => onValueChange(value)}
            value={RepaymentPeriod.MONTHLY}>
            Monthly
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
  return (
    <FormControl>
      <FormLabel>Interest Rate</FormLabel>
      <NumericFormat 
        value={value} 
        onValueChange={(values) => onValueChange(values.floatValue)}
        suffix={'%'}
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        customInput={Input} />
    </FormControl>
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

