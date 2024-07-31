'use server'

import { kv } from '@vercel/kv'
import { creditScoreRequest } from '@/services/Equifax/CreditScoreRequest'
import { getCreditScore as getCreditScoreEquifax } from '@/services/Equifax/GetCreditScore'
import { validateOTP } from '@/app/auth/actions'
import { supabaseServerClient, Profile } from '@/services/Supabase/init'
import { EventName, logServerEvent } from '@/services/Supabase/events'
import { PostgrestError } from '@supabase/supabase-js'
import * as Sentry from "@sentry/nextjs"

interface CreditScoreResponse {
  score: string|null
  profile: Profile|null
  errorType: 'invalid-otp'|'supabase'|'parsing'|'equifax'|null
}

const getCreditScoreKey = (mobileNumber: string) => `${mobileNumber}-credit-score`
const CREDIT_SCORE_CACHE_EXPIRY_SECONDS = 3600 // 1 hour

export const getCreditScore = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }): Promise<CreditScoreResponse> => {
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

    score = await kv.get(getCreditScoreKey(mobileNumber))
    
    const { data, error: supabaseError } = await supabaseServerClient.from('Profiles').select('*').eq('mobilePhone', mobileNumber).single()
    profile = data
    if (supabaseError) {
      errorType = 'supabase'
      throw supabaseError
    }

    // @ts-ignore if there is a score we can use the return in finally
    if (score) return
        
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

    const { score: creditScore, error: creditScoreError } = await getCreditScoreEquifax(parseResult.data, { isProd: !profile?.isTest  })
    if (creditScoreError) {
      errorType = 'equifax'
      throw creditScoreError
    }
    score = creditScore
    if (score) {
      await kv.set(getCreditScoreKey(mobileNumber), score, { ex: CREDIT_SCORE_CACHE_EXPIRY_SECONDS })
    }
  } catch (e) {
    error = e as Error
    Sentry?.captureException(e, {
      level: 'error',
      tags: {
        type: 'Get Credit Score UI'
      },
      extra: {
        errorType,
        profile,
        score
      }
    })
  } finally {
    insertCreditScore({ profile, score, error })
    logServerEvent(EventName.CREDIT_SCORE_REQUESTED, { profile, score, error, errorType })
    return { score, errorType, profile }
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