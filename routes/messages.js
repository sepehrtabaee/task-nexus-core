const express = require('express');
const messageFunctions = require('../functions/messages');

const router = express.Router();

// GET /api/messages/user/:user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const data = await messageFunctions.getLastMessages(req.supabase, req.params.user_id, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages
// Body: { user_id, role, content }
router.post('/', async (req, res) => {
  try {
    const { user_id, role, content } = req.body;
    const data = await messageFunctions.createMessage(req.supabase, user_id, role, content);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
