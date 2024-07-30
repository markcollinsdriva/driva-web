import { ActiveCampaignApi } from "@/services/ActiveCampaign/ActiveCampaignApi"

export class MabActiveCampaignApi extends ActiveCampaignApi {
  private static apiKey = process.env.MAB_ACTIVE_CAMPAIGN_API_KEY!
  private static baseUrl = 'https://mabsydney.api-us1.com'

  constructor() {
    super(MabActiveCampaignApi.apiKey, MabActiveCampaignApi.baseUrl)
  }

  static createContact({
    email,
    firstName,
    lastName,
    mobilePhone
  }: {
    email: string,
    firstName: string,
    lastName: string,
    mobilePhone: string
  }) {
    return {
      contact: {
        firstName,
        lastName,
        email,
        phone: mobilePhone
      }
    }
  }

  static createDeal({
    activeCampaignContactId,
    title,
    description,
  }:{ 
    activeCampaignContactId: string,
    title: string,
    description: string
  }) {
    return {
      deal: {
        contact: activeCampaignContactId,
        account: '23', // update with Driva
        title,
        description,
        owner: '3', // Rebecca Read // https://mabsydney.api-us1.com/api/3/users
      }
    }
  }
}
