import { ActiveCampaignApi } from "./ActiveCampaignApi"

export class MabActiveCampaignApi extends ActiveCampaignApi {
  private static apiKey = process.env.MAB_ACTIVE_CAMPAIGN_API_KEY!
  private static baseUrl = 'https://mabsydney.api-us1.com'

  constructor() {
    super(MabActiveCampaignApi.apiKey, MabActiveCampaignApi.baseUrl)
  }
}
