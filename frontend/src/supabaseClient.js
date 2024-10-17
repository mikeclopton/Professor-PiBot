import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://yryikveitsajowqjuewz.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeWlrdmVpdHNham93cWp1ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NjU1OTEsImV4cCI6MjA0MjM0MTU5MX0.wXBjw_ynVx9fTs15A54OkBXle66TkPl5y7CNelk5KQ4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
