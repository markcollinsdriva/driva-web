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

interface ActiveCampaignContact {
  contact: { 
    email: string
    firstName: string
    lastName: string
    phone: string
    fieldValues?: Array<{
      field: string
      value: string
    }> 
  }
}

class ActiveCampaignApiContact {
  constructor(private config: ActiveCampaignApiConfig) {}

  get url() {
    return `${this.config.baseUrl}/api/3/contact/sync`
  }

  async post(contact: ActiveCampaignContact) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(contact)
    })
    return await response.json()
  }
}


interface ActiveCampaignDeal {
  deal: { 
    contact: string // contactId
    account: string // accountId
    description?: string
    currency?: string
    group?: string // groupId
    owner: string // ownerId
    percent?: any
    stage?: string
    status?: number
    title?: string
    value?: number
    fieldValues?: Array<{
      field: string
      value: string
    }> 
  }
}

class ActiveCampaignApiDeal {
  constructor(private config: ActiveCampaignApiConfig) {}

  get url() {
    return `${this.config.baseUrl}/api/3/deals`
  }

  async post(deal: ActiveCampaignDeal) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(deal)
    })
    return await response.json()
  }
}
