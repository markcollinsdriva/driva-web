'use server'

import { EquifaxConfig } from './EquifaxConfig'
import { CreditScoreRequest } from './CreditScoreRequest'
import { EquifaxScoreSeekerRequest } from './EquifaxScoreSeekerRequest'
import {createAddressFromAddressLine1 } from '@/lib/Address'
import { GeoapifySearch } from '@/lib/Geoapify'

export async function getCreditScore(data: CreditScoreRequest, options : { isProd: boolean }) {
  const { isProd } = options
  let score: string|null = null
  let error: Error|null = null
  
  try {
    const equifaxConfig = new EquifaxConfig({ isProd })
    const { addressLine1, suburb, state, postCode } = data
    const address = createAddressFromAddressLine1({ addressLine1, suburb, state, postCode });

    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...data, ...address }, equifaxConfig }))
    if (error) throw error
      
    // try again with address from search
    const addressFromSearch = await GeoapifySearch.search(`${data.addressLine1} ${data.postCode}`)
    if (!addressFromSearch) throw new Error('No score found');

    ({ score, error } = await EquifaxScoreSeekerRequest.getScore({ inputs: { ...data, ...addressFromSearch }, equifaxConfig }))
    if(error) throw error
  } catch (e) {
    error = e instanceof Error ? e : new Error('An unknown error occured')
  } finally {
    return {
      score,
      error
    }
  }
}
