import { z } from 'zod'
 
export const creditScoreRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  addressLine1: z.string(),
  suburb: z.string(),
  state: z.string(),
  postCode: z.string(),
  dateOfBirth: z.object( {
    day: z.number(),
    month: z.number(),
    year: z.number()
  })
})

export type CreditScoreRequest = z.infer<typeof creditScoreRequest>


