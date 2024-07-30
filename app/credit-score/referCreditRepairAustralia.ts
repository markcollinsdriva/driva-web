'use server'

import { logServerEvent, EventName } from '@/services/Supabase/events'
import { Profile } from '@/services/Supabase/init'
import { CraActiveCampaignApi } from "@/services/ActiveCampaign"

export const referToCreditRepairAustralia = async ({ profile }: { profile: Profile }) => {
  let status = 'ok'
  let error: unknown|null = null
  let activeCampaignResponse: any = null
 
  try {
    const contact = CraActiveCampaignApi.createContact({ profile })
    const craActiveCampaignApi = new CraActiveCampaignApi()
    activeCampaignResponse = await craActiveCampaignApi.contact.post(contact)
  } catch (e) { 
    error = e
    status = 'error'
    console.error('Error creating CRA lead', error)
  } finally  {
    logServerEvent(EventName.CRA_LEAD_CREATED, { profile, error, activeCampaignResponse, status })
    return { status }
  }
}


