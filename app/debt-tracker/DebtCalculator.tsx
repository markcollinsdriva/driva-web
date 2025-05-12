'use client'

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  RepaymentFrequency,
  CreditScoreBands,
  type DebtType,
  type CreditScoreBand,
  type LoanTermOptions,
  type UIDebt,
} from "./logic/definitions"
import {
  calcDebtConsolidation,
  type DebtConsolidationResult,
} from "./logic/calculation"
import { DebtStepForm } from "./DebtStepForm"
import { CalculationResultsDisplay } from "./CalculationResultsDisplay"
import { validateDebts } from "./logic/validator"



export default function DebtCalculator() {
  const [step, setStep] = useState(0)
  const [showCalculationResults, setShowCalculationResults] = useState(false)
  const [debts, setDebts] = useState<UIDebt[]>([
    {
      type: "",
      amount: "",
      repayment: "",
      interestRate: "",
      repaymentFrequency: RepaymentFrequency.Monthly,
    },
  ])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<LoanTermOptions>(7)
  const [selectedCreditScoreBand, setSelectedCreditScoreBand] = useState<CreditScoreBand>(CreditScoreBands.Average)
  const [calculationResult, setCalculationResult] = useState<DebtConsolidationResult | null>(null)

  const handleAddDebt = () => {
    // to add validation
    setDebts([
      ...debts,
      {
        type: "",
        amount: "",
        repayment: "",
        interestRate: "",
        repaymentFrequency: RepaymentFrequency.Monthly,
      },
    ])
    setStep(step + 1)
  }

  const handleDebtChange = (index: number, field: keyof UIDebt, value: string | DebtType | RepaymentFrequency) => {
    const newDebts = [...debts]
    newDebts[index] = { ...newDebts[index], [field]: value }
    setDebts(newDebts)
  }


  const handleError = (errorMessage: string) => {
    console.error("Error calculating debt consolidation:", errorMessage);
    alert("Error calculating debt consolidation: " + errorMessage);
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const getTitle = (index: number) => {
    return index === 0 ? "First debt" : index === 1 ? "Second debt" : `Debt ${index + 1}`
  }

  const handleCalculate = useCallback(() => {
    const debtValidationResult = validateDebts(debts)

    if (debtValidationResult.isErr()) {
      handleError(debtValidationResult.error)
      return
    }

    calcDebtConsolidation({
      creditScoreBand: selectedCreditScoreBand,
      currentDebts: debtValidationResult.value,
      newLoanTermYears: selectedTerm,
    }).match(
      (calculationResult) => {
        setCalculationResult(calculationResult)
        setShowCalculationResults(true)
      },
      (errorMessage) => {
        handleError(errorMessage)
      }
    )
  }, [debts, selectedCreditScoreBand, selectedTerm])

  useEffect(() => {
    if (showCalculationResults) {
      handleCalculate()
    }
  }, [selectedTerm, selectedCreditScoreBand, showCalculationResults, handleCalculate]);

  return (
    <div className="max-w-md mx-auto bg-[#f8f7f7] min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#262627]">Debt consolidation calculator</h1>
        {showCalculationResults && <p className="text-[#707376] mt-1">Your debts</p>}
      </div>

      {!showCalculationResults ? (
        <div>
          {step > 0 && (
            <button onClick={handleBack} className="flex items-center text-[#707376] mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {getTitle(step - 1)}
            </button>
          )}
          <DebtStepForm
            debt={debts[step]}
            debtIndex={step}
            onDebtChange={handleDebtChange}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            debtTitle={getTitle(step)}
          />
          <div className="mt-6 space-y-4">
            <Button
              onClick={handleAddDebt}
              variant="outline"
              className="w-full border-[#e5e5e5] text-[#707376] bg-white"
            >
              + Add another debt
            </Button>

            <Button onClick={handleCalculate} className="w-full bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-[#262627]">
              See how much you could save
            </Button>
          </div>
        </div>
      ) : calculationResult ? (
        <div>
          <CalculationResultsDisplay
            calculationResult={calculationResult}
            selectedTerm={selectedTerm}
            onTermChange={setSelectedTerm}
            selectedCreditScoreBand={selectedCreditScoreBand}
            onCreditScoreBandChange={setSelectedCreditScoreBand}
          />
          <button onClick={() => setShowCalculationResults(false)} className="flex items-center text-[#707376] mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to debts
          </button>
        </div>
      ) : (
        // Fallback or loading state if needed, though current logic should always show one or the other
        // For instance, if handleCalculate is called with no debts, it might set calculationResult
        // to a state representing "no debts to consolidate"
        <div>
          <p className="text-[#707376] mt-1">Enter your debt details to see calculation results.</p>
          <Button onClick={() => {
            setCalculationResult(null); // Clear any previous results
            setStep(0); // Go back to the first debt form
            // Optionally reset debts if you want a clean slate
            // setDebts([{ type: "", amount: "", repayment: "", interestRate: "", repaymentFrequency: RepaymentFrequency.Monthly }]);
          }} className="w-full mt-4 bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-[#262627]">
            Start Over
          </Button>
        </div>
      )}
    </div>
  )
}

