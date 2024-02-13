'use client'

import { RepaymentPeriod } from '@/app/lib/calculators'
import { 
  LoanAmountInput, 
  LoanTermInput, 
  LoanRepaymentFrequencyInput,
  InterestRateInput,
  RepaymentInput,
} from './LoanCalculator'
import { useLoanCalculator } from './useLoanCalculator'

export default function LoanAmountCalculator() {
  const { values, setValues } = useLoanCalculator({
    loanAmount: 0,
    repaymentAmount: 0,
    loanTermYears: 5,
    interestRatePerAnnum: 7.0,
    repaymentPeriod: RepaymentPeriod.MONTHLY
  }, {
    solveFor: 'loanAmount'
  })

  return (
    <>
      <RepaymentInput 
        value={values.repaymentAmount}
        onValueChange={repaymentAmount => setValues({ repaymentAmount})}/>
      <LoanRepaymentFrequencyInput 
        value={values.repaymentPeriod}
        onValueChange={repaymentPeriod => setValues({ repaymentPeriod})}/>
      <LoanTermInput 
        value={values.loanTermYears}
        onValueChange={loanTermYears => setValues({ loanTermYears})}/>
      <InterestRateInput 
        value={values.interestRatePerAnnum}
        onValueChange={interestRatePerAnnum => setValues({ interestRatePerAnnum})}/>
      <LoanAmountInput 
        value={values.loanAmount}
        onValueChange={loanAmount => setValues({ loanAmount})}/>
    </>
  )
}


