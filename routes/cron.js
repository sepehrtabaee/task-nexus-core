const express = require('express');

const router = express.Router();

function checkCronAuth(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// Delete old messages, keep latest 10 per user
router.post('/cleanup-messages', async (req, res) => {
  if (!checkCronAuth(req, res)) return;

  try {
    const { error } = await req.supabase.rpc('cleanup_old_messages');
    if (error) throw error;
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Cleanup cron error:', err);
    res.status(500).json({ error: 'Cleanup failed', message: err.message });
  }
});

module.exports = router;
