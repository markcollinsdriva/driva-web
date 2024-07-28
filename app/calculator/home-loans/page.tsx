'use client'

import { Heading, Button, Container, VStack, Divider  } from '@chakra-ui/react'
import { useHomeLoanCalculator } from '@/app/calculator/home-loans/hooks/useHomeLoanCalculator'
import { 
  NumberOfApplicantsForm,
  InvestmentTypeForm,
  DependentsForm,
  IncomeForm,
  ExpensesForm
 } from './components/Inputs'

 import { 
  BorrowingPowerResults, 
  ScenarioPlanner,
  LoanAmountInput,
  LoanDepositInput 
} from './components/Scenarios'

export default function Page() {
  const { homeLoan, calculate } = useHomeLoanCalculator()

  return (
    <Container mb='10'>
      <VStack spacing={4}>
        <NumberOfApplicantsForm />
        <InvestmentTypeForm />
        <DependentsForm />
        <IncomeForm />
        <ExpensesForm />
        <Divider />
        {!homeLoan.maxLoanAmount 
          ? <Button w='full' onClick={() => calculate()}>Calculate</Button>
          : <>
              <Heading w='full'>Your results</Heading>
              <BorrowingPowerResults />
              <Divider />
              <ScenarioPlanner />
              <LoanAmountInput />
              <LoanDepositInput />
            </> }
      </VStack>
    </Container>
  )
}


