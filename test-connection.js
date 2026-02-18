const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://oajylahnjncfinpoypup.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hanlsYWhuam5jZmlucG95cHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTIxMzQsImV4cCI6MjA4Njc4ODEzNH0.9sTS7iJdKWVgdp4BJdpadStTohLH7GeXa_lReRUbbFk';

async function testConnection() {
    console.log('Testing connection to:', SUPABASE_URL);
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data, error } = await supabase.from('crafting_items').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase Error:', error.message);
        } else {
            console.log('SUCCESS: Connection established! Data:', data);
        }
    } catch (err) {
        console.error('Network Error:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
    }
}

testConnection();
