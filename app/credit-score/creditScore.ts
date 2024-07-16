'use server'
 
import { creditScoreRequest } from '@/lib/Equifax/CreditScoreRequest'
import { getCreditScore } from '@/lib/Equifax/GetCreditScore'
import { validateOTP } from './auth'
import { supabaseServerClient } from '@/lib/Supabase/init'

interface CreditScoreRequestOptions {
  isProd: boolean
}

interface CreditScoreResponse {
  score: string|null
  error: Error|null
  errorType: 'invalid-otp'|'supabase'|'parsing'|'equifax'|null
}

export const getCreditScoreWithAuth = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }, options: CreditScoreRequestOptions): Promise<CreditScoreResponse> => {
  let score: string|null = null
  let error: Error|null = null
  let errorType: CreditScoreResponse['errorType'] = null
  let profileId: string|null = null

  try {
    const isValid = await validateOTP({ mobileNumber, otp })
    if (!isValid) {
      errorType = 'invalid-otp'
      throw new Error('Invalid OTP')
    }
    
    const { data, error } = await supabaseServerClient.from('Profiles').select('*').eq('mobilePhone', mobileNumber).single()
    if (error) {
      errorType = 'supabase'
      throw error
    }
    
    profileId = data?.id
    
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
    error = e instanceof Error ? e: new Error('An unknown error occured')
  } finally {
    if (profileId) {
      insertCreditScore({ profileId, score, error })
    }
    return { score, error, errorType }
  }
}

const insertCreditScore = async ({ profileId, score, error }: { profileId: string, score: string|null, error: Error|null }) => {
  return await supabaseServerClient.from('CreditScores').insert({ 
    profileId, 
    score: score ? parseInt(score) : null, 
    error: error ? error.message : null
  })
}