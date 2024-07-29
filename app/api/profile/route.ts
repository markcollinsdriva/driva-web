import { NextRequest,  NextResponse } from "next/server"
import { Profile, ProfileInsert, supabaseServerClient } from '@/lib/Supabase/init'
import { PostgrestError } from '@supabase/postgrest-js'
import { validateApiKey } from '@/app/api/validateApiKey'

export async function POST(request: NextRequest) {
  let status = 200
  let errorMessage: string|null = null
  let data: Profile|null = null
  try {
    validateApiKey(request.headers)
    const body = await request.json() as ProfileInsert
    const { error, data: profile } = await supabaseServerClient.from('Profiles').insert({
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
    }).select().single()
    if (error) {
      throw new Error((error as PostgrestError).message)
    }
    data = profile
  } catch (e) {
    status = 400
    errorMessage = e instanceof Error ? e.message : 'An error occurred'
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

