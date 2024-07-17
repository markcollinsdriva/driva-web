'use client'

import { create } from 'zustand'
import { getCreditScoreWithAuth } from '@/app/credit-score/creditScore'

export interface CreditScoreState {
  score: string|null
  status: 'loading'|'error'|'success'
}
const IS_PROD = false

interface CreditScoreStore extends CreditScoreState {
  getScore: ({ mobileNumber, otp }: { mobileNumber?: string|null, otp?: string|null }) => Promise<void>
}

const defaultState: CreditScoreState = {
  score: null,
  status: 'loading'
}

export const useCreditScore= create<CreditScoreStore>((set, get) => ({
  ...defaultState,
  getScore: async ({ mobileNumber, otp }) => {
    if (!mobileNumber || !otp) return
    set({ status: 'loading' })
    const { score, error } = await getCreditScoreWithAuth({ mobileNumber, otp },{ isProd: IS_PROD })
    set({ score, status: error ? 'error' : 'success' })
  }
}))
