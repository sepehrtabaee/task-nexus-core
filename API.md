# Task Manager API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:3000`

---

## API Endpoints

### Users (`/api/users`)

#### Get All Users
```
GET /api/users
```
Response: Array of user objects

#### Get User by ID
```
GET /api/users/:id
```
Response: Single user object

#### Create User
```
POST /api/users
Content-Type: application/json

{
  "telegram_id": 123456789,
  "username": "@john_doe",
  "first_name": "John",
  "last_name": "Doe"
}
```
Response: Created user object (Status: 201)

#### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "username": "@jane_doe",
  "first_name": "Jane",
  "last_name": "Doe"
}
```
Response: Updated user object

#### Delete User
```
DELETE /api/users/:id
```
Response: Confirmation message with deleted user data

---

### Lists (`/api/lists`)

#### Get All Lists
```
GET /api/lists
```
Response: Array of list objects

#### Get List by ID
```
GET /api/lists/:id
```
Response: Single list object

#### Get Lists by User ID
```
GET /api/lists/user/:user_id
```
Response: Array of lists for the specified user

#### Create List
```
POST /api/lists
Content-Type: application/json

{
  "user_id": "uuid-here",
  "name": "Work"
}
```
Response: Created list object (Status: 201)

#### Update List
```
PUT /api/lists/:id
Content-Type: application/json

{
  "name": "Personal"
}
```
Response: Updated list object

#### Delete List
```
DELETE /api/lists/:id
```
Response: Confirmation message with deleted list data

---

### Tasks (`/api/tasks`)

#### Get All Tasks
```
GET /api/tasks
```
Response: Array of task objects

#### Get Task by ID
```
GET /api/tasks/:id
```
Response: Single task object

#### Get Tasks by List ID
```
GET /api/tasks/list/:list_id
```
Response: Array of tasks in the specified list

#### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "list_id": "uuid-here",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_date": "2024-12-31T23:59:59Z",
  "priority": 1
}
```
Response: Created task object (Status: 201)

#### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "due_date": "2024-12-31T23:59:59Z",
  "priority": 2,
  "is_completed": true
}
```
Response: Updated task object

#### Delete Task
```
DELETE /api/tasks/:id
```
Response: Confirmation message with deleted task data

---

### Task Tags (`/api/tags`)

#### Get All Task-Tag Relationships
```
GET /api/tags
```
Response: Array of task-tag relationship objects

#### Get Tags for a Task
```
GET /api/tags/task/:task_id
```
Response: Array of tags associated with the task

#### Create Task-Tag Relationship
```
POST /api/tags
Content-Type: application/json

{
  "task_id": "uuid-here",
  "tag_id": "uuid-here"
}
```
Response: Created relationship object (Status: 201)

#### Delete Task-Tag Relationship
```
DELETE /api/tags/:task_id/:tag_id
```
Response: Confirmation message

---

## Health Check

```
GET /health
```
Response: `{ "status": "OK" }`

---

## Error Handling

All errors return a JSON response with an error message:
```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error
