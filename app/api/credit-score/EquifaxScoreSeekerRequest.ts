import { z } from 'zod'
import { EquifaxConfig } from './EquifaxConfig'
import { CreditScoreRequestBody } from './RequestBody'
 
const equifaxCreditScoreInputs = z.object({
  firstName: z.string(),
  lastName: z.string(),
  streetNumber: z.string(),
  streetName: z.string(),
  streetType: z.string(),
  suburb: z.string(),
  state: z.string(),
  postCode: z.string(),
  dateOfBirth: z.object( {
    day: z.number(),
    month: z.number(),
    year: z.number()
  })
})

type EquifaxCreditScoreInputs = z.infer<typeof equifaxCreditScoreInputs>

export class EquifaxScoreSeekerRequest {
  private inputs: EquifaxCreditScoreInputs
  private equifaxConfig: EquifaxConfig

  constructor({ 
    inputs,
    equifaxConfig
  }: { 
    inputs: EquifaxCreditScoreInputs,
    equifaxConfig: EquifaxConfig
  }) {
    this.inputs = inputs
    this.equifaxConfig = equifaxConfig
  }

  static createFromRequestBody({
    requestBody,
    equifaxConfig
  }: {
    requestBody: CreditScoreRequestBody, 
    equifaxConfig: EquifaxConfig
  }) {
    const { addressLine1, ...rest } = requestBody
    const addressComponents = addressLine1.split(' ')

    return new EquifaxScoreSeekerRequest({
      inputs: {
        ...rest,
        streetNumber: addressComponents[0],
        streetName: addressComponents.slice(1, -1).join(' '),
        streetType: addressComponents[addressComponents.length - 1]
      },
      equifaxConfig
    })
  }

  async getScore() {
    const { text, error: requestError } = await this.sendRequest()
    const { score, error: formatError } = EquifaxScoreSeekerRequest.formatResponseText(text)
    return {
      score, 
      error: requestError ?? formatError ?? null
    }
  }

  async sendRequest() {
    let text: string = ''
    let error: Error|null = null
    try {
      const response = await fetch(this.equifaxConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml'
        },
        body: this.requestBody
      })
  
      if(!response.ok) {
        console.log(response.json())
        throw new Error('Request failed')
      }
      text = await response.text() ?? ''
    } catch (e) {
      error = e instanceof Error ? e : new Error('An error occurred')
      console.log(e)
    }

    return {
      text,
      error
    }
  }

  static formatResponseText = (text: string) => {
    const re = new RegExp('(?<=<vs:score-masterscale>).*?(?=<\/vs:score-masterscale>)')
    const results = text.match(re)
    const score = results?.[0] ?? null
    return  {
      score,
      error: !score ? new Error('No score found') : null
    }
  }

  get dateOfBirthDate() {
    const { day, month, year } = this.inputs.dateOfBirth
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0]
  }

  get requestBody() {
    const { firstName, lastName, streetNumber, streetName, streetType, suburb, state, postCode } = this.inputs
    return (
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:vh="http://vedaxml.com/soap/header/v-header-v1-10.xsd" xmlns:scor="http://vedaxml.com/vxml2/score-seeker-v1-0.xsd">
        <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
            <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                <wsse:UsernameToken>
                    <wsse:Username>${this.equifaxConfig.username}</wsse:Username>
                    <wsse:Password>${this.equifaxConfig.password}</wsse:Password>
                </wsse:UsernameToken>
            </wsse:Security>
            <wsa:To>https://vedaxml.corp.dmz/sys2/soap11/score-seeker-v1-0</wsa:To>
            <wsa:Action>http://vedaxml.com/score-seeker/EnquiryRequest</wsa:Action>
        </soapenv:Header>
        <soapenv:Body>
          <scor:request>
              <scor:enquiry-header>
                  <scor:client-reference>my-ref-101</scor:client-reference>
                  <scor:operator-id>I1N3</scor:operator-id>
                  <scor:operator-name>Driva Team</scor:operator-name>
                  <scor:permission-type-code>XY</scor:permission-type-code>
                  <scor:product-data-level-code>C</scor:product-data-level-code>
              </scor:enquiry-header>
              <scor:score-type>
                  <scor:what-if>
                      <scor:requested-scores>
                          <scor:scorecard-id>ONE_1.0_XY_CR</scor:scorecard-id>
                      </scor:requested-scores>
                      <scor:enquiry>
                          <scor:account-type-code>PL</scor:account-type-code>
                          <scor:enquiry-amount currency-code="AUD">0</scor:enquiry-amount>
                          <scor:relationship-code>1</scor:relationship-code>
                      </scor:enquiry>
                  </scor:what-if>
              </scor:score-type>
              <scor:subject-identity>
                  <scor:current-name>
                      <scor:family-name>${lastName}</scor:family-name>
                      <scor:first-given-name>${firstName}</scor:first-given-name>
                  </scor:current-name>
                  <scor:addresses>
                      <scor:address type="C">
                          <scor:street-number>${streetNumber}</scor:street-number>
                          <scor:street-name>${streetName}</scor:street-name>
                          <scor:street-type>${streetType}</scor:street-type>
                          <scor:suburb>${suburb}</scor:suburb>
                          <scor:state>${state}</scor:state>
                          <scor:postcode>${postCode}</scor:postcode>
                          <scor:country-code>AUS</scor:country-code>
                      </scor:address>
                  </scor:addresses>
                  <scor:gender-code>U</scor:gender-code>
                  <scor:date-of-birth>${this.dateOfBirthDate}</scor:date-of-birth>
              </scor:subject-identity>
          </scor:request>
        </soapenv:Body>
      </soapenv:Envelope>`
    )
  }
}