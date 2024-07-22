'use server'

import { redirect } from 'next/navigation'
import { QuoteRequest, QuoteRequestInput } from './QuoteRequest'
import { DrivaApiConfig } from './DrivaApiConfig'

export const getQuoteAndRedirect = async (inputs: QuoteRequestInput) => {
  const config = new DrivaApiConfig({ isProd: false })
  const quoteRequest = new QuoteRequest(inputs, config)
  const { data } = await quoteRequest.getQuote()
  if (!data?.productURL) {
    throw new Error('No data in response')
  }
  redirect(data.productURL)
}

