import { Profile } from '@/services/Supabase/init'
import { dateOfBirthAsString } from '@/services/dateOfBirth'
import { IS_PROD } from '@/services/config'
import { ActiveCampaignApi } from '@/services/ActiveCampaign/ActiveCampaignApi'

export class CraActiveCampaignApi extends ActiveCampaignApi {
  private static apiKey = process.env.CREDIT_REPAIR_AUSTRALIA_ACTIVE_CAMPAIGN_API_KEY!
  private static baseUrl = 'https://creditrepair69334.api-us1.com'

  constructor() {
    super(CraActiveCampaignApi.apiKey, CraActiveCampaignApi.baseUrl)
  }

  static FieldId = {
    DateOfBirth: '2',
    Address: '82',
    UtmSource: '34',
    State: '4',
    PostCode: '3'
  } as const

  static createContact({ profile }: { profile: Profile }) {
    const dateOfBirth = (
      profile.dateOfBirthYear && profile.dateOfBirthMonth && profile.dateOfBirthDay
      && dateOfBirthAsString({ year: profile.dateOfBirthYear, month: profile.dateOfBirthMonth, day: profile.dateOfBirthDay })
    )
  
    const fieldValues = [
      {
        field: CraActiveCampaignApi.FieldId.UtmSource,
        value: IS_PROD ? 'Driva' : 'Driva X'
      },
      ...(dateOfBirth ? [{ field: CraActiveCampaignApi.FieldId.DateOfBirth, value: dateOfBirth }] : []),
      // ...(customer?.address?.addressFull ? [{ field: CRA_FIELD_ID.Address, value: customer.address.addressFull }] : []),
      ...(profile.state ? [{ field: CraActiveCampaignApi.FieldId.State, value:profile.state }] : []),
      ...(profile.postCode ? [{ field: CraActiveCampaignApi.FieldId.PostCode, value: profile.postCode }] : []),
    ];
  
    return {
      contact: {
        firstName: profile.firstName || 'unknown',
        lastName: profile.lastName || 'unknown',
        email: profile.email,
        phone: profile.mobilePhone,
        fieldValues
      }
    }
  }
}
