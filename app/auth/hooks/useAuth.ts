'use client'

import { create } from 'zustand'
import { sendOTP, validateOTP } from '@/app/auth/actions'

export interface AuthState {
  readonly otpLength: number
  mobileNumber: string|null
  countryOfMobileNumber: keyof typeof MobilePhoneNumberRegexPerCountry
  otp: string|null
  status: 'enter-phone'|'invalid-phone'|'no-profile'|'sending-otp'|'enter-otp'|'validating-otp'|'invalid-otp'|'auth-ok'
}

interface AuthStore extends AuthState {
  reset: () => void
  setMobileNumber: (mobileNumber: string) => void
  sendOTP: () => Promise<void>
  setOTP: (otp: string) => Promise<void>
}

const defaultState: AuthState = {
  otpLength: 4,
  mobileNumber: null,
  countryOfMobileNumber: 'Australia',
  otp: null,
  status: 'enter-phone',
}

export const useAuth = create<AuthStore>((set, get) => ({
  ...defaultState,
  reset: () => set(defaultState),
  setMobileNumber: (mobileNumber) => {
    set({ 
      mobileNumber,
      status: 'enter-phone'
    })
  },
  sendOTP: async () => {
    const { mobileNumber, countryOfMobileNumber } = get()
    if (!mobileNumber) return
    const isValid = checkIfValidMobileNumber(mobileNumber, countryOfMobileNumber)
    if (!isValid) {
      set({ status:'invalid-phone' })
      return
    }
    set({ status: 'sending-otp' })
    const { status } = await sendOTP({  mobileNumber })
    if (status === 'no-profile') {
      set({ status })
      return
    }
    set({ status: 'enter-otp' })
  },
  setOTP: async (_otp) => {
    set({ otp: _otp, status: 'enter-otp' })
    const { mobileNumber, otp, otpLength } = get()
    if (!mobileNumber) {
      set({ status: 'enter-phone' })
      return
    }
    if(!otp || otp.length !== otpLength) return
    set({ status: 'validating-otp'})
    const isValid = await validateOTP({ mobileNumber, otp })
    set({ status: isValid ? 'auth-ok' : 'invalid-otp' })
  }
}))


const MobilePhoneNumberRegexPerCountry = {
  'Australia': /^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/
} as const

const checkIfValidMobileNumber = (
  mobileNumber: string|null,
  country: keyof typeof MobilePhoneNumberRegexPerCountry = 'Australia'
):boolean => {
  if (!mobileNumber) return false
  return MobilePhoneNumberRegexPerCountry[country].test(mobileNumber)
}