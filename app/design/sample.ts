export enum LoanType {
  Vehicle = 'vehicle',
  Personal = 'personal'
}

enum LoanPurposeVehicle {
  Purchase = 'purchase',
  Refinance = 'refinance'
}

enum LoanPurposePersonal {
  DebtConsolidation = 'debt_consolidation',
  Holiday = 'holiday'
}

type LoanPurpose = LoanPurposeVehicle | LoanPurposePersonal
const LoanPurpose = { ...LoanPurposeVehicle, ...LoanPurposePersonal }

enum UIFields {
  Purpose,
  LoanAmount,
  LoanTerm,
  BuyingFrom,
  AssetYear,
  AssetCondition
}

const FieldsForLoanType = new Map<LoanType, UIFields[]>([
  [LoanType.Vehicle, [
    UIFields.LoanAmount, 
    UIFields.LoanTerm, 
    UIFields.BuyingFrom, 
    UIFields.AssetYear, 
    UIFields.AssetCondition
  ]],
  [LoanType.Personal, [
    UIFields.Purpose, 
    UIFields.LoanAmount, 
    UIFields.LoanTerm
  ]]
])

export const getFieldsForLoanType = (loanType: LoanType) => FieldsForLoanType.get(loanType) ?? []

enum ProductName {
  CarPurchase,
  CarRefinance,
  Boat,
  DebtConsolidation,
  Holiday,
  //.. etc
}

interface ProductDefintion {
  name: ProductName,
  loanType: LoanType,
  purpose: LoanPurpose,
  fields: UIFields[]
  apiRoute: 'quote/price' | 'quote/personal'
}

const createProductDefinition = (name: ProductName, loanType: LoanType, purpose: LoanPurpose): ProductDefintion => ({
  name,
  loanType,
  purpose,
  fields: getFieldsForLoanType(loanType),
  apiRoute: loanType === LoanType.Vehicle ? 'quote/price' : 'quote/personal'
})

const ProductDefinitions = new Map<ProductName, ProductDefintion>([
  [ProductName.CarPurchase, createProductDefinition(ProductName.CarPurchase, LoanType.Vehicle, LoanPurposeVehicle.Purchase)],
  [ProductName.CarRefinance, createProductDefinition(ProductName.CarRefinance, LoanType.Vehicle, LoanPurposeVehicle.Refinance)],
  [ProductName.DebtConsolidation, createProductDefinition(ProductName.DebtConsolidation, LoanType.Personal, LoanPurposePersonal.DebtConsolidation)],
  [ProductName.Holiday, createProductDefinition(ProductName.Holiday, LoanType.Personal, LoanPurposePersonal.Holiday)],
])



