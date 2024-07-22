import { NextRequest,  NextResponse } from "next/server"
import { supabaseServerClient } from '@/lib/Supabase/init'
import { PostgrestError } from '@supabase/postgrest-js'
import { validateApiKey } from '@/app/api/validateApiKey'

export async function POST(request: NextRequest) {
  let status = 200
  let score: string|null = null
  let errorMessage: string|null = null

  try {
    const body = await request.json()
    const { error } =await supabaseServerClient.from('Profiles').insert({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobilePhone: body.mobilePhone,
      dateOfBirthDay: body.dateOfBirthDay,
      dateOfBirthMonth: body.dateOfBirthMonth,
      dateOfBirthYear: body.dateOfBirthYear,
      employmentType: body.employmentType,
      livingSituation: body.livingSituation,
      residency: body.residency,
      addressLine1: body.addressLine1,
      state: body.state,
      suburb: body.suburb,
      postCode: body.postCode,
    })
    if (error) {
      throw new Error((error as PostgrestError).message)
    }
  } catch (e) {
    status = 400
    errorMessage = e instanceof Error ? e.message : 'An error occurred'
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

