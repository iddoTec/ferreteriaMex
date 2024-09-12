import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_URLSUPA;
const supabaseAnonKey = import.meta.env.PUBLIC_KEYSUPA;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);