'use client'

import { CurrencyInput } from "@/components/CurrencyInput"
import { ToggleButtons } from '@/components/ToggleButtons'
import { cookieStorageManager, FormControl, FormHelperText, FormLabel, HStack, Select, Text, VStack } from "@chakra-ui/react"
import { BorrowingCalculatorState, useBorrowingCalculator } from '@/app/calculator/home-loans/hooks/useBorrowingCalculator'
import { FinancePurpose, Frequency, NumberOfApplicants, HomeLoan, NumberFrequency, InvestmentType } from '@/app/calculator/home-loans/config'

export default function Page() {
  const { homeLoan, updateValue } = useBorrowingCalculator()
  console.log(homeLoan.expenses.loanRepayments)
  return (
    <main>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Loan type</FormLabel>
          <ToggleButtons 
            options={[
              { label: 'New loan', value: FinancePurpose.New },
              { label: 'Refinance', value: FinancePurpose.Refinance }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.financePurpose = option.value
            })}
            getIsSelected={option => option.value === homeLoan.financePurpose}
            getLabel={option => option.label}/>
        </FormControl>
        <FormControl>
          <FormLabel>How many people</FormLabel>
          <ToggleButtons 
            options={[
              { label: 'Just me', value: NumberOfApplicants.One },
              { label: 'Me and a partner', value: NumberOfApplicants.Two }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.numberOfApplicants = option.value
            })}
            getIsSelected={option => option.value === homeLoan.numberOfApplicants}
            getLabel={option => option.label}/>
        </FormControl>
        <FormControl>
          <FormLabel>Purpose</FormLabel>
          <ToggleButtons 
            options={[
              { label: 'Live in', value: InvestmentType.LiveIn },
              { label: 'Invest', value: InvestmentType.Investment }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.investmentType = option.value
            })}
            getIsSelected={option => option.value === homeLoan.investmentType}
            getLabel={option => option.label}/>
        </FormControl>
        <NumberFrequencyInputSimple
          label="Your income"
          objectGetter={homeLoan => homeLoan.income.applicant1Income.baseIncome}/>
        <NumberFrequencyInputSimple
          label="Total living expenses"
          objectGetter={homeLoan => homeLoan.expenses.livingExpenses}/>
        <NumberFrequencyInputSimple
          label="Rent"
          objectGetter={homeLoan => homeLoan.expenses.rentalExpenses}/>
        <NumberFrequencyInputSimple
          label="Loan repayments"
          objectGetter={homeLoan => homeLoan.expenses.loanRepayments}/>
      </VStack>
    </main>
  )
}

const NumberFrequencyInput = ({ 
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
      <FormLabel>{label}</FormLabel>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      <HStack>
        <CurrencyInput 
          value={value} 
          onValueChange={onValueChange}/>
        <FrequencySelect 
          value={frequencyValue}
          onChange={e => onFrequencyChange(e.target.value)}
        />
      </HStack>
    </FormControl>
  )
}

const NumberFrequencyInputSimple = ({
  label,
  helperText,
  objectGetter
}: {
  label: string
  helperText?: string,
  objectGetter: (homeLoan: HomeLoan) => NumberFrequency
}) => {
  const { homeLoan, updateValue } = useBorrowingCalculator()
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

const FrequencySelect = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select {...props} >
      <option value={Frequency.Weekly}>Weekly</option>
      <option value={Frequency.Fortnightly}>Fortnightly</option>
      <option value={Frequency.Monthly}>Monthly</option>
      <option value={Frequency.Yearly}>Yearly</option>
    </Select>
  )
}


