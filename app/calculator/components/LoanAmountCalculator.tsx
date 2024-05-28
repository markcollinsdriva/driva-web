'use client'

import { 
  LoanAmountInput, 
  LoanTermInput, 
  LoanRepaymentFrequencyInput,
  InterestRateInput,
  RepaymentInput,
} from './LoanCalculatorInputs'
import { SolveFor, useLoanCalculator } from './useLoanCalculator'

export default function LoanAmountCalculator() {
  const { values, setValues } = useLoanCalculator({
    solveFor: SolveFor.LoanAmount
  })

  return (
    <>
      <RepaymentInput 
        value={values.repaymentAmount}
        onValueChange={repaymentAmount => setValues({ repaymentAmount })}/>
      <LoanRepaymentFrequencyInput 
        value={values.repaymentPeriod}
        onValueChange={repaymentPeriod => setValues({ repaymentPeriod })}/>
      <LoanTermInput 
        value={values.loanTermYears}
        onValueChange={loanTermYears => setValues({ loanTermYears })}/>
      <InterestRateInput 
        value={values.interestRatePerAnnum}
        onValueChange={interestRatePerAnnum => setValues({ interestRatePerAnnum })}/>
      <LoanAmountInput 
        value={values.loanAmount}
        onValueChange={loanAmount => setValues({ loanAmount })}/>
    </>
  )
}


