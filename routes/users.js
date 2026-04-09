const express = require('express');
const userFunctions = require('../functions/users');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const data = await userFunctions.getAll(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by Telegram ID
router.get('/telegram/:telegram_id', async (req, res) => {
  try {
    const data = await userFunctions.getByTelegramId(req.supabase, req.params.telegram_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await userFunctions.getById(req.supabase, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const data = await userFunctions.create(req.supabase, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const data = await userFunctions.update(req.supabase, req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const data = await userFunctions.delete(req.supabase, req.params.id);
    res.json({ message: 'User deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
