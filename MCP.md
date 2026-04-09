# MCP Server — Task Manager Integration

## Overview

The MCP (Model Context Protocol) server exposes your task manager database operations as tools that MCP clients (like Claude) can discover and use. It provides a standardized interface for AI applications to manage users, lists, and tasks.

## Quick Start

### Installation

```bash
npm install
```

### Running the MCP Server

```bash
npm run mcp
```

The server starts on port 3001 and exposes two endpoints:
- `GET /mcp/tools` - List all available tools
- `POST /mcp/execute` - Execute a tool

Example curl request:
```bash
curl -X POST http://localhost:3001/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_user",
    "input": {
      "telegram_id": 123456789,
      "first_name": "John",
      "last_name": "Doe"
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "telegram_id": 123456789,
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Available Tools

### User Management

#### create_user
Create a new user in the system.

**Parameters:**
- `telegram_id` (required): Unique Telegram ID (number)
- `username` (optional): Telegram username
- `first_name` (optional): User's first name
- `last_name` (optional): User's last name

**Example:**
```
Create a user with telegram_id 987654321, username @alice_smith, first_name Alice, last_name Smith
```

#### get_user
Retrieve a user by ID.

**Parameters:**
- `user_id` (required): UUID of the user

#### update_user
Update user information.

**Parameters:**
- `user_id` (required): UUID of the user
- `username` (optional): New username
- `first_name` (optional): New first name
- `last_name` (optional): New last name

#### delete_user
Delete a user from the system.

**Parameters:**
- `user_id` (required): UUID of the user to delete

---

### List Management

#### create_list
Create a new task list for a user.

**Parameters:**
- `user_id` (required): UUID of the owner
- `name` (required): Name of the list (e.g., "Work", "Home", "Personal")

**Example:**
```
Create a list named "Work" for user [user_id]
```

#### get_lists
Retrieve all lists for a specific user.

**Parameters:**
- `user_id` (required): UUID of the user

#### update_list
Update a list's name.

**Parameters:**
- `list_id` (required): UUID of the list
- `name` (required): New list name

#### delete_list
Delete a list.

**Parameters:**
- `list_id` (required): UUID of the list to delete

---

### Task Management

#### create_task
Create a new task in a list.

**Parameters:**
- `list_id` (required): UUID of the list
- `title` (required): Task title
- `description` (optional): Task description
- `due_date` (optional): Due date in ISO format (e.g., "2024-12-31T23:59:59Z")
- `priority` (optional): Priority level 1-5

**Example:**
```
Create a task titled "Buy groceries" in list [list_id] with priority 2 and due date 2024-12-25
```

#### get_tasks
Retrieve all tasks in a list.

**Parameters:**
- `list_id` (required): UUID of the list

#### update_task
Update a task's details.

**Parameters:**
- `task_id` (required): UUID of the task
- `title` (optional): New title
- `description` (optional): New description
- `due_date` (optional): New due date
- `priority` (optional): New priority level
- `is_completed` (optional): Mark as completed (true/false)

**Example:**
```
Mark task [task_id] as completed
```

#### delete_task
Delete a task.

**Parameters:**
- `task_id` (required): UUID of the task to delete

---

## Integration with MCP Clients

The MCP server provides tool definitions and execution endpoints. An MCP client (like Claude) can:

1. Discover available tools via `GET /mcp/tools`
2. Make requests to execute tools via `POST /mcp/execute`
3. The client interprets natural language and decides which tools to call
4. The server executes the database operations
5. Results are returned to the client

**Architecture:**
```
Claude (MCP Client)
    ↓ (discovers tools)
MCP Server (your project)
    ↓ (lists available tools)
Claude
    ↓ (decides which tool to use)
MCP Server
    ↓ (executes tool)
Supabase (stores data)
    ↓
Claude (formats response)
```

## Example Workflows

### Via cURL

Create a user:
```bash
curl -X POST http://localhost:3001/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "create_user", "input": {"telegram_id": 111222333, "first_name": "Jane", "last_name": "Smith"}}'
```

Get all lists for a user:
```bash
curl -X POST http://localhost:3001/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_lists", "input": {"user_id": "user-uuid-here"}}'
```

### Via MCP Client (Claude)

An MCP client would:
1. Query `GET /mcp/tools` to see available tools
2. Parse the tool schemas
3. Make requests like `POST /mcp/execute` with tool name and input
4. Interpret results and respond naturally

## Configuration

The MCP server requires:
- `SUPABASE_URL`: Your Supabase database URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `MCP_PORT`: Port to run the MCP server on (default: 3001)

These should be in your `.env` file.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│         MCP Client (Claude, etc.)                     │
│  1. Queries /mcp/tools to discover available tools   │
│  2. Calls POST /mcp/execute with tool name + input   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│           MCP Server (your project)                   │
│  - Exposes /mcp/tools endpoint                       │
│  - Exposes /mcp/execute endpoint                     │
│  - Maps tools to database functions                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│         Shared Functions (functions/)                 │
│  - users.js, lists.js, tasks.js, tags.js            │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│            Supabase (stores data)                     │
└──────────────────────────────────────────────────────┘
```

## Development

To extend the MCP server with additional tools:

**1. Create a function** in `functions/` (if not already exists)
```javascript
// functions/myfeature.js
module.exports = {
  async myOperation(supabase, { param1, param2 }) {
    // Implement your logic
  }
};
```

**2. Add the tool definition** in `mcp-server.js`:
```javascript
{
  name: 'my_operation',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Description' }
    },
    required: ['param1']
  }
}
```

**3. Add execution case** in the `executeTool()` function:
```javascript
case 'my_operation':
  return {
    success: true,
    data: await myFeatureFunctions.myOperation(supabase, toolInput),
  };
```

**4. The tool is now available** to MCP clients immediately

## Error Handling

The MCP server returns structured error responses:

**Tool not found:**
```json
{
  "error": "Tool not found: unknown_tool"
}
```
HTTP Status: 404

**Missing fields:**
```json
{
  "error": "Missing required fields: tool, input"
}
```
HTTP Status: 400

**Execution error:**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```
HTTP Status: 200 (error is in response body)

## Testing with cURL

Get available tools:
```bash
curl http://localhost:3001/mcp/tools
```

Execute a tool:
```bash
curl -X POST http://localhost:3001/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_user",
    "input": {
      "telegram_id": 987654321,
      "first_name": "Jane",
      "last_name": "Smith"
    }
  }'
```

## Notes

- The MCP server is **stateless** - no authentication required (secure your network)
- All database authentication is via Supabase credentials in `.env`
- Uses the same shared `functions/` as the REST API
- No external API calls are made by the server itself
- Port 3001 is configurable via `MCP_PORT` environment variable
- Both REST API and MCP server can run simultaneously on different ports
