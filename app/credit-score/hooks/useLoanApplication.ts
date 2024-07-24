'use client'

import { create } from 'zustand'
import { Product } from '../config'

export interface LoanApplicationState {
  product: Product|null,
  utmSource: string|null,
  utmMedium: string|null,
  utmCampaign: string|null,
}

interface LoanApplicationStore extends LoanApplicationState {
  // updateValue: <K extends keyof LoanApplicationState>(key: K, value: LoanApplicationState[K]) => void
  updateValues: (newState: Partial<LoanApplicationState>) => void
}

const defaultState: LoanApplicationState = {
  product: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
}

export const useLoanApplication = create<LoanApplicationStore>((set, get) => ({
  ...defaultState,
  // updateValue: (key, value) => set({ [key]: value })
  updateValues: (newState) => set(oldState => ({ ...oldState, ...newState }))
}))

