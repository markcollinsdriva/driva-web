'use server'
 import { kv } from '@vercel/kv'

const generateRandomFourDigitNumber = () => {
  let randomNumber = Math.floor(Math.random() * 10000)
  // Ensure the number is at least 1000 by adding 1000 if it's less than 1000
  if (randomNumber < 1000) {
    randomNumber += 1000
  }
  return randomNumber.toString()
}

const fakeMobileNumbers =[
  '0491570158',
  '0491577644',
  '0491578148',
  '0491578957',
]

export const sendOTP = async ({ 
  mobileNumber,
  otpToSend = generateRandomFourDigitNumber(),
  expirySeconds = 60
}: { 
  mobileNumber: string,
  otpToSend?: string,
  expirySeconds?: number
})  => {
  if (fakeMobileNumbers.includes(mobileNumber))  {
    otpToSend = mobileNumber.slice(-4)
  }
  await kv.set(mobileNumber, otpToSend, { ex: expirySeconds })
}

export const validateOTP = async ({ mobileNumber, otp }: { mobileNumber: string, otp: string }) => {
  const otpStored = await kv.get(mobileNumber)
  const isValid = otpStored?.toString() === otp.toString()
  return isValid
}
