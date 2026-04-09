const express = require('express');
const tagFunctions = require('../functions/tags');

const router = express.Router();

// Get all task-tag relationships
router.get('/', async (req, res) => {
  try {
    const data = await tagFunctions.getAll(req.supabase);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tags for a specific task
router.get('/task/:task_id', async (req, res) => {
  try {
    const data = await tagFunctions.getByTaskId(req.supabase, req.params.task_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task-tag relationship
router.post('/', async (req, res) => {
  try {
    const data = await tagFunctions.create(req.supabase, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task-tag relationship
router.delete('/:task_id/:tag_id', async (req, res) => {
  try {
    const data = await tagFunctions.delete(
      req.supabase,
      req.params.task_id,
      req.params.tag_id
    );
    res.json({ message: 'Tag relationship deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
