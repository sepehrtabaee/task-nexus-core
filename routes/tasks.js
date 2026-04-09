const express = require('express');
const taskFunctions = require('../functions/tasks');

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const data = await taskFunctions.getAll(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await taskFunctions.getById(req.supabase, req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks by list ID
router.get('/list/:list_id', async (req, res) => {
  try {
    const data = await taskFunctions.getByListId(req.supabase, req.params.list_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const data = await taskFunctions.create(req.supabase, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const data = await taskFunctions.update(req.supabase, req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const data = await taskFunctions.delete(req.supabase, req.params.id);
    res.json({ message: 'Task deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
