import { headers } from 'next/headers'
import { NextRequest,  NextResponse } from "next/server"
import { z } from 'zod'
 
const EQUIFAX_USERNAME_DEV = process.env.EQUIFAX_USERNAME_DEV ?? ''
const EQUIFAX_USERNAME_PROD = process.env.EQUIFAX_USERNAME_PROD ?? ''

const EQUIFAX_PASSWORD_DEV = process.env.EQUIFAX_PASSWORD_DEV ?? ''
const EQUIFAX_PASSWORD_PROD = process.env.EQUIFAX_PASSWORD_PROD ?? ''

const EQUIFAX_API_DEV = 'https://ctaau.apiconnect.equifax.com.au/cta/sys2/soap11/score-seeker-v1-0'
const EQUIFAX_API_PROD = 'https://apiconnect.equifax.com.au/sys2/soap11/score-seeker-v1-0'

const getEquifaxConfig = (isProd: boolean) => {
  return {
    url: isProd ? EQUIFAX_API_PROD : EQUIFAX_API_DEV,
    username: isProd ? EQUIFAX_USERNAME_PROD : EQUIFAX_USERNAME_DEV,
    password: isProd ? EQUIFAX_PASSWORD_PROD : EQUIFAX_PASSWORD_DEV
  }
}

type EquifaxConfig = ReturnType<typeof getEquifaxConfig>

const creditScoreInputs = z.object({
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
});

type CreditScoreInputs = z.infer<typeof creditScoreInputs>

export async function POST(request: NextRequest) {
  let status = 200
  let score: string|null = null
  let error: string|null = null

  try {
    const headersList = headers()
    const apiKey = headersList.get('x-api-key')
    if (!apiKey) throw new Error('API key missing')
    if (apiKey !== process.env.X_API_KEY) throw new Error('Invalid API key')

    const isProd = headersList.get('env') ==' prod'

    if (request.method !== 'POST') throw new Error('Invalid method')
    const body = await request.json()
    const parseResult = creditScoreInputs.safeParse(body)
    if (!parseResult.success) {
      throw new Error('Invalid request body')
    } 

    const equifaxConfig = getEquifaxConfig(isProd)

    const equifaxResponse = await xmlPost({
      url: equifaxConfig.url,
      body: getEquifaxRequestBody(parseResult.data, equifaxConfig)
    })
    if(!equifaxResponse.ok) {
      console.log(equifaxResponse.json())
      throw new Error('Request failed')
    }
  
    const responseText = await equifaxResponse.text()
    score = extractScoreMasterscaleFromEquifaxAPIResponse(responseText)
    if (!score) throw new Error('No score found')
  } catch (e) {
    status = 500
    error = e instanceof Error ? e.message : 'An error occurred'
    console.log(e)
  }

  return NextResponse.json(
    { score, error }, 
    { 
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
}

const xmlPost = async ({ url, body }: { url: string, body: string })  => {
  console.log(body)
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml'
    },
    body  
  })
}
 
const getEquifaxRequestBody = (
  { firstName, lastName, streetNumber, streetName, streetType, suburb, state, postCode, dateOfBirth }: CreditScoreInputs,
  equifaxConfig: EquifaxConfig
) => {
  const dateOfBirthDateTime = new Date(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day)
  const dateOfBirthDate = dateOfBirthDateTime.toISOString().split('T')[0]

  return (
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:vh="http://vedaxml.com/soap/header/v-header-v1-10.xsd" xmlns:scor="http://vedaxml.com/vxml2/score-seeker-v1-0.xsd">
      <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
              <wsse:UsernameToken>
                  <wsse:Username>${equifaxConfig.username}</wsse:Username>
                  <wsse:Password>${equifaxConfig.password}</wsse:Password>
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
                <scor:date-of-birth>${dateOfBirthDate}</scor:date-of-birth>
            </scor:subject-identity>
        </scor:request>
    </soapenv:Body>
  </soapenv:Envelope>`
  )
}

const extractScoreMasterscaleFromEquifaxAPIResponse = (response: string) => {
  const re = new RegExp('(?<=<vs:score-masterscale>).*?(?=<\/vs:score-masterscale>)')
  const results = response.match(re)
  return results?.[0] ?? null
}

