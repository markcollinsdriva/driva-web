'use server'

import { EquifaxConfig } from './EquifaxConfig'
import { creditScoreRequest, CreditScoreRequest } from './CreditScoreRequest'
import { EquifaxScoreSeekerRequest } from './EquifaxScoreSeekerRequest'
import { createAddressFromAddressLine1 } from '@/lib/Address'
import { GeoapifySearch } from '@/lib/Geoapify'

export async function getCreditScore(data: CreditScoreRequest, options : { isProd: boolean }) {
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
    if (error) throw error
      
    // try again with address from search
    const addressFromSearch = await GeoapifySearch.search(`${creditScoreRequestData.addressLine1} ${creditScoreRequestData.postCode}`)
    if (!addressFromSearch) throw new Error('No score found');

    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...creditScoreRequestData, ...addressFromSearch }, equifaxConfig }))
    if(error) throw error
  } catch (e) {
    error = e as Error
  } finally {
    return {
      score,
      error
    }
  }
}
