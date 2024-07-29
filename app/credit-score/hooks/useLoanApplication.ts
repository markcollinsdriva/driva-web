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
  updateValues: (newState) => set(oldState => ({ ...oldState, ...newState }))
}))

