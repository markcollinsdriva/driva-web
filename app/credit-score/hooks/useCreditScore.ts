'use client'

import { create } from 'zustand'
import { getCreditScore } from '@/app/credit-score/actions/getCreditScore'
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
    try {
      const { score, profile, errorType } = await getCreditScore({ mobileNumber, otp })
      set({ 
        score, 
        status: errorType ? 'error' : 'success',
        profile
       })
    } catch (e) {
      console.error(e)
    }
  }
}))
