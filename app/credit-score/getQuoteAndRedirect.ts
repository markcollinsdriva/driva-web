'use server'

import { redirect } from 'next/navigation'
import { QuoteRequest, QuoteRequestInput } from './QuoteRequest'
import { DrivaApiConfig } from './DrivaApiConfig'
import { logServerEvent, Event } from '@/lib/Supabase/events'

export const getQuoteAndRedirect = async (inputs: QuoteRequestInput) => {
  let status = 'ok'
  let error: Error|null = null
  let response: any = null
  try {
    const config = new DrivaApiConfig({ isProd: false })
    const quoteRequest = new QuoteRequest(inputs, config);
    (response = await quoteRequest.getQuote())
    redirect(response.data.productURL)
  } finally  {
    logServerEvent(Event.CONTINUED_TO_QUOTE, { ...inputs, error, response, status })
    return { status }
  }
}

