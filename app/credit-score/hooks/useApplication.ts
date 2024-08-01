'use client'

import { create } from 'zustand'
import { Product } from '../config'

export interface ApplicationState {
  product: Product|null,
  utmSource: string|null,
  utmMedium: string|null,
  utmCampaign: string|null,
}

interface ApplicationStore extends ApplicationState {
  updateValues: (newState: Partial<ApplicationState>) => void
}

const defaultState: ApplicationState = {
  product: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
}

export const useApplication = create<ApplicationStore>((set, get) => ({
  ...defaultState,
  updateValues: (newState) => set(oldState => ({ ...oldState, ...newState }))
}))

