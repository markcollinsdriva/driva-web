'use client'

import { CurrencyInput } from '@/components/CurrencyInput'
import { ToggleButtons } from '@/components/ToggleButtons'
import { FormControl, FormHelperText, FormLabel, Select, Text, Heading } from '@chakra-ui/react'
import { useHomeLoanCalculator } from '@/app/calculator/home-loans/hooks/useHomeLoanCalculator'
import { NumberOfApplicants, InvestmentType } from '@/app/calculator/home-loans/config'
import { NumberFrequencyInputSimple } from './NumberInputs'

export const NumberOfApplicantsForm = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <>
      <Heading w='full' fontSize='xl'>Who is this loan for?</Heading>
      <FormControl>
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
    </>
  )
}

export const InvestmentTypeForm = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <>
      <Heading w='full' fontSize='xl'>About the place</Heading>
      <FormControl>
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
    </>
  )
}

export const DependentsForm = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <>
      <Heading w='full' fontSize='xl'>Dependents</Heading>
      <FormControl>
        <FormLabel fontWeight='bold'>How many dependents do you support?</FormLabel>
          <Select 
            value={homeLoan.numberOfDependents?.toString() ?? '0'}
            onChange={(e) => updateValue(draft => {
              draft.homeLoan.numberOfDependents = e.target.value ? Number(e.target.value) : null
            })}
            >
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6 or more</option>
          </Select>
        <FormHelperText>Children under the age of 18 or adults who depend on your income and live in your home.</FormHelperText>
      </FormControl>
    </>
  )
}

export const IncomeForm = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <>
      <Heading w='full' fontSize='xl'>Your income</Heading>
      <NumberFrequencyInputSimple
        label='Salary'
        helperText='Include salary before tax.'
        objectGetter={homeLoan => homeLoan.income.applicant1Income.base}/>
      <NumberFrequencyInputSimple
        label='Supplementary income'
        helperText='Include regular bonuses, commissions and overtime'
        objectGetter={homeLoan => homeLoan.income.applicant1Income.supplementary}/>
      <NumberFrequencyInputSimple
        label='Other income'
        helperText='Include income such as allowances and government benefits.'
        objectGetter={homeLoan => homeLoan.income.applicant1Income.other}/>

      {homeLoan.numberOfApplicants === NumberOfApplicants.Two ? 
        <>
          <Heading w='full' fontSize='xl'>Co borrower income</Heading>
          <NumberFrequencyInputSimple
            label='Salary'
            helperText='Include salary before tax.'
            objectGetter={homeLoan => homeLoan.income.applicant2Income.base}/>
          <NumberFrequencyInputSimple
            label='Supplementary income'
            helperText='Include regular bonuses, commissions and overtime'
            objectGetter={homeLoan => homeLoan.income.applicant2Income.supplementary}/>
          <NumberFrequencyInputSimple
            label='Other income'
            helperText='Include income such as allowances and government benefits.'
            objectGetter={homeLoan => homeLoan.income.applicant2Income.other}/>
          <Text fontSize='xl'>Other income</Text>
        </> : null}

      <NumberFrequencyInputSimple
        label='Rental Income'
        helperText='Income from an investment property you want to buy or already own.'
        objectGetter={homeLoan => homeLoan.income.rentalIncome}/>
    </>
  )
}

export const ExpensesForm = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <>
      <Heading w='full' fontSize='xl'>Expenses</Heading>
      <NumberFrequencyInputSimple
        label='Total living expenses'
        helperText='Include all borrowers ongoing expenses e.g. food, bills, utilities, education, entertainment.'
        objectGetter={homeLoan => homeLoan.expenses.livingExpenses}/>
      <NumberFrequencyInputSimple
        label='Rent'
        helperText='Ongoing rental payments.'
        objectGetter={homeLoan => homeLoan.expenses.rentalExpenses}/>
      <NumberFrequencyInputSimple
        label='Loan repayments'
        helperText='Include all borrowers car loans, personal loans or student loan repayments.'
        objectGetter={homeLoan => homeLoan.expenses.loanRepayments}/>
      <FormControl>
        <FormLabel  fontWeight='bold'>Credit card limits</FormLabel>
        <CurrencyInput 
          value={(homeLoan.liabilities.creditCardLimit ?? 0)} 
          onValueChange={value => updateValue(draft => {
            draft.homeLoan.liabilities.creditCardLimit  = (value ? Number(value) : 0)
          })} />
        <FormHelperText>Combined limits of all borrowers, including store cards.</FormHelperText>
      </FormControl>
    </>
  )
}