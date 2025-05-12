'use client";'
import { ChevronDown } from "lucide-react";
import { Button } from "./components/button";
import { Input } from "./components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/dropdown-menu";
import {
  DebtTypeValues,
  RepaymentFrequency,
  RepaymentFrequencyValues,
  type DebtType,
} from "./definitions";

interface UIDebt {
  type: DebtType | "";
  amount: string;
  repayment: string;
  interestRate: string;
  repaymentFrequency: RepaymentFrequency;
}

interface DebtStepFormProps {
  debt: UIDebt;
  debtIndex: number;
  onDebtChange: (index: number, field: keyof UIDebt, value: string | DebtType | RepaymentFrequency) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  debtTitle: string;
}

export function DebtStepForm({
  debt,
  debtIndex,
  onDebtChange,
  showDropdown,
  setShowDropdown,
  debtTitle,
}: DebtStepFormProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#262627]">{debtTitle}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#262627] mb-2">Debt type</label>
          <div className="relative">
            <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white border-[#e5e5e5] text-[#707376]"
                >
                  {debt.type || "Select"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[240px]">
                {DebtTypeValues.map((debtType) => (
                  <DropdownMenuItem
                    key={debtType}
                    onClick={() => {
                      onDebtChange(debtIndex, "type", debtType);
                      setShowDropdown(false);
                    }}
                  >
                    {debtType}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#262627] mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707376]">$</span>
            <Input
              type="number"
              value={debt.amount}
              onChange={(e) => onDebtChange(debtIndex, "amount", e.target.value)}
              className="pl-7 bg-white border-[#e5e5e5]"
              placeholder="1000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#262627] mb-2">Repayment</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707376]">$</span>
              <Input
                type="number"
                value={debt.repayment}
                onChange={(e) => onDebtChange(debtIndex, "repayment", e.target.value)}
                className="pl-7 bg-white border-[#e5e5e5]"
                placeholder="100"
              />
            </div>
            <Select
              value={debt.repaymentFrequency}
              onValueChange={(value: RepaymentFrequency) => onDebtChange(debtIndex, "repaymentFrequency", value)}
            >
              <SelectTrigger className="w-[120px] bg-white border-[#e5e5e5]  text-[#707376]">
                <SelectValue placeholder={RepaymentFrequency.Monthly} />
              </SelectTrigger>
              <SelectContent>
                {RepaymentFrequencyValues.map((freq) => (
                  <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#262627] mb-2">Interest rate</label>
          <div className="relative">
            <Input
              type="number"
              value={debt.interestRate}
              onChange={(e) => onDebtChange(debtIndex, "interestRate", e.target.value)}
              className="pr-7 bg-white border-[#e5e5e5]"
              placeholder="5"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707376]">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
