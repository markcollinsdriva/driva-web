import { LeaseTerm } from '@/app/novated-lease-calculator/types'
import { calculateSalaryAmounts } from '@/app/novated-lease-calculator/calculations/SalaryCalculator'

interface NovatedLeaseCalculatorInputs {
  monthlyRepayment: number
  grossAnnualSalary: number
  leaseTerm: LeaseTerm
}

interface NovatedLeaseCalculatorOutputs {
  savingOverLifeOfLoan: number
}

export const calculateNovatedLeaseValues = (inputs: NovatedLeaseCalculatorInputs): NovatedLeaseCalculatorOutputs => {
  const { grossAnnualSalary, monthlyRepayment, leaseTerm } = inputs
  const { netPay: netAnnualPayWithoutLoan } = calculateSalaryAmounts({ grossAnnualSalary  })
  const annualRepayment = monthlyRepayment * 12
  const grossAnnualSalaryWithLoan = netAnnualPayWithoutLoan - annualRepayment
  const { netPay: netAnnualPayWithLoan } = calculateSalaryAmounts({ grossAnnualSalary: grossAnnualSalaryWithLoan  })
  const annualCost = netAnnualPayWithoutLoan - netAnnualPayWithLoan
  const savingOverLifeOfLoan = annualCost * leaseTerm
  return {
    savingOverLifeOfLoan
  }
}

export const BallonPercentagePaymentsForLeaseTerm = new Map([
  [ 1, 65.63],
  [ 2, 56.25],
  [ 3, 46.88],
  [ 4, 37.5],
  [ 5, 28.13], 
])


