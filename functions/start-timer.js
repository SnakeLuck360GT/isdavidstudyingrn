const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { start_time } = JSON.parse(event.body);

    // Insert a new study session with the start time
    const { data, error } = await supabase
        .from('study_sessions')
        .insert([{ start_time: new Date(start_time), date: new Date(start_time).toISOString().split('T')[0] }]);

    if (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Timer started' }),
    };
};
