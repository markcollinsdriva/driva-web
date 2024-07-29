export class ActiveCampaignApi {
  private config: ActiveCampaignApiConfig
  contact: ActiveCampaignApiContact
  deal: ActiveCampaignApiDeal

  constructor(apiKey: string, baseUrl: string) {
    this.config = new ActiveCampaignApiConfig(apiKey, baseUrl)
    this.contact = new ActiveCampaignApiContact(this.config)
    this.deal = new ActiveCampaignApiDeal(this.config)
  }
}

class ActiveCampaignApiConfig {
  constructor(private apiKey: string, public baseUrl: string) {}

  get headers() {
    return {
      'API-TOKEN': this.apiKey,
    }
  }
}

class ActiveCampaignApiContact {
  constructor(private config: ActiveCampaignApiConfig) {}

  get url() {
    return `${this.config.baseUrl}/api/3/contact/sync`
  }

  async post(body: any) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(body)
    })
    return await response.json()
  }
}

class ActiveCampaignApiDeal {
  constructor(private config: ActiveCampaignApiConfig) {}

  get url() {
    return `${this.config.baseUrl}/api/3/contact/sync`
  }

  async post(body: any) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(body)
    })
    return await response.json()
  }
}
