'use server'

import { QuoteRequest, QuoteRequestInput } from './QuoteRequest'
import { DrivaApiConfig } from './DrivaApiConfig'
import { logServerEvent, Event } from '@/lib/Supabase/events'

export const getQuote = async (inputs: QuoteRequestInput) => {
  let productURL: string|null = null
  let status = 'ok'
  let error: Error|null = null
  let response: any = null
  try {
    const config = new DrivaApiConfig({ isProd: false })
    const quoteRequest = new QuoteRequest(inputs, config)
    response = await quoteRequest.getQuote()
    productURL = response.data?.productURL ?? null
  } catch {
    status = 'error'
  } finally  {
    logServerEvent(Event.CONTINUED_TO_QUOTE, { ...inputs, error, response, status })
    return { productURL }
  }
}

