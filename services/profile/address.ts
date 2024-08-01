import { z } from 'zod'

export const address = z.object({
  streetNumber: z.string(),
  streetName: z.string(),
  streetType: z.string(),
  suburb: z.string(),
  state: z.string(),
  postCode: z.string()
})

export type Address = z.infer<typeof address>

export const createAddressFromAddressLine1 = ({
  addressLine1, suburb, state, postCode
}: {
  addressLine1: string, suburb: string, state: string, postCode: string
}): Address => {
  const { streetNumber, streetName, streetType } = splitAddressLine1(addressLine1)
  return {
    streetNumber,
    streetName,
    streetType,
    suburb,
    state,
    postCode
  }
}

export const splitAddressLine1 = (addressLine1: string) => {
  const addressComponents = addressLine1.split(' ')
  return {
    streetNumber: addressComponents[0],
    streetName: addressComponents.slice(1, -1).join(' '),
    streetType: addressComponents[addressComponents.length - 1]
  }
}
