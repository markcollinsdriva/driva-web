'use client'

import { 
  calculateLoanRepayment,
  calculateLoanAmount, 
  LoanInputsOptional,
  LoanInputsBase, 
  CalculatorDefaults,
  SolveFor
} from '@/services/calculators/loan'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export { SolveFor }

export const useLoanCalculator = ({
    defaultValues = CalculatorDefaults,
    solveFor, 
    debounce = 200
  }: {
    defaultValues?: LoanInputsBase,
    solveFor: SolveFor,
    debounce?: number
  }
) => {
  const [ _values, setState ] = useState<LoanInputsBase>(defaultValues)
  const [ values ] = useDebounce(_values, debounce);

  const setValues = (newValues: LoanInputsOptional) => {
    setState(state => ({ ...state, ...newValues }))
  }

  useEffect(() => {
    if (solveFor === SolveFor.RepaymentAmount) {
      const repaymentAmount = calculateLoanRepayment({
        loanAmount: values.loanAmount, 
        loanTermYears: values.loanTermYears, 
        interestRatePerAnnum: values.interestRatePerAnnum, 
        repaymentPeriod: values.repaymentPeriod
      })
      setState({ ...values, repaymentAmount })
      return 
    } 

    if (solveFor === SolveFor.LoanAmount) {
      const loanAmount = calculateLoanAmount({
        repaymentAmount: values.repaymentAmount, 
        loanTermYears: values.loanTermYears, 
        interestRatePerAnnum: values.interestRatePerAnnum, 
        repaymentPeriod: values.repaymentPeriod
      })
      setState({ ...values, loanAmount })
      return
    }       
  }, [ values, solveFor ])

  return { values, setValues }
}

