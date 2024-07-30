'use client'

import { create } from 'zustand'
import { getCreditScore } from '@/app/credit-score/getCreditScore'
import { Profile } from '@/services/Supabase/init'

export interface CreditScoreState {
  score: string|null
  profile: Profile|null // adding profile to the state is a hack, we need to verify the OTP to ensure we don't just get any data, and currently this only happens with the credit score require
  status: 'loading'|'error'|'success'
}

interface CreditScoreStore extends CreditScoreState {
  getScore: ({ mobileNumber, otp }: { mobileNumber?: string|null, otp?: string|null }) => Promise<void>
}

const defaultState: CreditScoreState = {
  score: null,
  profile: null,
  status: 'loading'
}

export const useCreditScore= create<CreditScoreStore>((set, get) => ({
  ...defaultState,
  getScore: async ({ mobileNumber, otp }) => {
    if (!mobileNumber || !otp) return
    set({ status: 'loading' })
    let score: string|null = null
    let profile: Profile|null = null
    let error: Error|null = null

    try {
      ({ score, error, profile } = await getCreditScore({ mobileNumber, otp }))
    } catch (e) {
      console.error(e)
    }
    set({ 
      score, 
      status: error ? 'error' : 'success',
      profile
     })
  }
}))
