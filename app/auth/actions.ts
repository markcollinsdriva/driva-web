'use server'
import { Event, logServerEvent } from '@/lib/Supabase/events'
import { kv } from '@vercel/kv'
import { twilioClient, } from '@/lib/Twilio/client'
import { MOBILE_NUMBER_FOR_OTP, FAKE_MOBILE_NUMBERS  } from '@/lib/Twilio/config'

const generateRandomFourDigitNumber = () => {
  let randomNumber = Math.floor(Math.random() * 10000)
  // Ensure the number is at least 1000 by adding 1000 if it's less than 1000
  if (randomNumber < 1000) {
    randomNumber += 1000
  }
  return randomNumber.toString()
}

export const sendOTP = async ({ 
  mobileNumber,
  otpToSend = generateRandomFourDigitNumber(),
  expirySeconds = 60
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
    return await kv.set(mobileNumber, otpToSend, { ex: expirySeconds })
  } finally {
    logServerEvent(Event.OTP_SENT, { mobileNumber, otp: otpToSend, message })
  }
}

export const validateOTP = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }) => {
  const otpStored = await kv.get(mobileNumber)
  const isValid = otpStored?.toString() === otp.toString()
  logServerEvent(Event.OTP_VALIDATED, { mobileNumber, otp, isValid })
  return isValid
}
