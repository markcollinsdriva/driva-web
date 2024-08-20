import { calculateMonthlyLoanRepayment } from "./loanRepayments"
import { calculatePresentValue } from "./presentValue"
import { calculateSalaryAmounts, MedicareLevyPercentage } from "./salaryAmounts"

export const BallonPercentagePaymentsForLeaseTerm = new Map([
  [ 1, 0.6563],
  [ 2, 0.5625],
  [ 3, 0.4688],
  [ 4, 0.375],
  [ 5, 0.2813], 
])

export const calculateNovatedLease = ({
  vehiclePriceIncludingGst,
  leaseTermYears,
  interestRatePerAnnum,
  establishmentFee,
  monthlyFee,
  brokerageFeePercentage,
  annualSalaryExcludeSuper,
  medicareLevyPercentage = MedicareLevyPercentage,
  includeMedicareLevy
}: {
  vehiclePriceIncludingGst: number,
  leaseTermYears: number,
  interestRatePerAnnum: number,
  establishmentFee: number,
  monthlyFee: number,
  brokerageFeePercentage: number,
  annualSalaryExcludeSuper: number,
  medicareLevyPercentage?: number,
  includeMedicareLevy: boolean
}) => {

  const { 
    tax: annualTaxPaid
   } = calculateSalaryAmounts({ 
    grossAnnualSalary: annualSalaryExcludeSuper,
    includeMedicareLevy,
    output: 'annual' 
  })
  const annualMedicareLevy = annualSalaryExcludeSuper * medicareLevyPercentage
  const monthlyTaxPaid = (annualTaxPaid + annualMedicareLevy) / 12
  const grossMonthlySalary = annualSalaryExcludeSuper / 12
  const netMonthlySalary = (grossMonthlySalary - monthlyTaxPaid)

  const GstRate = 0.1
  const novatedLeaseTermMonths = leaseTermYears * 12
  const minimumResidualPercentage = BallonPercentagePaymentsForLeaseTerm.get(leaseTermYears) ?? 0

  const gstCredit = vehiclePriceIncludingGst <= 69674 ? vehiclePriceIncludingGst - (vehiclePriceIncludingGst / 1.1) : 6334
  const vehicleValue = vehiclePriceIncludingGst - gstCredit
  const minimumResidualAmount = vehicleValue * minimumResidualPercentage
  // const remainingFinanceAmount = vehicleValue - minimumResidualAmount
  
  const minimumResidualAmountPV = calculatePresentValue({
    futureValue: minimumResidualAmount,
    interestRatePerPeriod: interestRatePerAnnum / 12,
    numberOfPeriods: novatedLeaseTermMonths
  })

  const brokerageFee = vehicleValue * brokerageFeePercentage
  const efffectiveFinanceAmountIncludingResidual = vehicleValue + establishmentFee + brokerageFee
  
  const monthlyRepaymentPreTaxPreFees = calculateMonthlyLoanRepayment({
    loanTermYears: leaseTermYears,
    loanAmount: efffectiveFinanceAmountIncludingResidual - minimumResidualAmountPV,
    interestRatePerAnnum
  })
  
  const monthlyRepaymentPreTax = monthlyRepaymentPreTaxPreFees + monthlyFee
  const totalRepaymentAmount = monthlyRepaymentPreTax * novatedLeaseTermMonths + minimumResidualAmount
  
  const totalInterest = totalRepaymentAmount - vehicleValue
  
  const grossMonthlySalaryWithLease = grossMonthlySalary - monthlyRepaymentPreTax
  const {
    tax: annualTaxPaidWithLease,
  } = calculateSalaryAmounts({
    grossAnnualSalary: grossMonthlySalaryWithLease * 12,
    includeMedicareLevy,
    output: 'annual'
  })
  const monthlyTaxWithLease = (annualTaxPaidWithLease + annualMedicareLevy) / 12
  const netMonthlySalaryWithLease = (grossMonthlySalaryWithLease - monthlyTaxWithLease)
  
  const costOfVehicleWithLease = (netMonthlySalary - netMonthlySalaryWithLease ) * novatedLeaseTermMonths + minimumResidualAmount
  
  const gstOnBalloon = GstRate * minimumResidualAmount
  
  // OUTCOMES
  const taxSavingsPerMonth = monthlyTaxPaid - (grossMonthlySalaryWithLease - netMonthlySalaryWithLease)
  const taxSavings = taxSavingsPerMonth * novatedLeaseTermMonths
  const netSavings = Math.round(taxSavings - totalInterest)
  const totalCostOfVehicle = Math.round(costOfVehicleWithLease + gstOnBalloon)
  const actualCostPerMonth = Math.round(netMonthlySalary - netMonthlySalaryWithLease)

  return {
    netSavings,
    totalCostOfVehicle,
    actualCostPerMonth,
  }
}


const { netSavings, totalCostOfVehicle, actualCostPerMonth } = calculateNovatedLease({
  vehiclePriceIncludingGst: 54900,
  leaseTermYears: 5,
  interestRatePerAnnum: 0.0855,
  establishmentFee: 330,
  monthlyFee: 35,
  brokerageFeePercentage: 0.08,
  annualSalaryExcludeSuper: 200000,
  includeMedicareLevy: true
})

console.log('netSavings', netSavings)
console.log('totalCostOfLease', totalCostOfVehicle)
console.log('actualCostPerMonth', actualCostPerMonth)

