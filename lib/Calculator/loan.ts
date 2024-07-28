
export enum Frequency {
  Weekly = 'weekly',
  Fortnightly = 'fortnightly',
  Monthly = 'monthly',
  Yearly = 'yearly'
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
  repaymentPeriod: Frequency
}

export type LoanInputsOptional = Partial<LoanInputsBase>
export type LoanScenarioAmount = Omit<LoanInputsBase, 'repaymentAmount'>
export type LoanScenarioRepayment = Omit<LoanInputsBase, 'loanAmount'>

export const FrequencyPeriodsPerYear = {
  [Frequency.Weekly]: 52,
  [Frequency.Fortnightly]: 26,
  [Frequency.Monthly]: 12,
  [Frequency.Yearly]: 1,
} as const

export const FrequencyPeriodsPerMonth = {
  [Frequency.Weekly]: 4.3,
  [Frequency.Fortnightly]: 2.15,
  [Frequency.Monthly]: 1,
  [Frequency.Yearly]: 1 / 12,
} as const

export const convertToMonthly = (value: number, from: Frequency): number => Math.round(value * FrequencyPeriodsPerMonth[from])
export const convertToAnnual = (value: number, from: Frequency): number => Math.round(value * FrequencyPeriodsPerYear[from])

export const CalculatorDefaults: LoanInputsBase = {
  loanAmount: 0,
  repaymentAmount: 0,
  loanTermYears: 5,
  interestRatePerAnnum: 0.07,
  repaymentPeriod: Frequency.Monthly
}

export const calculateInterestRatePerPeriod = ({ 
  interestRatePerAnnum, 
  periodsPerYear 
}: { 
  interestRatePerAnnum: number, 
  periodsPerYear: typeof FrequencyPeriodsPerYear[Frequency] 
}): number => {
  return interestRatePerAnnum / periodsPerYear
  //return (Math.pow(1 + interestRatePerAnnum, 1 / periodsPerYear) - 1) 
  // this seems more mathematically correct but isn't how calculators do it
}

export const calculateLoanRepayment = (inputs: LoanScenarioAmount): number => {
  const { loanTermYears, loanAmount, interestRatePerAnnum, repaymentPeriod } = inputs
  
  const periodsPerYear = FrequencyPeriodsPerYear[repaymentPeriod]
  const numberOfPayments = loanTermYears * periodsPerYear

  const interestRatePerPeriod = calculateInterestRatePerPeriod({ interestRatePerAnnum, periodsPerYear })

  const paymentPerPeriod = Math.round((loanAmount * interestRatePerPeriod) / (1 - Math.pow(1 + interestRatePerPeriod, - numberOfPayments)))
  return paymentPerPeriod
}


export const calculateLoanAmount = (inputs: LoanScenarioRepayment): number => {
  const { loanTermYears, repaymentAmount, interestRatePerAnnum, repaymentPeriod } = inputs
  
  const periodsPerYear = FrequencyPeriodsPerYear[repaymentPeriod]
  const numberOfPayments = loanTermYears * periodsPerYear

  const interestRatePerPeriod = calculateInterestRatePerPeriod({ interestRatePerAnnum, periodsPerYear })

  const discountFactor = (Math.pow(1 + interestRatePerPeriod, numberOfPayments) - 1) / (interestRatePerPeriod * Math.pow(1 + interestRatePerPeriod, numberOfPayments))
  const loanAmount = Math.round(repaymentAmount * discountFactor)
  
  return loanAmount
}








