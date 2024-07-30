'use server'

import { logServerEvent, EventName } from "@/services/Supabase/events"
import { supabaseServerClient } from "@/services/Supabase/init"
import { Database } from "@/services/Supabase/types"
import * as Sentry from "@sentry/nextjs"

export const createApplication = async (inputs: {
  profileId: string,
  product: string,
  orgName: Database['public']['Enums']['applicationOrg'],
  utmSource?: string | null,
  utmMedium?: string | null,
  utmCampaign?: string | null,
}) => {
  let status = 'ok'
  let error: Error|null = null
  let errorMessage: string|null = null
  let response: any = null

  try {
    const { data, error } = await supabaseServerClient.from('Applications').insert({
      profileId: inputs.profileId,
      product: inputs.product,
      orgName: inputs.orgName,
      utmSource: inputs.utmSource,
      utmMedium: inputs.utmMedium,
      utmCampaign: inputs.utmCampaign
    }).select('*').single()
    response = data
    if (error) {
      throw new Error(error.details)
    }
  } catch (e) {
    status = 'error'
    errorMessage = e instanceof Error ? e.message : 'An unknown error occured'
    Sentry?.captureException(e, {
      level: 'error',
      tags: {
        type: 'Create Driva Application'
      },
      extra: {
        inputs,
        response
      }
    })
  } finally  {
    logServerEvent(EventName.CREATED_APPLICATION, { ...inputs, error, response, status })
    return { response, errorMessage, status }
  }
}
