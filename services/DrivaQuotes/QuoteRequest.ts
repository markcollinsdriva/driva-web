import { isProfileNoNulls, Profile, ProfileNoNulls } from '@/services/Supabase/init'
import { 
  Product, 
  Products, 
  productNameZodEnum, 
  ProductNameEnum, 
  LOAN_AMOUNT_DEFAULT, VEHICLE_CONDITION_DEFAULT, BUYING_THROUGH_DEFAULT, LOAN_PURPOSE_DEFALUT, 
  VEHICLE_YEAR_DEFAULT
} from '@/app/credit-score/config'
import { createAddressFromAddressLine1 } from '@/services/address'
import { DrivaApiConfig } from './DrivaApiConfig'
import { dateOfBirthAsString } from '../dateOfBirth'

export interface QuoteRequestInputBase {
  profile?: Profile|null
  productName: ProductNameEnum
  creditScore?: number|null
  utmSource: string
  utmMedium: string
  utmCampaign: string
  loanAmount: number
  loanTerm: number
  vehicleYear?: number|null
  vehicleCondition?: string|null
}

export type QuoteRequestInput = QuoteRequestInputBase

interface QuoteRequestResponse {
  productURL?: string|null
  uuid?: string
  error?: string|null
}


export class QuoteRequest {
  private input: QuoteRequestInput
  private profile: ProfileNoNulls
  private product: Product

  constructor(input: QuoteRequestInput, private config: DrivaApiConfig) {
    this.input = input
    const { profile, productName } = input

    if(!isProfileNoNulls(profile)) {
      throw new Error('Profile must not contain null values')
    }
    this.profile = profile

    if (!productName) {
      throw new Error('Product name must be defined')
    }
    this.product = Products[productName]
  }

  get isVehicle() {
    return this.input.productName === productNameZodEnum.enum.CarPurchase
  }

  async getQuote() {
    const payload = this.getPayload()
    const api = this.isVehicle ? this.config.vehiclePostQuoteApi : this.config.personalLoanPostQuoteApi
    let error: string|null = null
    let data: Omit<QuoteRequestResponse, 'error'>|null = null

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(payload)
      })
      const responseJson = await response.json() as QuoteRequestResponse
      const { error: responseError, ...rest } = responseJson
      error = responseError ?? null
      data = rest
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error'
    }

    return {
      data,
      error
    }
  }

  private getPayload() {
    const input = this.input
    const profile = this.profile
    const isVehicle = this.isVehicle
    
    const address = createAddressFromAddressLine1({ 
      addressLine1: profile.addressLine1, 
      suburb: profile.suburb, 
      state: profile.state, 
      postCode: profile.postCode 
    })

    return {
      user: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        mobile: profile.mobilePhone,
        email: profile.email,
        dateOfBirth: dateOfBirthAsString({ year: profile.dateOfBirthYear, month: profile.dateOfBirthMonth, day: profile.dateOfBirthDay }),
        residency: profile.residency,
        employment: [
          {
            type: profile.employmentType,
            current: true
          }
        ],
        employmentIndustryContinuation: true,
        livingSituation: profile.livingSituation,
        address: {
          streetNumber: address.streetNumber,
          street: address.streetType,
          suburb: address.suburb,
          postCode: address.postCode,
          state: address.state,
          durationYears: 4,
          durationMonths: 0
        }
      },
      loan: {
        amount: input.loanAmount || LOAN_AMOUNT_DEFAULT,
        term: input.loanTerm || 5,
        purpose: this.product.purpose || LOAN_PURPOSE_DEFALUT,
        ...(isVehicle && {
          balloon: 0
        })
      },
      utm: {
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmProduct: isVehicle ? 'car' : 'pl',
        // category: 'Paid channel'
      },
      extra: {
        source: input.utmSource,
        ...(isVehicle && { 
          vehicleYear: input.vehicleYear || VEHICLE_YEAR_DEFAULT,
          assetCondition: input.vehicleCondition || VEHICLE_CONDITION_DEFAULT,
          buyingThrough: BUYING_THROUGH_DEFAULT
        })
      },
      creditScore: {
        equifaxScore: input.creditScore,
        equifaxOneScore: input.creditScore,
        vedaScore: input.creditScore,
        experianScore: input.creditScore
      }
    }
  }
  
}

