'use client'

import { useSearchParams } from "next/navigation"
import { useApplication } from "@/app/credit-score/hooks/useApplication"
import { useEffect } from "react"

export const useUTMs = () => {
  const searchParams = useSearchParams()
  const updateLoanApplicationValues = useApplication(store => store.updateValues)
 
  const utmSource = searchParams.get('utm_source')
  const utmMedium = searchParams.get('utm_medium')
  const utmCampaign = searchParams.get('utm_campaign')

  useEffect(() => {
    updateLoanApplicationValues({
      utmSource, utmMedium, utmCampaign
    })
  }, [ utmSource, utmMedium, utmCampaign, updateLoanApplicationValues ])

  return {
    utmSource,
    utmMedium,
    utmCampaign
  }
}