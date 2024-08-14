const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

exports.handler = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*');

    if (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }

    let totalDuration = 0;
    let todayDuration = 0;
    let weekDuration = 0;
    let monthDuration = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let isStudying = false;
    let currentDuration = 0;

    sessions.forEach(session => {
        const sessionStartTime = new Date(session.start_time);
        if (!session.end_time) {
            // If there's no end time, assume it's an ongoing session
            isStudying = true;
            currentDuration = Math.floor((new Date() - sessionStartTime) / 1000);
        } else {
            const sessionDuration = session.duration || 0;
            totalDuration += sessionDuration;

            if (session.date === today) {
                todayDuration += sessionDuration;
            }

            if (sessionStartTime >= oneWeekAgo) {
                weekDuration += sessionDuration;
            }

            if (sessionStartTime >= oneMonthAgo) {
                monthDuration += sessionDuration;
            }
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            is_studying: isStudying,
            current_duration: formatDuration(currentDuration),
            today: formatDuration(todayDuration),
            this_week: formatDuration(weekDuration),
            this_month: formatDuration(monthDuration),
            all_time: formatDuration(totalDuration),
        }),
    };
};
