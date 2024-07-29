import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'
import * as Sentry from "@sentry/nextjs"
import { MabActiveCampaignApi } from './MabActiveCampaignApi'
import { logServerEvent, EventName } from '@/lib/Supabase/events'
import { supabaseServerClient } from '@/lib/Supabase/init'

const requestBody = z.object({
  contact: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  deal: z.object({
    description: z.string().optional()
  })
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
    const { contact, deal } = requestBody.parse(body)

    const mabActiveCampaignApi = new MabActiveCampaignApi()
    const contactResponse = await mabActiveCampaignApi.contact.post(contact)
    contactId = contactResponse?.data?.contact?.id ?? null as string|null|undefined
    if (!contactId) {
      throw new Error('Contact id not found')
    }

    const dealData = {
      contact: contactId,
      account: '23', // update with Driva
      title: `${contact.firstName} ${contact.lastName}`,
      description: deal.description,
      owner: '3', // Rebecca Read // https://mabsydney.api-us1.com/api/3/users
    }

    const dealResponse = await mabActiveCampaignApi.deal.post(dealData)
    dealId = dealResponse?.data?.deal?.id ?? null as string|null|undefined
  } catch (e) {
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
    // await supabaseServerClient.from('f').insert({
    //   event_name: EventName.MAB_HOME_LOAN_DEAL_CREATED,
    //   status,
    //   error: errorMessage,
    //   dealId,
    //   contactId,
    // })  
    // @TODO create in supabase
    // logServerEvent(EventName.MAB_HOME_LOAN_DEAL_CREATED, {
    //   status,
    //   error: errorMessage,
    //   requestBody: request.body,
    //   contactId,
    // })
    return NextResponse.json({ status, error: errorMessage }, { status: statusCode })
  }
}



