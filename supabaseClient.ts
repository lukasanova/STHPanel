import { createClient } from '@supabase/supabase-js';

// Lütfen kendi Supabase proje URL ve Anon Key bilgilerinizi buraya giriniz.
const SUPABASE_URL = 'https://qlmxqadvhnrasxybxsru.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iFc-aZoaQ2iL-l4Rf2maOw_oSDSP78s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);