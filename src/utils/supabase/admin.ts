import { createClient } from '@supabase/supabase-js';
import { createFallbackClient, isSupabaseConfigured } from './fallback';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = isSupabaseConfigured() && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createFallbackClient();