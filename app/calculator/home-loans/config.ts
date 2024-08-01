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
  base: Income,
  supplementary: Income,
  other: Income
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
  numberOfDependents: number|null
  loanAmount: number|null
  repaymentAmount: number|null
  maxLoanAmount: number|null
  loanTermYears: number
  loanDeposit: number|null
  loanDepositPerc: number
  interestRatePerAnnum: number|null
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


// export enum ProductName {
//   Basic = 'basic'
// }

// export enum DepositPerc {
//   _15 = 0.15,
//   _20 = 0.2,
//   _30 = 0.3,
//   _40 = 0.4,
// }

// export const Rates = {
//   [ProductName.Basic]: {
//     [DepositPerc._15]: {
//       interestRatePerAnnum: 0.0674,
//       comparisonRate: 0.0697
//     },
//     [DepositPerc._20]: {
//       interestRatePerAnnum: 0.0619,
//       comparisonRate: 0.0643
//     },
//     [DepositPerc._30]: {
//       interestRatePerAnnum: 0.0619,
//       comparisonRate: 0.0643
//     },
//     [DepositPerc._40]: {
//       interestRatePerAnnum: 0.0614,
//       comparisonRate: 0.0638
//     }
//   }
// } as const