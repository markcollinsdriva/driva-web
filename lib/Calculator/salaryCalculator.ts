interface TaxBracket {
  lowerBound: number
  upperBound: number
  rate: number
}

const taxBrackets: TaxBracket[] = [
  { lowerBound: 0, upperBound: 18200, rate: 0 },
  { lowerBound: 18200, upperBound: 45000, rate: 0.19 },
  { lowerBound: 45000, upperBound: 120000, rate: 0.325 },
  { lowerBound: 120000, upperBound: 180000, rate: 0.37 },
  { lowerBound: 180000, upperBound: Infinity, rate: 0.45 },
]

export const calculateSalaryAmounts = ({ grossAnnualSalary }: { grossAnnualSalary: number}) => {
  let taxResults = 0
  taxBrackets.every(({ lowerBound, upperBound, rate }) => {
    const grossSalaryAboveUpperBound = grossAnnualSalary > upperBound
    const upperBoundForTax = grossSalaryAboveUpperBound ? upperBound : grossAnnualSalary
    const tax = (upperBoundForTax - lowerBound) * rate
    taxResults += tax
    // continue if salary above upperBound, stop if below upperBound
    return grossSalaryAboveUpperBound 
  })
  return {
    grossPay: grossAnnualSalary,
    netPay: grossAnnualSalary - taxResults,
    tax: taxResults
  }
}
