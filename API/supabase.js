const { createClient } = require('@supabase/supabase-js')

const setupSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    return supabase
}

module.exports = {
    setupSupabase
}