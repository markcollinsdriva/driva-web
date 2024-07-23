import { supabaseServerClient } from './init'
import { CURRENT_ENV } from '@/app/config'

export enum Event {
  OTP_SENT = 'otp-sent',
  OTP_VALIDATED = 'otp-validated',
  CREDIT_SCORE_REQUESTED = 'credit-score-requested',
  CONTINUED_TO_QUOTE = 'continued-to-quote',
}

export const logServerEvent = async (name: string, data: any) => {
  return await supabaseServerClient.from('Events').insert({ name, meta: data, env: CURRENT_ENV })
}