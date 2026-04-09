const express = require('express');
const listFunctions = require('../functions/lists');

const router = express.Router();

// Get all lists
router.get('/', async (req, res) => {
  try {
    const data = await listFunctions.getAll(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get list by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await listFunctions.getById(req.supabase, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get lists by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const data = await listFunctions.getByUserId(req.supabase, req.params.user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create list
router.post('/', async (req, res) => {
  try {
    const data = await listFunctions.create(req.supabase, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update list
router.put('/:id', async (req, res) => {
  try {
    const data = await listFunctions.update(req.supabase, req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete list
router.delete('/:id', async (req, res) => {
  try {
    const data = await listFunctions.delete(req.supabase, req.params.id);
    res.json({ message: 'List deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
