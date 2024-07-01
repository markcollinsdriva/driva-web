import { headers } from 'next/headers'
import { NextRequest,  NextResponse } from "next/server"
import { EquifaxConfig } from './EquifaxConfig'
import { creditScoreRequestBody } from './RequestBody'
import { EquifaxScoreSeekerRequest } from './EquifaxScoreSeekerRequest'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import {createAddressFromAddressLine1 } from '@/lib/Address'
import { GeoapifySearch } from '@/lib/Geoapify'

enum ENV {
  PROD = 'prod',
  DEV = 'dev'
}

export async function POST(request: NextRequest) {
  let status = 200
  let score: string|null = null
  let error: Error|null = null
  let errorMessage: string|null = null

  try {
    const headersList = headers()
    validateApiKey(headersList)

    const body = await request.json()
    const parseResult = creditScoreRequestBody.safeParse(body)
    if (!parseResult.success) {
      throw new Error('Invalid request body')
    } 
    const searchParams = request.nextUrl.searchParams
    const isProd = searchParams.get('env') === ENV.PROD
    const requestData = parseResult.data

    const equifaxConfig = new EquifaxConfig({ isProd })
    const { addressLine1, suburb, state, postCode } = requestData
    const address = createAddressFromAddressLine1({ addressLine1, suburb, state, postCode });
    
    // ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...requestData, ...address }, equifaxConfig }))
    // if (score) return
      
    // try again with address from search
    const addressFromSearch = await GeoapifySearch.search(`${requestData.addressLine1} ${requestData.postCode}`)
    console.log('addressFromSearch', addressFromSearch)
    if (!addressFromSearch) throw new Error('No score found');

    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...requestData, ...addressFromSearch }, equifaxConfig }))
    if(error) throw error
  } catch (e) {
    status = 500
    errorMessage = e instanceof Error ? e.message : 'An error occurred'
    console.error(e)
  } finally {
    return NextResponse.json(
      { score, error: errorMessage }, 
      { 
        status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
  }
}

const validateApiKey = (headersList: ReadonlyHeaders) => {
  const apiKey = headersList.get('x-api-key')
  if (apiKey !== process.env.X_API_KEY) throw new Error('Invalid API key')
}
