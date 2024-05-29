import { headers } from 'next/headers'
import { NextRequest,  NextResponse } from "next/server"
import { EquifaxConfig } from './EquifaxConfig'
import { creditScoreRequestBody } from './RequestBody'
import { EquifaxScoreSeekerRequest } from './EquifaxScoreSeekerRequest'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

export async function POST(request: NextRequest) {
  let status = 200
  let score: string|null = null
  let error: string|null = null

  try {
    const headersList = headers()
    validateApiKey(headersList)

    const body = await request.json()
    const parseResult = creditScoreRequestBody.safeParse(body)
    if (!parseResult.success) {
      throw new Error('Invalid request body')
    } 
    const isProd = headersList.get('env') ==' prod'
    const equifaxConfig = new EquifaxConfig({ isProd })
    const equifaxScoreSeekerRequest = EquifaxScoreSeekerRequest.createFromRequestBody({
      requestBody: parseResult.data,
      equifaxConfig
    })

    const { score: equifaxScore, error } = await equifaxScoreSeekerRequest.getScore()
    score = equifaxScore
    if(error) throw error
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

const validateApiKey = (headersList: ReadonlyHeaders) => {
  const apiKey = headersList.get('x-api-key')
  if (apiKey !== process.env.X_API_KEY) throw new Error('Invalid API key')
}
