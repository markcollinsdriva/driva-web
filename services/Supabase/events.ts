import { supabaseServerClient } from './init'
import { CURRENT_ENV } from '@/services/config'

export enum EventName {
  OTP_SENT = 'otp-sent',
  OTP_VALIDATED = 'otp-validated',
  CREDIT_SCORE_REQUESTED = 'credit-score-requested',
  CONTINUED_TO_QUOTE = 'continued-to-quote',
  MAB_HOME_LOAN_DEAL_CREATED = 'mab-home-loan-deal-created',
  CRA_LEAD_CREATED = 'cra-lead-created',
}

export const logServerEvent = async (name: string, data: any) => {
  return await supabaseServerClient.from('Events').insert({ name, meta: data, env: CURRENT_ENV })
}