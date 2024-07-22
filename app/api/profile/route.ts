import { headers } from 'next/headers'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { NextRequest,  NextResponse } from "next/server"
import { creditScoreRequest } from '@/lib/Equifax/CreditScoreRequest'
import { getCreditScore } from '@/lib/Equifax/GetCreditScore'
import { supabaseServerClient } from '@/lib/Supabase/init'

export async function POST(request: NextRequest) {
  let status = 200
  let data: unknown|null = null
  let error: Error|null = null
  let errorMessage: string|null = null

  try {
    if(error) throw error
  } catch (e) {
    status = 500
    errorMessage = e instanceof Error ? e.message : 'An unknown error occured'
  } finally {
    return NextResponse.json(
      { data, error: errorMessage }, 
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

