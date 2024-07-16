import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

export const supabaseServerClient = createClient<Database>(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_KEY!)