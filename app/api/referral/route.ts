import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'
import * as Sentry from "@sentry/nextjs"
import { MabActiveCampaignApi } from '@/services/ActiveCampaign'
import { supabaseServerClient } from '@/services/Supabase/init'
import { EventName, logServerEvent } from '@/services/Supabase/events'
import { validateApiKey } from '@/app/api/validateApiKey'

const requestBody = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  mobilePhone: z.string(),
  description: z.string().optional(),
  partnerName: z.literal('mab') // must match  Database['public']['Enums']['referralPartnerName']
})

export async function POST(request: NextRequest) {
  let statusCode = 200
  let status = 'ok'
  let errorMessage: string|null = null
  let error: Error|null = null
  let contactId: string|null = null
  let dealId: string|null = null

  try {
    validateApiKey(request.headers)
    const body = await request.json()
    const { firstName, lastName, email, mobilePhone, description, partnerName } = requestBody.parse(body)

    const mabActiveCampaignApi = new MabActiveCampaignApi()

    const contact = MabActiveCampaignApi.createContact({  firstName, lastName, email, mobilePhone })
    const contactResponse = await mabActiveCampaignApi.contact.post(contact)
    contactId = contactResponse?.data?.contact?.id ?? null as string|null|undefined

    if (!contactId) {
      throw new Error('Contact id not found')
    }

    const deal = MabActiveCampaignApi.createDeal({ 
      activeCampaignContactId: contactId, 
      title: `${firstName} ${lastName}`, 
      description: description || ''
    })
    const dealResponse = await mabActiveCampaignApi.deal.post(deal)
    dealId = dealResponse?.data?.deal?.id ?? null as string|null|undefined

    const { error } = await supabaseServerClient.from('Referrals').insert({ 
      email,
      partnerName,
      meta: { firstName, lastName, email, mobilePhone, description, partnerName }
    })
    if (error) {
      throw new Error(error.details)
    }
  } catch (e: unknown) {
    status = 'error'
    statusCode = 500
    error = e instanceof Error ? e : new Error('An unknown error occured')
    errorMessage = error.message

    Sentry?.captureException(e, {
      level: 'error',
      tags: {
        type: 'MAB Active Campaign'
      },
      extra: {
        requestBody: request.body,
        error: e,
      }
    })
  } finally {
    logServerEvent(EventName.MAB_HOME_LOAN_DEAL_CREATED, {
      requestBody: request.body,
      status,
      statusCode,
      errorMessage,
      error,
      contactId,
      dealId
    })
    return NextResponse.json({ status, error: errorMessage }, { status: statusCode })
  }
}



