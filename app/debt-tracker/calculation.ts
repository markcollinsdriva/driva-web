import {
  type CreditScoreBand,
  type DebtType,
  getEstimatedAnnualInterestRate,
  type LoanTermOptions,
  RepaymentFrequency,
  RepaymentFrequencyPerMonthMap,
  errorMessageHandler
} from "./definitions";
import {
  calcMonthlyRepayment,
  calcTotalInterest,
  roundToTwoDecimals,
} from "./loanCalculations";

import { err, ok, Result } from "neverthrow";

// scenario saving money
// scenario not saving money

export interface DebtUserInput {
  type: DebtType;
  currentBalance: number;
  annualRate: number;
  repayment: number;
  repaymentFrequency: RepaymentFrequency;
}

export interface CalcDebtConsolidationInputs {
  creditScoreBand: CreditScoreBand;
  currentDebts: DebtUserInput[];
  newLoanTermYears: LoanTermOptions;
}

export interface DebtConsolidationResult {
  currentTotalMonthsToPayOff: number;
  currentTotalMonthlyRepayment: number;
  newMonthlyRepayment: number;
  newAnnualRate: number;
  interestSavings: number;
}

export function calcDebtConsolidation(
  inputs: CalcDebtConsolidationInputs,
): Result<DebtConsolidationResult, string> {
  try {
    const newLoanTermMonths = inputs.newLoanTermYears * 12;
    const currentDebts = inputs.currentDebts;
    const newAnnualRate = getEstimatedAnnualInterestRate(inputs.creditScoreBand);

    const normalisedDebtsResults = Result.combine(currentDebts.map((debt) => calcNormalisedMonthlyDebt(debt)));
    if (normalisedDebtsResults.isErr()){
      return err(normalisedDebtsResults.error)
    }

    const aggregateValuesResult = calcAggregateValuesFromNormalisedDebts(normalisedDebtsResults.value);
    if (aggregateValuesResult.isErr()) {
      return err(aggregateValuesResult.error);
    }
    const {
      currentTotalMonthlyRepayment,
      currentTotalMonthsToPayOff,
      totalDebtOwed,
      totalCurrentInterest,
    } = aggregateValuesResult.value;

    const monthlyRepaymentResults = calcMonthlyRepayment({
      principal: totalDebtOwed,
      annualInterestRate: newAnnualRate,
      months: newLoanTermMonths,
    });

    return monthlyRepaymentResults.map(
      (monthlyRepayment) => {
        const totalNewInterest = (monthlyRepayment * newLoanTermMonths) - totalDebtOwed;
        const interestSavings = -1 * (totalCurrentInterest - totalNewInterest);
        return {
          currentTotalMonthsToPayOff: roundToTwoDecimals(currentTotalMonthsToPayOff),
          currentTotalMonthlyRepayment: roundToTwoDecimals(currentTotalMonthlyRepayment),
          newMonthlyRepayment: roundToTwoDecimals(monthlyRepayment),
          interestSavings: roundToTwoDecimals(interestSavings),
          newAnnualRate,
        };
      },
    );
  } catch (error) {
    return err(errorMessageHandler(error))
  }
}

// pipeline types

interface DebtNormalisedMonthly {
  type: DebtType;
  currentBalance: number;
  annualRate: number;
  monthlyRepayment: number;
}

export function calcNormalisedMonthlyDebt(
  debt: DebtUserInput,
): Result<DebtNormalisedMonthly, string> {
  try {
    return ok({
      ...debt,
      monthlyRepayment: debt.repayment * RepaymentFrequencyPerMonthMap[debt.repaymentFrequency],
    });
  } catch (error) {
    return err(errorMessageHandler(error))
  }
}

interface AggregateDebtValues {
  currentTotalMonthlyRepayment: number;
  currentTotalMonthsToPayOff: number;
  totalDebtOwed: number;
  totalCurrentInterest: number;
}

function calcAggregateValuesFromNormalisedDebts(
  normalisedDebts: DebtNormalisedMonthly[],
): Result<AggregateDebtValues, string> {
  // Handle empty array case
  if (normalisedDebts.length === 0) {
    return ok({
      currentTotalMonthlyRepayment: 0,
      currentTotalMonthsToPayOff: 0,
      totalDebtOwed: 0,
      totalCurrentInterest: 0,
    });
  }

  // const initialValue: Result<AggregateDebtValues, string> = ok({
  //   currentTotalMonthlyRepayment: 0,
  //   currentTotalMonthsToPayOff: 0,
  //   totalDebtOwed: 0,
  //   totalCurrentInterest: 0,
  // });

  let initialValue: AggregateDebtValues  ={
    currentTotalMonthlyRepayment: 0,
    currentTotalMonthsToPayOff: 0,
    totalDebtOwed: 0,
    totalCurrentInterest: 0,
  };

  for (const debt of normalisedDebts) {
    const interestResult = calcTotalInterest(debt);
    if (interestResult.isErr()) {
      return err(interestResult.error)
    }
    const interest = interestResult.value;
    initialValue = {
      currentTotalMonthlyRepayment: initialValue.currentTotalMonthlyRepayment + debt.monthlyRepayment,
      currentTotalMonthsToPayOff: Math.max(initialValue.currentTotalMonthsToPayOff, interest.monthsToPayOff),
      totalDebtOwed: initialValue.totalDebtOwed + debt.currentBalance,
      totalCurrentInterest: initialValue.totalCurrentInterest + interest.totalInterest,
    };
  }
  return ok(initialValue);
}
