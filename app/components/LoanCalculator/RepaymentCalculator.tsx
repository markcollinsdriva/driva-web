'use client'

import { 
  LoanAmountInput, 
  LoanTermInput, 
  LoanRepaymentFrequencyInput,
  InterestRateInput,
  RepaymentInput,
} from './LoanCalculatorInputs'
import { SolveFor, useLoanCalculator } from './useLoanCalculator'

export default function RepaymentCalculator() {
  const { values, setValues } = useLoanCalculator({
    solveFor: SolveFor.RepaymentAmount
  })

  return (
    <>
      <LoanAmountInput 
        value={values.loanAmount}
        onValueChange={loanAmount => setValues({ loanAmount })}/>
      <LoanTermInput 
        value={values.loanTermYears}
        onValueChange={loanTermYears => setValues({ loanTermYears })}/>
      <LoanRepaymentFrequencyInput 
        value={values.repaymentPeriod}
        onValueChange={repaymentPeriod => setValues({ repaymentPeriod })}/>
      <InterestRateInput 
        value={values.interestRatePerAnnum}
        onValueChange={interestRatePerAnnum => setValues({ interestRatePerAnnum })}/>
      <RepaymentInput 
        value={values.repaymentAmount}
        onValueChange={repaymentAmount => setValues({ repaymentAmount })}/>
    </>
  )
}


