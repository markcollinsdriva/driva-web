import { create } from 'zustand'
import { produce } from 'immer'
import { HomeLoan } from '../config'
import { FinancePurpose, Frequency, IncomeType, InvestmentType, NumberOfApplicants } from '../config'
import { calculateBorrowingPower } from '@/services/calculators/borrowingPower'
import { calculateLoanRepayment, convertToAnnual, convertToMonthly } from '@/services/calculators/loan'
import { calculateSalaryAmounts } from '@/services/calculators/salaryCalculator'

export interface HomeLoanCalculatorState {
  homeLoan: HomeLoan
}

interface HomeLoanCalculatorStore extends HomeLoanCalculatorState {
  updateValue: (updateFunction: (state: HomeLoanCalculatorState) => void) => void
  calculate: () => void
}

const defaultHomeLoan: HomeLoan = {
  financePurpose: FinancePurpose.New,
  numberOfApplicants: NumberOfApplicants.One,
  investmentType: InvestmentType.LiveIn,
  numberOfDependents: 0,
  loanAmount: 0,
  repaymentAmount: 0,
  maxLoanAmount: 0,
  loanTermYears: 30,
  loanDeposit: 0,
  loanDepositPerc: 0.2,
  interestRatePerAnnum: 0.067,
  income: {
    applicant1Income: {
      base: {
        type: IncomeType.Base,
        number: 0,
        frequency: Frequency.Yearly
      },
      supplementary: {
        type: IncomeType.Overtime,
        number: 0,
        frequency: Frequency.Yearly
      },
      other: {
        type: IncomeType.Other,
        number: 0,
        frequency: Frequency.Yearly
      }
    },
    applicant2Income: {
      base: {
        type: IncomeType.Base,
        number: 0,
        frequency: Frequency.Yearly
      },
      supplementary: {
        type: IncomeType.Overtime,
        number: 0,
        frequency: Frequency.Yearly
      },
      other: {
        type: IncomeType.Other,
        number: 0,
        frequency: Frequency.Yearly
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

const defaultState: HomeLoanCalculatorState = {
  homeLoan: defaultHomeLoan
}

export const useHomeLoanCalculator = create<HomeLoanCalculatorStore>((set, get) => ({
  ...defaultState,
  updateValue: (updateFunction) => {
    set(produce((draft: HomeLoanCalculatorState) => updateFunction(draft)))
    const state = get()
    if (state.homeLoan.maxLoanAmount) {
      state.calculate()
    }
  },
  calculate: () => {
    const { homeLoan } = get()

    const applicant1BaseIncome = convertToAnnual(homeLoan.income.applicant1Income.base.number, homeLoan.income.applicant1Income.base.frequency)
    const applicant1SupplementaryIncome = convertToAnnual(homeLoan.income.applicant1Income.supplementary.number, homeLoan.income.applicant1Income.supplementary.frequency)
    const applicant1OtherIncome = convertToAnnual(homeLoan.income.applicant1Income.other.number, homeLoan.income.applicant1Income.other.frequency)
    const rentalIncome = convertToAnnual(homeLoan.income.rentalIncome.number, homeLoan.income.rentalIncome.frequency)
    const applicant1IncomeAnnual = applicant1BaseIncome + applicant1SupplementaryIncome + applicant1OtherIncome + rentalIncome
    const { netPay: applicant1NetIncomeAnnual } = calculateSalaryAmounts({ grossAnnualSalary: applicant1IncomeAnnual })
    const applicant1NetIncomeMonthly = convertToMonthly(applicant1NetIncomeAnnual, Frequency.Yearly)

    const applicant2BaseIncome = convertToAnnual(homeLoan.income.applicant2Income.base.number, homeLoan.income.applicant2Income.base.frequency)
    const applicant2SupplementaryIncome = convertToAnnual(homeLoan.income.applicant2Income.supplementary.number, homeLoan.income.applicant2Income.supplementary.frequency)
    const applicant2OtherIncome = convertToAnnual(homeLoan.income.applicant2Income.other.number, homeLoan.income.applicant2Income.other.frequency)
    const applicant2IncomeAnnual = applicant2BaseIncome + applicant2SupplementaryIncome + applicant2OtherIncome
    const { netPay: applicant2NetIncomeAnnual } = calculateSalaryAmounts({ grossAnnualSalary: applicant2IncomeAnnual })
    const applicant2NetIncomeMonthly = convertToMonthly(applicant2NetIncomeAnnual, Frequency.Yearly)
  
    const monthlyIncome = applicant1NetIncomeMonthly + applicant2NetIncomeMonthly

    const livingExpenses = convertToMonthly(homeLoan.expenses.livingExpenses.number, homeLoan.expenses.livingExpenses.frequency)
    const rentalExpenses = convertToMonthly(homeLoan.expenses.rentalExpenses.number, homeLoan.expenses.rentalExpenses.frequency)
    const loanRepayments = convertToMonthly(homeLoan.expenses.loanRepayments.number, homeLoan.expenses.loanRepayments.frequency)
    const monthlyExpenses = livingExpenses + rentalExpenses + loanRepayments
    
    // @TODO we can skip this calculation sometimes
    const { 
      maxLoanAmount
    } = calculateBorrowingPower({
      monthlyIncome,
      monthlyExpenses,
      deposit: homeLoan.loanDeposit || 0,
      interestRatePerAnnum: homeLoan.interestRatePerAnnum || 0,
      loanTermYears: homeLoan.loanTermYears || 0,
      creditCardLimit: homeLoan.liabilities.creditCardLimit,
    })

    const loanAmount = homeLoan.loanAmount ? Math.min(maxLoanAmount, homeLoan.loanAmount) : maxLoanAmount
    const loanDeposit = homeLoan.loanDeposit ? homeLoan.loanDeposit : Math.round(loanAmount * homeLoan.loanDepositPerc)
    const loanDepositPerc = loanAmount ? Number((loanDeposit / loanAmount).toFixed(2)) : homeLoan.loanDepositPerc
  
    const repaymentAmount = calculateLoanRepayment({
      loanAmount,
      loanTermYears: homeLoan.loanTermYears,
      interestRatePerAnnum:  homeLoan.interestRatePerAnnum || 0,
      repaymentPeriod: Frequency.Monthly
    })

    set(produce((draft: HomeLoanCalculatorState) => {
      draft.homeLoan.maxLoanAmount = maxLoanAmount
      draft.homeLoan.repaymentAmount = repaymentAmount
      draft.homeLoan.loanAmount = loanAmount
      draft.homeLoan.loanDepositPerc = loanDepositPerc
      draft.homeLoan.loanDeposit = loanDeposit
    }))
  }
}))


