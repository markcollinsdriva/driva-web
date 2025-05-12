import { err, ok, type Result } from "neverthrow";
import { errorMessageHandler } from "./definitions";

/**
 * Calculates how many months to pay off a balance with fixed payment:
 *   n = -log(1 - r * P / A) / log(1 + r)
 */
export function calcMonthsToPayOff({
  currentBalance,
  annualRate,
  monthlyRepayment,
}: {
  currentBalance: number;
  annualRate: number;
  monthlyRepayment: number;
}): Result<number, string> {
  try {
    // Handle edge cases with appropriate checks
    if (currentBalance <= 0) {
      return err("Current balance must be positive.");
    }

    if (monthlyRepayment <= 0) {
      return err("Monthly repayment must be positive.");
    }

    if (annualRate < 0) {
      return err("Interest rate cannot be negative.");
    }

    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) {
      return err("Interest rate cannot be zero.");
    }

    // Check if payment is sufficient to cover monthly interest
    const monthlyInterest = currentBalance * monthlyRate;
    if (monthlyRepayment <= monthlyInterest) {
      return err(
        `Payment of ${monthlyRepayment} is too small to pay off the balance. Minimum required: ${
          monthlyInterest.toFixed(2)
        }`,
      );
    }

    // Apply the formula: n = -log(1 - r * P / A) / log(1 + r)
    // Where: r = monthly rate, P = principal, A = payment amount
    const monthsDecimal =
      -Math.log(1 - (monthlyRate * currentBalance) / monthlyRepayment) /
      Math.log(1 + monthlyRate);
    const months = parseFloat(monthsDecimal.toFixed(2));

    return ok(months);
  } catch (error) {
    return err(errorMessageHandler(error));
  }
}

/**
 * Calculates total interest paid over the life of the loan:
 *   totalInterest = A * n - P
 */
export function calcTotalInterest({
  currentBalance,
  annualRate,
  monthlyRepayment,
}: {
  currentBalance: number;
  annualRate: number;
  monthlyRepayment: number;
}): Result<{ totalInterest: number; monthsToPayOff: number }, string> {
  return calcMonthsToPayOff({ currentBalance, annualRate, monthlyRepayment })
    .map(
      (months) => ({
        totalInterest: monthlyRepayment * months - currentBalance,
        monthsToPayOff: months,
      }),
    );
}

export function calcMonthlyRepayment({
  principal,
  annualInterestRate,
  months,
}: {
  principal: number;
  annualInterestRate: number;
  months: number;
}): Result<number, string> {
  try {
    const monthlyRate = annualInterestRate / 12;
    // Ensure denominator is not zero, which can happen if monthlyRate is -1 and months is odd.
    // However, annualRate (and thus monthlyRate) should be positive.
    // Math.pow(1 + monthlyRate, -months) can be very small if months is large.
    const denominator = 1 - Math.pow(1 + monthlyRate, -months);
    if (denominator === 0) {
      // This case implies an issue with inputs, e.g., trying to calculate payment for a 0% loan over infinite time
      // or specific edge cases. For typical loan calculations, it shouldn't be zero.
      // If principal is 0, payment is 0. If rate is 0, payment is principal/months.
      if (principal === 0) {
        return err("Principal cannot be zero.");
      }
      if (monthlyRate === 0) {
        return err("Monthly interest rate cannot be zero.");
      }
      return err(
        "Cannot calculate monthly payment due to invalid parameters leading to division by zero.",
      );
    }

    const monthRepayment = principal * (monthlyRate / denominator);
    return ok(monthRepayment);
  } catch (error) {
    return err(errorMessageHandler(error));
  }
}

export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
