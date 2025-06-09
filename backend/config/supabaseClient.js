// Supabase client setup for backend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let supabase = null;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'your_supabase_project_url') {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );
  } else {
    console.log('Supabase URL not configured, using PostgreSQL client only');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error.message);
}

module.exports = supabase;
