import { calcDebtConsolidation, type DebtUserInput } from "./calculation";
import { CreditScoreBands, RepaymentFrequency, DebtTypes } from "./definitions";

// Sample debt data
const sampleDebts: DebtUserInput[] = [
  {
    type: DebtTypes.CreditCard,
    currentBalance: 5000,
    annualRate: 0.199, // 19.9%
    repayment: 200,
    repaymentFrequency: RepaymentFrequency.Monthly,
  },
  {
    type: DebtTypes.PersonalLoan,
    currentBalance: 1000,
    annualRate: 0.095, // 9.5%
    repayment: 30,
    repaymentFrequency: RepaymentFrequency.Monthly,
  },
  {
    type: DebtTypes.CarLoan,
    currentBalance: 15000,
    annualRate: 0.045, // 4.5%
    repayment: 400,
    repaymentFrequency: RepaymentFrequency.Monthly,
  },
];

// Sample parameters for consolidation
const sampleCreditScoreBand = CreditScoreBands.Great;
const sampleNewLoanTermYears = 5; // 5 years

// Run the calculation
const result = calcDebtConsolidation({
  currentDebts: sampleDebts,
  creditScoreBand: sampleCreditScoreBand,
  newLoanTermYears: sampleNewLoanTermYears,
});

// Output the result
if (result.isOk()) {
  console.log("Debt Consolidation Calculation Successful:");
  console.log("-----------------------------------------");
  console.log("Current Debts Summary:");
  console.log(`  Current Monthly Repayment: $${result.value.currentTotalMonthlyRepayment.toFixed(2)}`)
  console.log("-----------------------------------------");
  console.log("Consolidation Loan Details:");
  console.log(`  New Annual Rate: ${(result.value.newAnnualRate * 100).toFixed(2)}%`);
  console.log(`  New Monthly Repayment: $${result.value.newMonthlyRepayment.toFixed(2)}`);
  console.log("-----------------------------------------");
  console.log("Savings:");
  console.log(`  Total Interest Saved: $${result.value.interestSavings.toFixed(2)}`);
  console.log(`  Monthly Repayment Reduction: $${(result.value.currentTotalMonthlyRepayment - result.value.newMonthlyRepayment).toFixed(2)}`);
  console.log("-----------------------------------------");
} else {
  console.error("Debt Consolidation Calculation Failed:");
  console.error(result.error);
}

// To run this file with Bun:
// bun run /Users/markcollins/dev/debt-tracker/src/app/exampleCalculation.ts
