'use server'
import { Event, logServerEvent } from '@/lib/Supabase/events'
import { kv } from '@vercel/kv'
import { twilioClient, } from '@/lib/Twilio/client'
import { MOBILE_NUMBER_FOR_OTP, FAKE_MOBILE_NUMBERS  } from '@/lib/Twilio/config'
import { Profile, supabaseServerClient } from '@/lib/Supabase/init'

const generateRandomFourDigitNumber = () => {
  let randomNumber = Math.floor(Math.random() * 10000)
  // Ensure the number is at least 1000 by adding 1000 if it's less than 1000
  if (randomNumber < 1000) {
    randomNumber += 1000
  }
  return randomNumber.toString()
}

const getMobileKey = (mobileNumber: string) => `${mobileNumber}-otp`

export const sendOTP = async ({ 
  mobileNumber,
  otpToSend = generateRandomFourDigitNumber(),
  expirySeconds = 3600 // 1 hour
}: { 
  mobileNumber: string,
  otpToSend?: string,
  expirySeconds?: number
})  => {
  let message: unknown = null
  try {
    if (FAKE_MOBILE_NUMBERS.includes(mobileNumber))  {
      otpToSend = mobileNumber.slice(-4)
    }
    message = await twilioClient.messages.create({
      body: `Your Driva verfication code is: ${otpToSend}`,
      from: MOBILE_NUMBER_FOR_OTP,
      to: mobileNumber,
    });
    return await kv.set(getMobileKey(mobileNumber), otpToSend, { ex: expirySeconds })
  } finally {
    logServerEvent(Event.OTP_SENT, { mobileNumber, otp: otpToSend, message })
  }
}

export const validateOTP = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }) => {
  const otpStored = await kv.get(getMobileKey(mobileNumber),)
  const isValid = otpStored?.toString() === otp.toString()
  logServerEvent(Event.OTP_VALIDATED, { mobileNumber, otp, isValid })
  return isValid
}


export const getProfile =  async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }) => {
  let data: Profile | null = null
  let error: string | null = null
  try {
    const isValid = await validateOTP({ mobileNumber, otp })
    if (!isValid) throw new Error('Invalid OTP') 
    const { data: profile, error: apiError } = await supabaseServerClient.from('Profiles').select('*').eq('mobilePhone', mobileNumber).single()
    data = profile
    error = apiError?.message ?? null
  } catch (e) {
    error = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    return { data, error }
  }
}