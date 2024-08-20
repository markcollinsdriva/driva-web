export const calculateMonthlyLoanRepayment = ({ 
  loanTermYears, 
  loanAmount, 
  interestRatePerAnnum 
}: {
  loanTermYears: number,
  loanAmount: number,
  interestRatePerAnnum: number
}): number => {
  
  const periodsPerYear = 12
  const numberOfPayments = loanTermYears * periodsPerYear - 1 // we subtract one because the last payment is the residual payment

  const interestRatePerPeriod = interestRatePerAnnum / periodsPerYear

  const paymentPerPeriod = (loanAmount * interestRatePerPeriod) / (1 - Math.pow(1 + interestRatePerPeriod, - numberOfPayments))
  return paymentPerPeriod
}