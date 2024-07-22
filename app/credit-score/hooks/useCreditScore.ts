'use client'

import { create } from 'zustand'
import { getCreditScoreWithAuth } from '@/app/credit-score/getCreditScoreWithAuth'
import { Profile } from '@/lib/Supabase/init'

export interface CreditScoreState {
  score: string|null
  profile: Profile|null // adding profile to the state is a hack, we need to verify the OTP to ensure we don't just get any data, and currently this only happens with the credit score require
  status: 'loading'|'error'|'success'
}
const IS_PROD = false

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
    const { score, error, profile } = await getCreditScoreWithAuth({ mobileNumber, otp },{ isProd: IS_PROD })
    set({ 
      score, 
      status: error ? 'error' : 'success',
      profile
     })
  }
}))
