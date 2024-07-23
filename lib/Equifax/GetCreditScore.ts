'use server'

import { EquifaxConfig } from './EquifaxConfig'
import { creditScoreRequest, CreditScoreRequest } from './CreditScoreRequest'
import { EquifaxScoreSeekerRequest } from './EquifaxScoreSeekerRequest'
import { createAddressFromAddressLine1 } from '@/lib/Address'
import { GeoapifySearch } from '@/lib/Geoapify'

export async function getCreditScore(data: CreditScoreRequest, options : { isProd: boolean }): Promise<{ score: string|null, error: Error|null }> {
  const { isProd } = options
  let score: string|null = null
  let error: Error|null = null
  
  try {
    const parseResult = creditScoreRequest.safeParse(data)
    if (parseResult.error) {
      throw parseResult.error
    }
    const creditScoreRequestData = parseResult.data

    const equifaxConfig = new EquifaxConfig({ isProd })
    const { addressLine1, suburb, state, postCode } = creditScoreRequestData
    const address = createAddressFromAddressLine1({ addressLine1, suburb, state, postCode });
    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...creditScoreRequestData, ...address }, equifaxConfig }))
    if (score) throw null 
    // if score is found, we can just move to finally so the return statement is executed
    // is no score, then try again with address from search
    const addressFromSearch = await GeoapifySearch.search(`${creditScoreRequestData.addressLine1} ${creditScoreRequestData.state} ${creditScoreRequestData.postCode}`)
    if (!addressFromSearch) throw new Error('No score found');
    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...creditScoreRequestData, ...addressFromSearch }, equifaxConfig }))
  } catch (e) {
    error = e as Error|null
  } finally {
    return {
      score,
      error
    }
  }
}
