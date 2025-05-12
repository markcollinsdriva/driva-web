import { Button } from "@/components/ui/button";
import {
  LoanTermOptionsArray,
  CreditScoreBandValues,
  type CreditScoreBand,
  type LoanTermOptions
} from "./logic/definitions";
import type { DebtConsolidationResult } from "./logic/calculation";

interface CalculationResultsDisplayProps {
  calculationResult: DebtConsolidationResult;
  selectedTerm: LoanTermOptions;
  onTermChange: (term: LoanTermOptions) => void;
  selectedCreditScoreBand: CreditScoreBand;
  onCreditScoreBandChange: (band: CreditScoreBand) => void;
}

export function CalculationResultsDisplay({
  calculationResult,
  selectedTerm,
  onTermChange,
  selectedCreditScoreBand,
  onCreditScoreBandChange,
}: CalculationResultsDisplayProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-[#262627]">Results</h2>

      <div className="mb-8">
        <p className="text-[#707376] mb-1">You could save</p>
        <h3 className="text-3xl font-bold text-[#262627]">
          ${calculationResult.interestSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-sm text-[#707376] mt-1">
          Over the life of the loan
        </p>
      </div>

      <div className="mb-8">
        <p className="text-[#707376] mb-1">Saving per month</p>
        <h3 className="text-xl font-bold text-[#262627]">
          ${(calculationResult.currentTotalMonthlyRepayment - calculationResult.newMonthlyRepayment) > 0 ?
            (calculationResult.currentTotalMonthlyRepayment - calculationResult.newMonthlyRepayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
            '0.00'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-[#707376] mb-1">New repayments</p>
          <h3 className="font-bold text-[#262627]">
            ${calculationResult.newMonthlyRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month
          </h3>
        </div>
        <div>
          <p className="text-[#707376] mb-1">Estimated rate</p>
          <h3 className="font-bold text-[#262627]">
            {(calculationResult.newAnnualRate * 100).toFixed(1)}%
          </h3>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[#707376] mb-2">Loan term (years)</p>
        <div className="flex gap-2">
          {LoanTermOptionsArray.map((term) => (
            <button
              key={term}
              onClick={() => onTermChange(term)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTerm === term
                ? "bg-[#97edcc] text-[#262627] font-medium"
                : "bg-white border border-[#e5e5e5] text-[#707376]"
                }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[#707376] mb-2">Credit health</p>
        <div className="flex gap-2">
          {CreditScoreBandValues.map((rating) => (
            <button
              key={rating}
              onClick={() => onCreditScoreBandChange(rating)}
              className={`px-3 py-1 rounded-full text-sm ${selectedCreditScoreBand === rating
                ? "bg-[#97edcc] text-[#262627] font-medium"
                : "bg-white border border-[#e5e5e5] text-[#707376]"
                }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-[#262627] mb-4">
        Consolidate your debt
      </Button>
    </div>
  );
}
