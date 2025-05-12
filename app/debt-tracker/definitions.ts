export type LoanTermOptions = 2 | 3 | 5 | 7;
export const LoanTermOptionsArray: LoanTermOptions[] = [2, 3, 5, 7];

export const DebtTypes = {
  CreditCard: "Credit Card",
  CarLoan: "Car Loan",
  PersonalLoan: "Personal Loan",
  OtherLoan: "Other Loan",
} as const;

export type DebtType = typeof DebtTypes[keyof typeof DebtTypes];
export const DebtTypeValues = Object.values(DebtTypes);

export const RepaymentFrequency = {
  Monthly: "Monthly",
  Fortnightly: "Fortnightly",
  Weekly: "Weekly",
} as const;
export type RepaymentFrequency =
  typeof RepaymentFrequency[keyof typeof RepaymentFrequency];
export const RepaymentFrequencyValues = Object.values(RepaymentFrequency);

export const RepaymentFrequencyPerMonthMap: Record<RepaymentFrequency, number> =
  {
    [RepaymentFrequency.Monthly]: 1,
    [RepaymentFrequency.Fortnightly]: 26 / 12,
    [RepaymentFrequency.Weekly]: 52 / 12,
  };

const estimatedAnnualInterestRateByDebtType = {
  [DebtTypes.CreditCard]: 0.2,
  [DebtTypes.CarLoan]: 0.05,
  [DebtTypes.PersonalLoan]: 0.1,
  [DebtTypes.OtherLoan]: 0.07,
} as const;

export function getEstimatedAnnualInterestRateByDebtType(
  debtType: DebtType,
): number {
  return estimatedAnnualInterestRateByDebtType[debtType] ??
    estimatedAnnualInterestRateByDebtType[DebtTypes.CreditCard];
}

export const CreditScoreBands = {
  Low: "Low",
  Fair: "Fair",
  Average: "Average",
  Great: "Great",
  Excellent: "Excellent",
} as const;
export type CreditScoreBand =
  typeof CreditScoreBands[keyof typeof CreditScoreBands];
export const CreditScoreBandValues = Object.values(CreditScoreBands);

const estimatedAnnualInterestRateByCreditScore = {
  [CreditScoreBands.Low]: 0.2,
  [CreditScoreBands.Fair]: 0.15,
  [CreditScoreBands.Average]: 0.1,
  [CreditScoreBands.Great]: 0.09,
  [CreditScoreBands.Excellent]: 0.08,
} as const;

export type CreditScoreValue =
  typeof estimatedAnnualInterestRateByCreditScore[CreditScoreBand];

export function getEstimatedAnnualInterestRate(
  creditScoreBand: CreditScoreBand,
): CreditScoreValue {
  return estimatedAnnualInterestRateByCreditScore[creditScoreBand] ??
    estimatedAnnualInterestRateByCreditScore.Average;
}

export interface UIDebt {
  type: DebtType | "";
  amount: string;
  repayment: string;
  interestRate: string; // Store as string, e.g., "5" for 5%
  repaymentFrequency: RepaymentFrequency;
}


export function errorMessageHandler(error: unknown) {
  return error instanceof Error ? error.message : "An unknown error occurred."
}