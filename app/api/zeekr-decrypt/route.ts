import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

const KEY = '123'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const

interface DecryptRequest {
  text: string
}

interface DecryptResults {
  mobile?: string
}

interface ApiResponse {
  results: DecryptResults
  error: string | null
}

const decrypt = (text: string, key: string): DecryptResults => ({ mobile: text })

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as DecryptRequest
    
    if (!body.text) {
      return NextResponse.json<ApiResponse>(
        { results: {}, error: 'Text is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const results = decrypt(body.text, KEY)
    
    return NextResponse.json<ApiResponse>(
      { results, error: null },
      { headers: CORS_HEADERS }
    )
  } catch (e) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred')
    
    Sentry.captureException(error, {
      level: 'error',
      tags: { type: 'Zeekr decryption error' },
      extra: {
        error: e,
      }
    })

    return NextResponse.json<ApiResponse>(
      { results: {}, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
