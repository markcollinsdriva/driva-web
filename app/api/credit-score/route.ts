import { headers } from 'next/headers'
import { NextRequest,  NextResponse } from "next/server"
import { creditScoreRequest } from '@/services/Equifax/CreditScoreRequest'
import { getCreditScore } from '@/services/Equifax/GetCreditScore'
import { validateApiKey } from '@/app/api/validateApiKey'
import * as Sentry from "@sentry/nextjs"

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
    const parseResult = creditScoreRequest.safeParse(body)
    if (!parseResult.success) {
      throw new Error('Invalid request body')
    } 
    const searchParams = request.nextUrl.searchParams
    const isProd = searchParams.get('env') === ENV.PROD
    const requestData = parseResult.data;    
    ({ score, error } = await getCreditScore(requestData, { isProd }))
    if(error) throw error
  } catch (e) {
    status = 500
    error = e instanceof Error ? e : new Error('An unknown error occured')
    errorMessage = error.message
    
    Sentry?.captureException(e, {
      level: 'error',
      tags: {
        type: 'Get Credit Score API'
      },
      extra: {
        requestBody: request.body,
        error: e,
      }
    })
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
