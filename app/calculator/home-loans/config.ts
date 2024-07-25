export enum Frequency {
  Weekly = 'weekly',
  Fortnightly = 'fortnightly',
  Monthly = 'monthly',
  Yearly = 'yearly'
}

export enum IncomeType {
  Base = 'base',
  Overtime = 'overtime',
  Bonus = 'bonus',
  Commission = 'commission',
  Other = 'other',
  Rental = 'rental'
}

export interface NumberFrequency {
  number: number,
  frequency: Frequency
}

export interface Expense extends NumberFrequency {
}

export interface Income extends NumberFrequency {
  type: IncomeType
}

export interface ApplicantIncome {
  baseIncome: Income,
  overtimeIncome: Income,
  bonusIncome: Income,
  commissionIncome: Income,
  otherIncome: Income
}


export enum FinancePurpose {
  New = 'new',
  Refinance = 'refinance'
}

export enum NumberOfApplicants {
  One = 1,
  Two = 2
}

export enum InvestmentType {
  LiveIn = 'liveIn',
  Investment = 'investment'
}

export interface HomeLoan {
  financePurpose: FinancePurpose
  numberOfApplicants: NumberOfApplicants
  investmentType: InvestmentType
  numberOfDependents: number | null
  loanAmount: number  | null
  loanTermYears: number | null
  loanDeposit: number | null
  income: {
    applicant1Income: ApplicantIncome
    applicant2Income: ApplicantIncome
    rentalIncome: Income
  },
  expenses: {
    livingExpenses: Expense
    rentalExpenses: Expense
    loanRepayments: Expense
  },
  liabilities: {
    creditCardLimit: number
  }
}

