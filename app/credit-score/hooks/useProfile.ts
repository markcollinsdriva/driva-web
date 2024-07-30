'use client'

import { create } from 'zustand'
import { Profile } from '@/services/Supabase/init'
import { getProfile } from '@/app/auth/actions'
import { useAuth } from '@/app/auth/hooks/useAuth'
import { useEffect } from 'react'

export interface ProfileState {
  status: 'fetching'|'error'|'success'
  profile: Profile|null,
}

interface ProfileStore extends ProfileState {
  get: ({ mobileNumber, otp }: { mobileNumber: string, otp: string}) => void
}

const defaultState: ProfileState = {
  status: 'fetching',
  profile: null
}

const useProfileStore = create<ProfileStore>((set, get) => ({
  ...defaultState,
  get: async ({ mobileNumber, otp }) => {
    try {
      set({ status: 'fetching' })
      if (!mobileNumber || !otp) return
      const { data, error } = await getProfile({ mobileNumber, otp })
      set({ 
        profile: data, 
        status: error ? 'error' : 'success' 
      })
    } catch (e) {
      console.error(e)
    }
  }
}))


export const useProfile = () => {
  const [ mobileNumber, otp ] = useAuth(store => [ store.mobileNumber, store.otp ])
  const { get, profile } = useProfileStore()

  useEffect(() => {
    if (!mobileNumber || !otp) return
    get({ mobileNumber, otp })
  }, [ mobileNumber, otp, get ])

  return {
    profile
  }
}


