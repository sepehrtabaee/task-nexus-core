require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const usersRouter = require('../routes/users');
const listsRouter = require('../routes/lists');
const tasksRouter = require('../routes/tasks');
const tagsRouter = require('../routes/tags');
const messagesRouter = require('../routes/messages');
const cronRouter = require('../routes/cron');

// Import MCP handler
const { mcpHandler } = require('./mcp');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Make supabase available to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// REST API Routes
app.use('/api/users', usersRouter);
app.use('/api/lists', listsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/cron', cronRouter);

// MCP endpoint — handles all MCP protocol traffic (POST only, stateless)
app.post('/mcp', mcpHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    endpoints: {
      api: {
        users: '/api/users',
        lists: '/api/lists',
        tasks: '/api/tasks',
        tags: '/api/tags',
      },
      mcp: '/mcp',
      health: '/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

module.exports = app;
