import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'
import * as Sentry from "@sentry/nextjs"
import { MabActiveCampaignApi } from '@/lib/ActiveCampaign'
import { supabaseServerClient } from '@/lib/Supabase/init'
import { EventName, logServerEvent } from '@/lib/Supabase/events'
import { PostgrestError } from '@supabase/supabase-js'  

const requestBody = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  mobilePhone: z.string(),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  let statusCode = 200
  let status = 'ok'
  let errorMessage: string|null = null
  let error: Error|null = null
  let contactId: string|null = null
  let dealId: string|null = null

  try {
    const body = await request.json()
    const { firstName, lastName, email, mobilePhone, description } = requestBody.parse(body)

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

    const { error }  =await supabaseServerClient.from('Referrals').insert({ 
      email,
      partnerName: 'MAB',
      meta: { contactId, dealId, firstName, lastName, email, mobilePhone, description }
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



