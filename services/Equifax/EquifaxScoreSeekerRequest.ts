import { z } from 'zod'
import { EquifaxConfig } from '@/services/Equifax/EquifaxConfig'
import * as Sentry from "@sentry/nextjs"
import { dateOfBirthAsString } from '@/services/profile'
 
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
  private _requestBody?: string = undefined

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

  static async getScore({ 
    inputs,
    equifaxConfig
  }: { 
    inputs: EquifaxCreditScoreInputs,
    equifaxConfig: EquifaxConfig
  }) {
    const request = new EquifaxScoreSeekerRequest({ inputs, equifaxConfig })
    return await request.getScore()
  }

  async getScore() {
    const { text, error: requestError } = await this.sendRequest()
    const { score, error: formatError } = EquifaxScoreSeekerRequest.formatResponseText(text)
    
    const errorResponse = requestError ?? formatError ?? null
    if (errorResponse) {
      Sentry?.captureException(errorResponse, {
        level: 'info',
        tags: {
          type: 'EquifaxScoreSeeker'
        },
        extra: {
          inputs: this.inputs,
          requestBody: this.requestBody,
          text,
        }
      })
    }

    return {
      score, 
      error: errorResponse
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
        throw new Error('Request to equifax failed')
      }
     
      text = await response.text() ?? ''
  
    } catch (e) {
      console.error(e)
      error = e instanceof Error ? e : new Error('An unknown error occured')
    }

    return {
      text,
      error
    }
  }

  static formatResponseText = (text: string) => {
    let error = null
    const scoreRegex = new RegExp('(?<=<vs:score-masterscale>).*?(?=<\/vs:score-masterscale>)')
    const results = text.match(scoreRegex)
    const score = results?.[0] ?? null
    if (score) {
      return { score, error }
    }

    const messageRegex = new RegExp('(?<=<vs:message code="000003">).*?(?=<\/vs:message>)')
    const messageResults = text.match(messageRegex)
    const message = messageResults?.[0] ?? null
    error = message ? new Error('No credit score file available.') : new Error('No score found. Please check your address and try again.')

    return { score, error }
  }

  get dateOfBirthDate() {
    const { day, month, year } = this.inputs.dateOfBirth
    return dateOfBirthAsString({ day, month, year })
  }

  get requestBody() {
    if (this._requestBody) {
      return this._requestBody
    }
    const { firstName, lastName, streetNumber, streetName, streetType, suburb, state, postCode } = this.inputs
    this._requestBody = (
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
    return this._requestBody
  }
}

function capitalizeFirstLetter(str: string) {
  // Convert the entire string to lowercase first
  let lowerCaseStr = str.toLowerCase();
  
  // Capitalize the first letter and concatenate with the rest of the string
  let result = lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
  
  return result;
}