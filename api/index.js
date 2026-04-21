require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import routes
const usersRouter = require('../routes/users');
const listsRouter = require('../routes/lists');
const tasksRouter = require('../routes/tasks');
const tagsRouter = require('../routes/tags');
const messagesRouter = require('../routes/messages');
const cronRouter = require('../routes/cron');

// Import MCP handler
const { mcpHandler } = require('./mcp');

// Import auth middleware
const { apiAuth, mcpAuth } = require('../middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// REST API Routes — protected by Supabase JWT
app.use('/api/users', apiAuth, usersRouter);
app.use('/api/lists', apiAuth, listsRouter);
app.use('/api/tasks', apiAuth, tasksRouter);
app.use('/api/tags', apiAuth, tagsRouter);
app.use('/api/messages', apiAuth, messagesRouter);
app.use('/api/cron', apiAuth, cronRouter);

// MCP endpoint — protected by MCP_TOKEN
app.post('/mcp', mcpAuth, mcpHandler);

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
