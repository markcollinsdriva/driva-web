'use server'
 
import { creditScoreRequest } from '@/lib/Equifax/CreditScoreRequest'
import { getCreditScore } from '@/lib/Equifax/GetCreditScore'
import { validateOTP } from './auth'
import { supabaseServerClient, Profile } from '@/lib/Supabase/init'
import { Event, logServerEvent } from '@/lib/Supabase/events'
import { PostgrestError } from '@supabase/supabase-js'

interface CreditScoreRequestOptions {
  isProd: boolean
}

interface CreditScoreResponse {
  score: string|null
  error: Error|null
  profile: Profile|null
  errorType: 'invalid-otp'|'supabase'|'parsing'|'equifax'|null
}

export const getCreditScoreWithAuth = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }, options: CreditScoreRequestOptions): Promise<CreditScoreResponse> => {
  let score: string|null = null
  let error: Error|PostgrestError|null = null
  let errorType: CreditScoreResponse['errorType'] = null
  let profile: Profile|null = null

  try {
    const isValid = await validateOTP({ mobileNumber, otp })
    if (!isValid) {
      errorType = 'invalid-otp'
      throw new Error('Invalid OTP')
    }
    
    const { data, error: supabaseError } = await supabaseServerClient.from('Profiles').select('*').eq('mobilePhone', mobileNumber).single()
    profile = data
    if (supabaseError) {
      errorType = 'supabase'
      throw supabaseError
    }
        
    const parseResult = creditScoreRequest.safeParse({
      firstName: data?.firstName,
      lastName: data?.lastName,
      addressLine1: data?.addressLine1,
      suburb: data?.suburb,
      state: data?.state,
      postCode: data?.postCode,
      dateOfBirth: {
        day: data?.dateOfBirthDay,
        month: data?.dateOfBirthMonth,
        year: data?.dateOfBirthYear
      }
    })

    if (parseResult.error) {
      errorType = 'parsing'
      throw parseResult.error
    }

    const { score: creditScore, error: creditScoreError } = await getCreditScore(parseResult.data, { isProd: options.isProd })
    score = creditScore

    if (creditScoreError) {
      errorType = 'equifax'
      throw creditScoreError
    }
  } catch (e) {
    error = e as Error
  } finally {
    insertCreditScore({ profile, score, error })
    logServerEvent(Event.CREDIT_SCORE_REQUESTED, { profile, score, error, errorType })
    return { score, error, errorType, profile }
  }
}

const insertCreditScore = async ({ profile, score, error }: { profile: Profile|null, score: string|null, error: Error|null }) => {
  if (!profile) return
  return await supabaseServerClient.from('CreditScores').insert({ 
    profileId: profile.id, 
    score: score ? parseInt(score) : null, 
    error: error ? error.message : null
  })
}