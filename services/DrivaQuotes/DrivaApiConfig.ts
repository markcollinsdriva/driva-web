export class DrivaApiConfig {
  baseUrl: string
  vehiclePostQuoteApi: string
  personalLoanPostQuoteApi: string
  partnerId: string
  xApiKey: string

  constructor(private data: { isProd: boolean }) {
    this.baseUrl = this.data.isProd ? 'https://api.driva.com.au/v1' : 'https://api-staging.driva.com.au/v1',
    this.vehiclePostQuoteApi = `${this.baseUrl}/quote/price`,
    this.personalLoanPostQuoteApi =`${this.baseUrl}/quote/personal-loan`
    this.partnerId = this.data.isProd 
      ? process.env.DRIVA_QUOTE_PARTNER_ID_PROD! 
      : process.env.DRIVA_QUOTE_PARTNER_ID_STAGING!
    this.xApiKey = this.data.isProd 
      ? process.env.DRIVA_QUOTE_API_KEY_PROD! 
      : process.env.DRIVA_QUOTE_API_KEY_STAGING!
  }

  get headers() {
    return {
      'Content-Type': 'application/json',
      'partnerId': this.partnerId,
      'x-api-key': this.xApiKey
    }
  }
}

