import { calculateInterestRatePerPeriod } from './loan'

export interface BorrowingPowerInputs {
  monthlyIncome: number
  monthlyExpenses: number
  deposit: number
  interestRatePerAnnum: number
  loanTermYears: number
  creditCardLimit: number
  safetyBufferPerc?: number
  creditCardRepaymentsPercOfLimit?: number
}

export const calculateBorrowingPower = ({
  monthlyIncome,
  monthlyExpenses,
  deposit,
  interestRatePerAnnum,
  loanTermYears,
  safetyBufferPerc = 0.1,
  creditCardLimit,
  creditCardRepaymentsPercOfLimit = 0.03
}: BorrowingPowerInputs) => {
  // console.log({
  //   monthlyIncome,
  //   monthlyExpenses,
  //   deposit,
  //   interestRatePerAnnum,
  //   loanTermYears,
  //   safetyBufferPerc,
  //   creditCardLimit,
  //   creditCardRepaymentsPercOfLimit
  // })
  const creditCardRepayments = creditCardLimit * creditCardRepaymentsPercOfLimit
  const safetyBufferAmount = (monthlyIncome - monthlyExpenses - creditCardRepayments) * (safetyBufferPerc)
  const netMonthlyIncome = monthlyIncome - monthlyExpenses - creditCardRepayments - safetyBufferAmount
  const monthsPerYear = 12
  const monthlyRate = calculateInterestRatePerPeriod({ interestRatePerAnnum, periodsPerYear: monthsPerYear })
  const numberOfPayments = loanTermYears * monthsPerYear
  const borrowingPower = Math.round(
    (netMonthlyIncome * (1 - Math.pow(1 + monthlyRate, -numberOfPayments))) / monthlyRate
  )

  return { 
    maxLoanAmount: borrowingPower, 
    deposit,
    maxPropertyPrice: borrowingPower + deposit,
    monthlyRepayment: netMonthlyIncome,
    loanTermYears
  }
}

