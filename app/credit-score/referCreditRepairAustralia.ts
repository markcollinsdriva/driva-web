'use server'

import { logServerEvent, EventName } from '@/lib/Supabase/events'
import { Profile } from '@/lib/Supabase/init'
import { CraActiveCampaignApi } from "@/lib/ActiveCampaign"

export const referToCreditRepairAustralia = async ({ profile }: { profile: Profile }) => {
  let status = 'ok'
  let error: Error|null = null
  let response: any = null
 
  try {
    const contact = CraActiveCampaignApi.createContact({ profile })
    const craActiveCampaignApi = new CraActiveCampaignApi()
    await craActiveCampaignApi.contact.post(contact)
    // add log
  } catch {
    status = 'error'
  } finally  {
    logServerEvent(EventName.CRA_LEAD_CREATED, { ...profile, error, response, status })
    return { status }
  }
}


