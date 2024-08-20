interface TaxBracket {
  upperBound: number
  rate: number
}

export const TaxBrackets: TaxBracket[] = [
  { upperBound: 18200, rate: 0 },
  { upperBound: 45000, rate: 0.16 },
  { upperBound: 135000, rate: 0.3 },
  { upperBound: 190000, rate: 0.37 },
  { upperBound: Infinity, rate: 0.45 },
] as const

export const MedicareLevyPercentage = 0.02

export const calculateSalaryAmounts = ({ 
  grossAnnualSalary, 
  output = 'annual' 
}: { 
  grossAnnualSalary: number, 
  includeMedicareLevy?: boolean,
  medicareLevyPercentage?: number,
  output?: 'annual' | 'monthly'
}) => {
  let tax = 0
  let lowerBound = 0
  const periodAdjustment = output === 'monthly' ? 12 : 1
  
  TaxBrackets.every(({ upperBound, rate }) => {
    const isGrossSalaryAboveUpperBound = grossAnnualSalary > upperBound
    const upperBoundForTax = isGrossSalaryAboveUpperBound ? upperBound : grossAnnualSalary
    const _tax = (upperBoundForTax - lowerBound) * rate
    tax += _tax
    lowerBound = upperBound
    // continue if salary above upperBound, stop if below upperBound
    return isGrossSalaryAboveUpperBound 
  })

  const netPay = grossAnnualSalary - tax

  return {
    grossPay: grossAnnualSalary / periodAdjustment,
    netPay: netPay / periodAdjustment,
    tax: tax / periodAdjustment,
  }
}