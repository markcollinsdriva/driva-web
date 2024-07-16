'use client'

import { create } from 'zustand'
import { sendOTP, validateOTP } from '@/app/credit-score/auth'

export interface AuthState {
  readonly otpLength: number
  mobileNumber: string|null
  otp: string|null
  status: 'waiting'|'sending-otp'|'validating-otp'|'error'|'auth-ok'
}

interface AuthStore extends AuthState {
  setMobileNumber: (mobileNumber: string) => void
  setOtp: (otp: string) => void
  sendOTP: () => Promise<void>
  validateOTP: () => Promise<void>
  setAndValidateOTP: (otp: string) => Promise<void>
}

const defaultState: AuthState = {
  otpLength: 4,
  mobileNumber: null,
  otp: null,
  status: 'waiting',
}

export const useAuth = create<AuthStore>((set, get) => ({
  ...defaultState,
  setMobileNumber: (mobileNumber) => set({ mobileNumber }),
  setOtp: (otp) => set({ otp }),
  sendOTP: async () => {
    const mobileNumber = get().mobileNumber
    if (!mobileNumber) return
    set({ status: 'sending-otp' })
    await sendOTP({  mobileNumber })
  },
  validateOTP: async () => {
    const { mobileNumber, otp } = get()
    if (!mobileNumber || !otp) return
    set({ status: 'validating-otp' })
    const isValid = await validateOTP({ mobileNumber, otp })
    set({ status: isValid ? 'auth-ok' : 'error' })
  },
  setAndValidateOTP: async (_otp) => {
    set({ otp: _otp })
    const { mobileNumber, otp, otpLength } = get()
    if (!mobileNumber || !otp || otp.length !== otpLength) return
    await get().validateOTP()
  }
}))