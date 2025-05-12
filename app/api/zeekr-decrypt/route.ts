import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import crypto from 'crypto'

const KEY = '0123456789abcdef0123456789abcdef' // 32 bytes for AES-256
const IV = '0123456789abcdef' // 16 bytes for AES
const ALGORITHM = 'aes-256-cbc'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const

interface DecryptRequest {
  data: string
}

interface DecryptResults {
  product?: string
  purchasePrice?: number
  deposit?: number
  year?: string
  assetCondition?: string
  make?: string
  model?: string
  configurations?: string
  email?: string
  firstName?: string
  lastName?: string
  mobilePhone?: string
  leadId?: string
  dealerCode?: string
  dealerEmail?: string
}

interface ApiResponse {
  results: DecryptResults|null
  error: string|null
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}

export async function GET() {
  try {
    const testData = {
      product: 'Car Loan',
      purchasePrice: 50000,
      deposit: 5000,
      year: '2023',
      make: 'Zeekr',
      model: '001',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      mobilePhone: '0400000000'
    }

    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV)
    const encrypted = cipher.update(JSON.stringify(testData), 'utf8', 'hex') + cipher.final('hex')

    return NextResponse.json(
      { encryptedData: encrypted },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Encryption failed' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

export async function POST(request: NextRequest) {
  let status = 200
  let results: DecryptResults | null = null
  let errorMessage: string | null = null

  try {
    const body = await request.json() as DecryptRequest
    if (!body.data) {
      status = 400
      throw new Error('Text is required')
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV)
    const decrypted = decipher.update(body.data, 'hex', 'utf8') + decipher.final('utf8')
    results = JSON.parse(decrypted) as DecryptResults
    
  } catch (e) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred')
    errorMessage = error.message
    if (status === 200) { // change status to 500 if it's not already set
      status = 500
    }

    Sentry.captureException(error, {
      level: 'error',
      tags: { type: 'Zeekr decryption error' },
      extra: {
        error: e,
      }
    })
  } finally {
    return NextResponse.json<ApiResponse>(
      { results, error: errorMessage },
      { status, headers: CORS_HEADERS }
    )
  }
}
