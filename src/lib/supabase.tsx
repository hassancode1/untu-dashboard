import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwsfeqsmtvzdcxhmlvig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3c2ZlcXNtdHZ6ZGN4aG1sdmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2Mjc0NTMsImV4cCI6MjAyNjIwMzQ1M30.JSigXwcuUJsYa5K9m6k0kBJ_7F19V7MU4bQNISN15YA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;