export enum LoanType {
  Vehicle = 'vehicle',
  Personal = 'personal'
}


const productsListConfig = [
  {
    name: 'CarPurchase',
    purpose: 'purchase',
    label: 'Car Purchase',
    imgSrc: '/images/car.svg',
  },
  {
    name: 'DebtConsolidation',
    purpose: 'debt_consolidation',
    label: 'Debt Consolidation',
    imgSrc: '/images/car.svg',
  },
  {
    name: 'Holiday',
    purpose: 'holiday',
    label: 'Holiday',
    imgSrc: '/images/car.svg',
  },
  {
    name: 'Wedding',
    purpose: 'wedding',
    label: 'Wedding',
    imgSrc: '/images/car.svg',
  },
  {
    name: 'Repairs',
    purpose: 'repairs',
    label: 'Repairs',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'MovingCost',
    purpose: 'moving_cost',
    label: 'Moving Cost',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'RentalBond',
    purpose: 'rental_bond',
    label: 'Rental Bond',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'PayBills',
    purpose: 'pay_bills',
    label: 'Pay Bills',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'SolarBattery',
    purpose: 'solar_battery',
    label: 'Solar Battery',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'Medical',
    purpose: 'medical',
    label: 'Medical',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'LegalProfessionalServices',
    purpose: 'legal_professional_services',
    label: 'Legal Professional Services',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'Boat',
    purpose: 'boat',
    label: 'Boat',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'Motorbike',
    purpose: 'motorbike',
    label: 'Motorbike',
    imgSrc: '/images/car.svg',
  },
  {
    name: 'Business',
    purpose: 'business',
    label: 'Business',
    imgSrc: '/images/dollar.svg',
  },
  {
    name: 'Investment',
    purpose: 'investment',
    label: 'Investment',
    imgSrc: '/images/dollar.svg',
  },
  {
    name: 'PersonalIncomeTax',
    purpose: 'personal_income_tax',
    label: 'Personal Income Tax',
    imgSrc: '/images/dollar.svg',
  },
  {
    name: 'PayFees',
    purpose: 'pay_fees',
    label: 'Pay Fees',
    imgSrc: '/images/contract.svg',
  },
  {
    name: 'HomeImprovements',
    purpose: 'home_improvements',
    label: 'Home Improvements',
    imgSrc: '/images/home.svg',
  },
  {
    name: 'FuneralServices',
    purpose: 'funeral_services',
    label: 'Funeral Services',
    imgSrc: '/images/dollar.svg',
  },
  {
    name: 'Other',
    purpose: 'other',
    label: 'Other',
    imgSrc: '/images/dollar.svg',
  }
] as const

export const allProductPurposes = productsListConfig.map(product => product.purpose)
export const allProductNames = productsListConfig.map(product => product.name)

import * as z from 'zod'
const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]]

export const productPurposeZodEnum = z.enum(zodEnum(allProductPurposes))
export type ProductPurposeEnum = z.infer<typeof productPurposeZodEnum>
export const LOAN_PURPOSE_DEFALUT = 'other'

export const productNameZodEnum = z.enum(zodEnum(allProductNames))
export type ProductNameEnum = z.infer<typeof productNameZodEnum>

export const loanTermZodEnum = z.union([
  z.literal(2),
  z.literal(3),
  z.literal(5),
  z.literal(7),
])
export type LoanTermEnum = z.infer<typeof loanTermZodEnum>
export const LOAN_TERM_DEFAULT = 5

export const vehicleConditionZodEnum = z.enum(['new', 'used'])
export type VehicleConditionEnum = z.infer<typeof vehicleConditionZodEnum>
export const VEHICLE_CONDITION_DEFAULT = 'new'
export const BUYING_THROUGH_DEFAULT = 'dealership'

export const productConfigZod = z.object({
  name: productNameZodEnum,
  purpose: productPurposeZodEnum,
  label: z.string(),
  imgSrc: z.string(),
})
export type ProductConfig = z.infer<typeof productConfigZod>

export const loanAmountZod = z.number()
  .min(5000, { message: '$5k min' })
  .max(100000, { message: '$100k max' })
export const LOAN_AMOUNT_DEFAULT = 20000

export const vehicleYearZod = z.number()
  .min(1980, { message: '1980 min' })
  .max(2024, { message: '2024 max' })
export const VEHICLE_YEAR_DEFAULT = 2024

export const loanApplicationZod = z.object({
  purpose: productPurposeZodEnum,
  loanAmount: loanAmountZod,
  loanTerm: loanTermZodEnum,
  vehicleYear: vehicleYearZod,
  vehicleCondition: vehicleConditionZodEnum
})
export type LoanApplication = z.infer<typeof loanApplicationZod>

export class Product {
  name: ProductNameEnum
  purpose: ProductPurposeEnum
  label: string
  imgSrc: string
  loanType: LoanType

  constructor(data: ProductConfig) {
    this.name = data.name
    this.purpose = data.purpose
    this.label = data.label
    this.imgSrc = data.imgSrc
    this.loanType = this._loanType()
  }

  _loanType() {
    if (this.name === productNameZodEnum.enum.CarPurchase) {
      return LoanType.Vehicle
    }
    return LoanType.Personal
  }
}

export const ProductsList = productsListConfig.map(product => new Product(product))
export const Products = Object.fromEntries(
  ProductsList.map(product => [product.name, product])
) as Record<ProductNameEnum, Product>