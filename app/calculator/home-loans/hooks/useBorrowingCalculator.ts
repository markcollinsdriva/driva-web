import { create } from 'zustand'
import { produce } from 'immer'
import { HomeLoan } from '../config'
import { FinancePurpose, Frequency, IncomeType, InvestmentType, NumberOfApplicants } from '../config'

export interface BorrowingCalculatorState {
  homeLoan: HomeLoan
}

interface BorrowingCalculatorStore extends BorrowingCalculatorState {
  updateValue: (updateFunction: (state: BorrowingCalculatorState) => void) => void
  calculate: () => void
}

const defaultHomeLoan: HomeLoan = {
  financePurpose: FinancePurpose.New,
  numberOfApplicants: NumberOfApplicants.One,
  investmentType: InvestmentType.LiveIn,
  numberOfDependents: 0,
  loanAmount: null,
  loanTermYears: null,
  loanDeposit: null,
  income: {
    applicant1Income: {
      baseIncome: {
        type: IncomeType.Base,
        number: 0,
        frequency: Frequency.Monthly
      },
      overtimeIncome: {
        type: IncomeType.Overtime,
        number: 0,
        frequency: Frequency.Monthly
      },
      bonusIncome: {
        type: IncomeType.Bonus,
        number: 0,
        frequency: Frequency.Monthly
      },
      commissionIncome: {
        type: IncomeType.Commission,
        number: 0,
        frequency: Frequency.Monthly
      },
      otherIncome: {
        type: IncomeType.Other,
        number: 0,
        frequency: Frequency.Monthly
      }
    },
    applicant2Income: {
      baseIncome: {
        type: IncomeType.Base,
        number: 0,
        frequency: Frequency.Monthly
      },
      overtimeIncome: {
        type: IncomeType.Overtime,
        number: 0,
        frequency: Frequency.Monthly
      },
      bonusIncome: {
        type: IncomeType.Bonus,
        number: 0,
        frequency: Frequency.Monthly
      },
      commissionIncome: {
        type: IncomeType.Commission,
        number: 0,
        frequency: Frequency.Monthly
      },
      otherIncome: {
        type: IncomeType.Other,
        number: 0,
        frequency: Frequency.Monthly
      }
    },
    rentalIncome: {
      type: IncomeType.Rental,
      number: 0,
      frequency: Frequency.Monthly
    },
  },
  expenses: {
    livingExpenses: {
      number: 0,
      frequency: Frequency.Monthly
    },
    rentalExpenses: {
      number: 0,
      frequency: Frequency.Monthly
    },
    loanRepayments: {
      number: 0,
      frequency: Frequency.Monthly
    },
  },
  liabilities: {
    creditCardLimit: 0
  }
}


const defaultState: BorrowingCalculatorState = {
  homeLoan: defaultHomeLoan
}

export const useBorrowingCalculator = create<BorrowingCalculatorStore>((set, get) => ({
  ...defaultState,
  updateValue: (updateFunction) => {
    set(produce((draft: BorrowingCalculatorState) => updateFunction(draft)))
  },
  calculate: () => {
    const { homeLoan } = get()
    // convert all incomes to monthly
    // convert all expenses to monthly
  }
}))

