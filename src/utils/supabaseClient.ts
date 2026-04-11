import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Authentication will not work.');
}

// Fallback to valid strings if missing to prevent createClient from crashing
const safeUrl = supabaseUrl && supabaseUrl !== 'YOUR_SAMPLESWALA_SUPABASE_URL' ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey && supabaseAnonKey !== 'YOUR_SAMPLESWALA_ANON_KEY' ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(safeUrl, safeKey);
