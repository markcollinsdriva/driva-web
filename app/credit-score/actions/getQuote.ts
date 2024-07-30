'use server'

import { QuoteRequest, QuoteRequestInput } from '@/services/DrivaQuotes/QuoteRequest'
import { DrivaApiConfig } from '@/services/DrivaQuotes/DrivaApiConfig'
import { logServerEvent, EventName } from '@/services/Supabase/events'
import * as Sentry from "@sentry/nextjs"
import { IS_PROD } from '@/services/config'

export const getQuote = async (inputs: QuoteRequestInput) => {
  let productURL: string|null = null
  let status = 'ok'
  let error: Error|null = null
  let response: any = null

  try {
    const config = new DrivaApiConfig({ isProd: IS_PROD })
    const quoteRequest = new QuoteRequest(inputs, config)
    response = await quoteRequest.getQuote()
    productURL = response.data?.productURL ?? null
  } catch (e) {
    status = 'error'
    Sentry?.captureException(e, {
      level: 'error',
      tags: {
        type: 'Get Driva Quote UI'
      },
      extra: {
        inputs,
        response
      }
    })
  } finally  {
    logServerEvent(EventName.CONTINUED_TO_QUOTE, { ...inputs, error, response, status })
    return { productURL }
  }
}

