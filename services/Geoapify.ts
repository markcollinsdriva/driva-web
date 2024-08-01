import { Address } from '@/services/address'

export class GeoapifySearch {
  static baseUrl= 'https://api.geoapify.com/v1/geocode/search'
  static apiKey: string = 'f5789a5f881446f7a643918441b8a236'

  static async search(addressSearchText: string): Promise<Address|null> {
    const url = GeoapifySearch.getURL(addressSearchText)
    const { data } = await GeoapifySearch.get(url)
    return data ? GeoapifySearch.formatResponse(data) : null
  }

  static getURL(addressSearchText: string) {
    return `${this.baseUrl}?text=${addressSearchText}&type=amenity&format=json&bias=countrycode:au&apiKey=${this.apiKey}`
  }

  static async get(url: string) {
    let error: Error|null = null
    let data: GeoapifyResponse|null = null
    try {
      const response = await fetch(url)
      if(!response.ok) {
        throw new Error('Request to geoapify failed')
      }
      
      data = await response.json() as GeoapifyResponse
    } catch(e) {
      error = e instanceof Error ?  e : new Error('An unknown error occured')
    }
    return {
      data,
      error
    }
  }

  static formatResponse(data: GeoapifyResponse): Address|null {
    const { results } = data
    const result = results?.[0]
    if (!result) return null
    const { housenumber, street, suburb, district, city, county, state_code, postcode } = result

    let streetComponents = street.split(" ")
    const streetType = streetComponents.pop() ?? ''
    const streetName = streetComponents.join(" ")

    return {
      streetNumber: housenumber,
      streetName,
      streetType,
      suburb: suburb || district || city || county,
      state: state_code,
      postCode: postcode
    }
  }
}

export interface GeoapifyResponse {
  results: Result[]
  query: Query
}

export interface Result {
  country_code: string
  housenumber: string
  street: string
  country: string
  county: string
  datasource: Datasource
  postcode: string
  state: string
  district: string
  city: string
  state_code: string
  lon: number
  lat: number
  result_type: string
  suburb?: string
  formatted: string
  address_line1: string
  address_line2: string
  timezone: Timezone
  plus_code: string
  plus_code_short: string
  rank: Rank
  place_id: string
}

export interface Datasource {
  sourcename: string
  attribution: string
  license: string
}

export interface Timezone {
  name: string
  offset_STD: string
  offset_STD_seconds: number
  offset_DST: string
  offset_DST_seconds: number
  abbreviation_STD: string
  abbreviation_DST: string
}

export interface Rank {
  popularity: number
  confidence: number
  match_type: string
}

export interface Query {
  text: string
  parsed: Parsed
}

export interface Parsed {
  housenumber: string
  street: string
  state: string
  expected_type: string
}
