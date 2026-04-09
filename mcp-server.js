require('dotenv').config();
const express = require('express');
const userFunctions = require('./functions/users');
const listFunctions = require('./functions/lists');
const taskFunctions = require('./functions/tasks');
const tagFunctions = require('./functions/tags');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Tool definitions for MCP
const tools = [
  // User tools
  {
    name: 'create_user',
    description: 'Create a new user in the task manager',
    inputSchema: {
      type: 'object',
      properties: {
        telegram_id: {
          type: 'number',
          description: 'Unique Telegram ID for the user',
        },
        username: {
          type: 'string',
          description: 'Telegram username',
        },
        first_name: {
          type: 'string',
          description: 'User first name',
        },
        last_name: {
          type: 'string',
          description: 'User last name',
        },
      },
      required: ['telegram_id'],
    },
  },
  {
    name: 'get_user',
    description: 'Get a user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'UUID of the user',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'get_user_by_telegram_id',
    description: 'Look up a user by their Telegram ID and return their user_id (UUID)',
    inputSchema: {
      type: 'object',
      properties: {
        telegram_id: {
          type: 'number',
          description: 'Telegram user ID',
        },
      },
      required: ['telegram_id'],
    },
  },
  {
    name: 'update_user',
    description: 'Update user information',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'UUID of the user',
        },
        username: {
          type: 'string',
          description: 'New username',
        },
        first_name: {
          type: 'string',
          description: 'New first name',
        },
        last_name: {
          type: 'string',
          description: 'New last name',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'delete_user',
    description: 'Delete a user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'UUID of the user to delete',
        },
      },
      required: ['user_id'],
    },
  },

  // List tools
  {
    name: 'create_list',
    description: 'Create a new task list for a user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'UUID of the user who owns the list',
        },
        name: {
          type: 'string',
          description: 'Name of the list (e.g., "Work", "Home", "Personal")',
        },
      },
      required: ['user_id', 'name'],
    },
  },
  {
    name: 'get_lists',
    description: 'Get all lists for a user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          description: 'UUID of the user',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'update_list',
    description: 'Update a list name',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'UUID of the list',
        },
        name: {
          type: 'string',
          description: 'New list name',
        },
      },
      required: ['list_id', 'name'],
    },
  },
  {
    name: 'delete_list',
    description: 'Delete a list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'UUID of the list to delete',
        },
      },
      required: ['list_id'],
    },
  },

  // Task tools
  {
    name: 'create_task',
    description: 'Create a new task in a list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'UUID of the list',
        },
        title: {
          type: 'string',
          description: 'Task title',
        },
        description: {
          type: 'string',
          description: 'Task description',
        },
        due_date: {
          type: 'string',
          description: 'Due date in ISO format',
        },
        priority: {
          type: 'number',
          description: 'Priority level (1-5)',
        },
      },
      required: ['list_id', 'title'],
    },
  },
  {
    name: 'get_tasks',
    description: 'Get all tasks in a list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'UUID of the list',
        },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'update_task',
    description: 'Update a task',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'UUID of the task',
        },
        title: {
          type: 'string',
          description: 'New task title',
        },
        description: {
          type: 'string',
          description: 'New task description',
        },
        due_date: {
          type: 'string',
          description: 'New due date',
        },
        priority: {
          type: 'number',
          description: 'New priority level',
        },
        is_completed: {
          type: 'boolean',
          description: 'Whether the task is completed',
        },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'UUID of the task to delete',
        },
      },
      required: ['task_id'],
    },
  },
];

// Tool execution function
async function executeTool(toolName, toolInput) {
  try {
    switch (toolName) {
      // User operations
      case 'create_user':
        return {
          success: true,
          data: await userFunctions.create(supabase, toolInput),
        };

      case 'get_user':
        return {
          success: true,
          data: await userFunctions.getById(supabase, toolInput.user_id),
        };

      case 'get_user_by_telegram_id':
        return {
          success: true,
          data: await userFunctions.getByTelegramId(supabase, toolInput.telegram_id),
        };

      case 'update_user':
        return {
          success: true,
          data: await userFunctions.update(supabase, toolInput.user_id, toolInput),
        };

      case 'delete_user':
        return {
          success: true,
          data: await userFunctions.delete(supabase, toolInput.user_id),
        };

      // List operations
      case 'create_list':
        return {
          success: true,
          data: await listFunctions.create(supabase, toolInput),
        };

      case 'get_lists':
        return {
          success: true,
          data: await listFunctions.getByUserId(supabase, toolInput.user_id),
        };

      case 'update_list':
        return {
          success: true,
          data: await listFunctions.update(supabase, toolInput.list_id, toolInput),
        };

      case 'delete_list':
        return {
          success: true,
          data: await listFunctions.delete(supabase, toolInput.list_id),
        };

      // Task operations
      case 'create_task':
        return {
          success: true,
          data: await taskFunctions.create(supabase, toolInput),
        };

      case 'get_tasks':
        return {
          success: true,
          data: await taskFunctions.getByListId(supabase, toolInput.list_id),
        };

      case 'update_task':
        return {
          success: true,
          data: await taskFunctions.update(supabase, toolInput.task_id, toolInput),
        };

      case 'delete_task':
        return {
          success: true,
          data: await taskFunctions.delete(supabase, toolInput.task_id),
        };

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Create Express app for MCP server
const app = express();
app.use(express.json());

const MCP_PORT = process.env.MCP_PORT || 3001;

// MCP Endpoint: List available tools
app.get('/mcp/tools', (req, res) => {
  res.json({
    tools: tools,
  });
});

// MCP Endpoint: Execute a tool
app.post('/mcp/execute', async (req, res) => {
  try {
    const { tool, input } = req.body;

    if (!tool || !input) {
      return res.status(400).json({
        error: 'Missing required fields: tool, input',
      });
    }

    // Verify tool exists
    if (!tools.find((t) => t.name === tool)) {
      return res.status(404).json({
        error: `Tool not found: ${tool}`,
      });
    }

    // Execute the tool
    const result = await executeTool(tool, input);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'MCP Server OK' });
});

// Start MCP server
app.listen(MCP_PORT, () => {
  console.log(`🔧 MCP Server running on port ${MCP_PORT}`);
  console.log(`📋 Tools available at http://localhost:${MCP_PORT}/mcp/tools`);
  console.log(`⚙️  Execute tools at http://localhost:${MCP_PORT}/mcp/execute`);
  console.log('\nAvailable tools:');
  tools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
});
