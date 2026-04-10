require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { error } = await supabase.rpc('cleanup_old_messages');

    if (error) throw error;

    res.json({ success: true, message: 'Old messages cleaned up', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Cleanup cron error:', err);
    res.status(500).json({ error: 'Cleanup failed', message: err.message });
  }
};
