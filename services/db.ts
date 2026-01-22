import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT SETUP STEP ---
// You must create a Supabase project and replace the placeholder values below.
// 1. Go to https://supabase.com/dashboard/projects
// 2. Create a new project.
// 3. Go to your project's "API" settings.
// 4. Find your Project URL and anon key, then copy and paste them here.

const supabaseUrl = 'https://xetjjadrmagebgcjyacv.supabase.co'; // Replace with your actual Supabase URL
const supabaseAnonKey = 'sb_publishable_jzMOa3-suWoxhCKh-XDcEA_Ce1aIJfu'; // Replace with your actual anon key

// This check helps you remember to add your credentials.
if (supabaseUrl.includes('your-project-url') || supabaseAnonKey.includes('your-anon-public-key')) {
    const warningMessage = `
    ********************************************************************************
    *                                                                              *
    *    Supabase credentials are not set in 'services/db.ts'!                     *
    *                                                                              *
    *    Please replace the placeholder values with your actual Supabase           *
    *    Project URL and Anon Key.                                                 *
    *                                                                              *
    *    The application will not function correctly until this is done.           *
    *                                                                              *
    ********************************************************************************
    `;
    console.warn(warningMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});