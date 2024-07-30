import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

export const supabaseServerClient = createClient<Database>(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_KEY!)


export type CreditScore = Database['public']['Tables']['CreditScores']['Row']
export type Profile = Database['public']['Tables']['Profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['Profiles']['Insert']

type MakeNonNullable<T> = T extends null | undefined ? never : T
export type RemoveNulls<T> = {
  [K in keyof T]: MakeNonNullable<T[K]>
}

export type ProfileNoNulls = RemoveNulls<Profile>

const isNullOrUndefined = (value: unknown) => value === null || value === undefined

export const isProfileNoNulls = (profile?: Profile|null): profile is ProfileNoNulls=> {
  if (!profile) return false
  
  return Object.values(profile).every(value => !isNullOrUndefined(value))
}
