const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { start_time, end_time, duration } = JSON.parse(event.body);

    // Update the study session with the end time and duration
    const { data, error } = await supabase
        .from('study_sessions')
        .update({ end_time: new Date(end_time), duration })
        .eq('start_time', new Date(start_time));

    if (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Timer stopped' }),
    };
};
