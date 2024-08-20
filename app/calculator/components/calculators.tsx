export enum RepaymentPeriod {
  Weekly,
  Fortnightly,
  Montly
}

export enum SolveFor {
  LoanAmount,
  RepaymentAmount
}

export interface LoanInputsBase {
  loanAmount: number,
  repaymentAmount: number,
  loanTermYears: number,
  interestRatePerAnnum: number
  repaymentPeriod: RepaymentPeriod
}

export type LoanInputsOptional = Partial<LoanInputsBase>
export type LoanScenarioAmount = Omit<LoanInputsBase, 'repaymentAmount'>
export type LoanScenarioRepayment = Omit<LoanInputsBase, 'loanAmount'>

export const NumberOfRepaymentPeriodsPerYear = {
  [RepaymentPeriod.Weekly]: 52,
  [RepaymentPeriod.Fortnightly]: 26,
  [RepaymentPeriod.Montly]: 12,
} as const

export const CalculatorDefaults: LoanInputsBase = {
  loanAmount: 0,
  repaymentAmount: 0,
  loanTermYears: 5,
  interestRatePerAnnum: 0.07,
  repaymentPeriod: RepaymentPeriod.Montly
}

export const calculateInterestRatePerPeriod = ({ 
  interestRatePerAnnum, 
  periodsPerYear 
}: { 
  interestRatePerAnnum: number, 
  periodsPerYear: typeof NumberOfRepaymentPeriodsPerYear[RepaymentPeriod] 
}): number => {
  return interestRatePerAnnum / periodsPerYear
  //return (Math.pow(1 + interestRatePerAnnum, 1 / periodsPerYear) - 1) 
  // this seems more mathematically correct but it isn't how calculators do it
}


export const calculateLoanRepayment = (inputs: LoanScenarioAmount): number => {
  const { loanTermYears, loanAmount, interestRatePerAnnum, repaymentPeriod } = inputs
  
  const periodsPerYear = NumberOfRepaymentPeriodsPerYear[repaymentPeriod]
  const numberOfPayments = loanTermYears * periodsPerYear

  const interestRatePerPeriod = calculateInterestRatePerPeriod({ interestRatePerAnnum, periodsPerYear })

  const paymentPerPeriod = Math.round((loanAmount * interestRatePerPeriod) / (1 - Math.pow(1 + interestRatePerPeriod, - numberOfPayments)))
  return paymentPerPeriod
}


export const calculateLoanAmount = (inputs: LoanScenarioRepayment): number => {
  const { loanTermYears, repaymentAmount, interestRatePerAnnum, repaymentPeriod } = inputs
  
  const periodsPerYear = NumberOfRepaymentPeriodsPerYear[repaymentPeriod]
  const numberOfPayments = loanTermYears * periodsPerYear

  const interestRatePerPeriod = calculateInterestRatePerPeriod({ interestRatePerAnnum, periodsPerYear })

  const discountFactor = (Math.pow(1 + interestRatePerPeriod, numberOfPayments) - 1) / (interestRatePerPeriod * Math.pow(1 + interestRatePerPeriod, numberOfPayments))
  const loanAmount = Math.round(repaymentAmount * discountFactor)
  return loanAmount
}








