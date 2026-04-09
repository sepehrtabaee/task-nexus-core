const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const {
  StreamableHTTPServerTransport,
} = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');
const { createClient } = require('@supabase/supabase-js');
const userFunctions = require('../functions/users');
const listFunctions = require('../functions/lists');
const taskFunctions = require('../functions/tasks');

// Creates and configures a fresh MCP server instance with all tools registered
function createServer() {
  const server = new McpServer({
    name: 'task-manager',
    version: '1.0.0',
  });

  // ── Users ─────────────────────────────────────────────────────────────────

  server.registerTool(
    'create_user',
    {
      title: 'Create User',
      description: 'Create a new user in the task manager',
      inputSchema: {
        telegram_id: z.number().describe('Unique Telegram ID for the user'),
        username: z.string().optional().describe('Telegram @username'),
        first_name: z.string().optional().describe('User first name'),
        last_name: z.string().optional().describe('User last name'),
      },
    },
    async (input) => {
      const supabase = getSupabase();
      const data = await userFunctions.create(supabase, input);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'get_user',
    {
      title: 'Get User',
      description: 'Get a user by ID',
      inputSchema: {
        user_id: z.string().describe('UUID of the user'),
      },
    },
    async ({ user_id }) => {
      const supabase = getSupabase();
      const data = await userFunctions.getById(supabase, user_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'update_user',
    {
      title: 'Update User',
      description: 'Update user information',
      inputSchema: {
        user_id: z.string().describe('UUID of the user'),
        username: z.string().optional().describe('New username'),
        first_name: z.string().optional().describe('New first name'),
        last_name: z.string().optional().describe('New last name'),
      },
    },
    async ({ user_id, ...fields }) => {
      const supabase = getSupabase();
      const data = await userFunctions.update(supabase, user_id, fields);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'delete_user',
    {
      title: 'Delete User',
      description: 'Delete a user',
      inputSchema: {
        user_id: z.string().describe('UUID of the user to delete'),
      },
    },
    async ({ user_id }) => {
      const supabase = getSupabase();
      const data = await userFunctions.delete(supabase, user_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // ── Lists ─────────────────────────────────────────────────────────────────

  server.registerTool(
    'create_list',
    {
      title: 'Create List',
      description: 'Create a new task list for a user',
      inputSchema: {
        user_id: z.string().describe('UUID of the owner'),
        name: z.string().describe('List name (e.g. "Work", "Home")'),
      },
    },
    async (input) => {
      const supabase = getSupabase();
      const data = await listFunctions.create(supabase, input);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'get_lists',
    {
      title: 'Get Lists',
      description: 'Get all lists for a user',
      inputSchema: {
        user_id: z.string().describe('UUID of the user'),
      },
    },
    async ({ user_id }) => {
      const supabase = getSupabase();
      const data = await listFunctions.getByUserId(supabase, user_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'update_list',
    {
      title: 'Update List',
      description: 'Update a list name',
      inputSchema: {
        list_id: z.string().describe('UUID of the list'),
        name: z.string().describe('New list name'),
      },
    },
    async ({ list_id, name }) => {
      const supabase = getSupabase();
      const data = await listFunctions.update(supabase, list_id, { name });
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'delete_list',
    {
      title: 'Delete List',
      description: 'Delete a list and all its tasks',
      inputSchema: {
        list_id: z.string().describe('UUID of the list to delete'),
      },
    },
    async ({ list_id }) => {
      const supabase = getSupabase();
      const data = await listFunctions.delete(supabase, list_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  // ── Tasks ─────────────────────────────────────────────────────────────────

  server.registerTool(
    'create_task',
    {
      title: 'Create Task',
      description: 'Create a new task in a list',
      inputSchema: {
        list_id: z.string().describe('UUID of the list'),
        title: z.string().describe('Task title'),
        description: z.string().optional().describe('Task description'),
        due_date: z.string().optional().describe('Due date in ISO format'),
        priority: z.number().int().min(1).max(5).optional().describe('Priority 1-5'),
      },
    },
    async (input) => {
      const supabase = getSupabase();
      const data = await taskFunctions.create(supabase, input);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'get_tasks',
    {
      title: 'Get Tasks',
      description: 'Get all tasks in a list',
      inputSchema: {
        list_id: z.string().describe('UUID of the list'),
      },
    },
    async ({ list_id }) => {
      const supabase = getSupabase();
      const data = await taskFunctions.getByListId(supabase, list_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'update_task',
    {
      title: 'Update Task',
      description: 'Update a task (title, description, due date, priority, or completion)',
      inputSchema: {
        task_id: z.string().describe('UUID of the task'),
        title: z.string().optional().describe('New title'),
        description: z.string().optional().describe('New description'),
        due_date: z.string().optional().describe('New due date'),
        priority: z.number().int().min(1).max(5).optional().describe('New priority'),
        is_completed: z.boolean().optional().describe('Mark as completed'),
      },
    },
    async ({ task_id, ...fields }) => {
      const supabase = getSupabase();
      const data = await taskFunctions.update(supabase, task_id, fields);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  server.registerTool(
    'delete_task',
    {
      title: 'Delete Task',
      description: 'Delete a task',
      inputSchema: {
        task_id: z.string().describe('UUID of the task to delete'),
      },
    },
    async ({ task_id }) => {
      const supabase = getSupabase();
      const data = await taskFunctions.delete(supabase, task_id);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  return server;
}

// Create Supabase client on every request (serverless-safe)
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

// Express middleware — handles POST /mcp
// Uses StreamableHTTPServerTransport in stateless mode (no session state),
// which is required for Vercel serverless functions.
async function mcpHandler(req, res) {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — required for Vercel
  });

  res.on('close', () => {
    transport.close();
  });

  const server = createServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}

module.exports = { mcpHandler };

