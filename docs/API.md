# REST API

This document covers all available REST endpoints. For MCP tool documentation see [MCP.md](MCP.md).

---

## Users `/api/users`

#### Get all users
```
GET /api/users
```

#### Get user by ID
```
GET /api/users/:id
```

#### Get user by Telegram ID
```
GET /api/users/telegram/:telegram_id
```

#### Create user
```
POST /api/users
```
```json
{
  "telegram_id": 123456789,
  "username": "@john_doe",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Update user
```
PUT /api/users/:id
```
```json
{
  "username": "@jane_doe",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

#### Delete user
```
DELETE /api/users/:id
```

---

## Lists `/api/lists`

#### Get all lists
```
GET /api/lists
```

#### Get list by ID
```
GET /api/lists/:id
```

#### Get lists by user ID
```
GET /api/lists/user/:user_id
```

#### Create list
```
POST /api/lists
```
```json
{
  "user_id": "uuid-here",
  "name": "Work"
}
```

#### Update list
```
PUT /api/lists/:id
```
```json
{
  "name": "Personal"
}
```

#### Delete list
```
DELETE /api/lists/:id
```

---

## Tasks `/api/tasks`

#### Get all tasks
```
GET /api/tasks
```

#### Get task by ID
```
GET /api/tasks/:id
```

#### Get tasks by list ID
```
GET /api/tasks/list/:list_id
```

Optional query params:
- `status=all|completed|pending` — filter by completion status (default: `all`)
- `concise=true` — return a trimmed-down response (excludes completed tasks older than today)

```
GET /api/tasks/list/:list_id?status=pending
GET /api/tasks/list/:list_id?status=completed
GET /api/tasks/list/:list_id?concise=true
```

#### Get tasks by user ID (across all lists)
```
GET /api/tasks/user/:user_id
```

Returns all tasks across every list owned by the user. Supports the same `status` filter:

```
GET /api/tasks/user/:user_id?status=pending
GET /api/tasks/user/:user_id?status=completed
GET /api/tasks/user/:user_id?status=all
```

#### Create task
```
POST /api/tasks
```
```json
{
  "list_id": "uuid-here",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_date": "2025-06-01T09:00:00Z",
  "priority": 1
}
```

#### Update task
```
PUT /api/tasks/:id
```
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "due_date": "2025-06-01T09:00:00Z",
  "priority": 2,
  "is_completed": true
}
```

#### Delete task
```
DELETE /api/tasks/:id
```

---

## Tags `/api/tags`

#### Get all tag relationships
```
GET /api/tags
```

#### Get tags for a task
```
GET /api/tags/task/:task_id
```

#### Create tag relationship
```
POST /api/tags
```
```json
{
  "task_id": "uuid-here",
  "tag_id": "uuid-here"
}
```

#### Delete tag relationship
```
DELETE /api/tags/:task_id/:tag_id
```

---

## Messages `/api/messages`

Used to store conversation history per user (e.g. for the Telegram bot agent).

#### Get last messages for a user
```
GET /api/messages/user/:user_id
```

Supports an optional `limit` query param (default: `10`):
```
GET /api/messages/user/:user_id?limit=20
```

#### Create message
```
POST /api/messages
```
```json
{
  "user_id": "uuid-here",
  "role": "user",
  "content": "Message text here"
}
```

---

## Cron `/api/cron`

Protected endpoints triggered by a scheduler. All requests must include the `Authorization` header:

```
Authorization: Bearer <CRON_SECRET>
```

#### Clean up old messages
Deletes old messages, keeping only the latest 10 per user. Calls the `cleanup_old_messages` Supabase RPC function.

```
POST /api/cron/cleanup-messages
```

---

## Health Check

```
GET /health
```

Response: `{ "status": "OK", "timestamp": "..." }`

---

## Errors

All errors return a JSON object with an `error` field:

```json
{ "error": "Something went wrong" }
```

| Status | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `401` | Unauthorized (cron endpoints) |
| `500` | Internal server error |
