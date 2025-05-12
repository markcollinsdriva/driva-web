import { err, ok, Result } from "neverthrow";
import { type DebtType, type UIDebt } from "./definitions";
import { type DebtUserInput } from "./calculation";

export function validateDebts(
  debts: UIDebt[],
): Result<DebtUserInput[], string> {
  // If there are no debts in the list, it's valid (an empty list of processed debts).
  if (debts.length === 0) {
    return err("No debts provided. Please add at least one debt.");
  }

  const results = debts.map(validateAndSanitizeSingleDebt);

  return Result.combine(results);
}

function validateAndSanitizeSingleDebt(
  debt: UIDebt,
): Result<DebtUserInput, string> {
  // 1. Validate required string fields
  if (debt.type === "") {
    // This error is for a debt item that is not entirely empty but is missing a type.
    // The "single completely empty debt" case is handled in the main validateDebts function.
    return err(
      "A debt entry is missing its type. Please select a type for each debt.",
    );
  }
  if (debt.amount === "") {
    return err(`Debt of type '${debt.type}' is missing a current balance.`);
  }
  if (debt.interestRate === "") {
    return err(`Debt of type '${debt.type}' is missing an interest rate.`);
  }
  if (debt.repayment === "") {
    return err(`Debt of type '${debt.type}' is missing a repayment amount.`);
  }

  // 2. Parse and validate numeric fields
  const currentBalance = parseFloat(debt.amount);
  if (isNaN(currentBalance) || currentBalance < 0) {
    return err(
      `Debt of type '${debt.type}' has an invalid balance amount: '${debt.amount}'. Balance must be a non-negative number.`,
    );
  }

  const annualRateRaw = parseFloat(debt.interestRate);
  if (isNaN(annualRateRaw) || annualRateRaw < 0 || annualRateRaw > 100) {
    return err(
      `Debt of type '${debt.type}' has an invalid interest rate: '${debt.interestRate}'. Rate must be a number between 0 and 100.`,
    );
  }

  const repaymentAmount = parseFloat(debt.repayment);
  if (isNaN(repaymentAmount) || repaymentAmount < 0) {
    return err(
      `Debt of type '${debt.type}' has an invalid repayment amount: '${debt.repayment}'. Repayment must be a non-negative number.`,
    );
  }

  // 3. Construct the DebtUserInput object (sanitization)
  return ok({
    type: debt.type as DebtType,
    currentBalance: currentBalance,
    annualRate: annualRateRaw / 100, // Convert percentage to decimal
    repayment: repaymentAmount,
    repaymentFrequency: debt.repaymentFrequency,
  });
}
