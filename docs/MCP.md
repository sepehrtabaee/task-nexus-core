# MCP Tools

This document lists all tools exposed to AI agents over the MCP protocol, and explains how to add new ones.

---

## Available Tools

### Lists

#### `create_list`
Creates a new task list owned by a user.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_id` | string (UUID) | Yes | The owner of the list |
| `name` | string | Yes | List name, e.g. `"Work"`, `"Home"` |

#### `get_lists`
Returns all lists belonging to a user.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_id` | string (UUID) | Yes | The user to fetch lists for |

#### `update_list`
Renames an existing list.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `list_id` | string (UUID) | Yes | The list to rename |
| `name` | string | Yes | The new name |

#### `delete_list`
Deletes a list and all tasks inside it.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `list_id` | string (UUID) | Yes | The list to delete |

---

### Tasks

#### `create_task`
Adds a new task to a list.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `list_id` | string (UUID) | Yes | The list to add the task to |
| `title` | string | Yes | Task title |
| `description` | string | No | Additional detail |
| `due_date` | string (ISO 8601) | No | e.g. `"2025-06-01T09:00:00Z"` |
| `priority` | integer (1–5) | No | 1 = lowest, 5 = highest |

#### `get_tasks`
Returns all tasks in a list.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `list_id` | string (UUID) | Yes | The list to fetch tasks from |

#### `update_task`
Updates one or more fields on an existing task. All fields except `task_id` are optional — only include what you want to change.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_id` | string (UUID) | Yes | The task to update |
| `title` | string | No | New title |
| `description` | string | No | New description |
| `due_date` | string (ISO 8601) | No | New due date |
| `priority` | integer (1–5) | No | New priority |
| `is_completed` | boolean | No | Mark as done or not done |

#### `delete_task`
Permanently deletes a task.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_id` | string (UUID) | Yes | The task to delete |

---

## Extending with New Tools

To add a new tool, open [api/mcp.js](../api/mcp.js) and call `server.registerTool()` inside the `createServer()` function:

```javascript
server.registerTool(
  'my_tool_name',
  {
    title: 'Human-readable title',
    description: 'What this tool does — this is what the agent reads',
    inputSchema: {
      param_one: z.string().describe('What this parameter is for'),
      param_two: z.number().optional().describe('An optional number'),
    },
  },
  async ({ param_one, param_two }) => {
    const supabase = getSupabase();
    const data = await myFunctions.doSomething(supabase, { param_one, param_two });
    return { content: [{ type: 'text', text: JSON.stringify(data) }] };
  }
);
```

The tool becomes available to agents immediately — no other registration or config needed.
