# Task Manager — REST API + MCP Server

A full-stack task management system with both REST API and MCP server, deployable to Vercel.

## 🚀 Quick Start

### Local Development

```bash
npm install
cp .env.example .env
# Add SUPABASE_URL and SUPABASE_ANON_KEY to .env

npm start
```

Visit: http://localhost:3000

### Endpoints

- **REST API:** `GET/POST/PUT/DELETE /api/users`, `/api/lists`, `/api/tasks`
- **MCP Server:** `GET /mcp/tools`, `POST /mcp/execute`
- **Health:** `GET /health`

## 📚 Documentation

- [API.md](API.md) — REST API reference
- [MCP.md](MCP.md) — MCP server reference
- [DEPLOYMENT.md](DEPLOYMENT.md) — Vercel deployment guide
- [readme.md](readme.md) — Database schema

## 🏗️ Architecture

```
Both REST API and MCP Server
    ↓
Shared Functions (DRY principle)
    ↓
Supabase Database
```

Both interfaces use the same `functions/` directory for database operations.

## 🎯 Key Features

✅ REST API for traditional HTTP requests  
✅ MCP Server for AI/LLM integration  
✅ Shared database logic (no duplication)  
✅ Vercel serverless ready  
✅ Same code runs locally and on Vercel  

## 🚢 Deploy to Vercel

```bash
vercel
```

Then add environment variables in Vercel Dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 📂 Project Structure

```
api/
  ├── index.js     # Express app
  └── mcp.js       # MCP handler
functions/         # Shared logic
  ├── users.js
  ├── lists.js
  ├── tasks.js
  └── tags.js
routes/           # REST API routes
```

## 💡 How It Works

### Locally
- `npm start` starts Express server on port 3000
- Both REST API and MCP endpoints available
- No port conflicts

### On Vercel
- Both converted to serverless functions
- Single deployment handles everything
- Automatic scaling

## 🔧 Development

Add new endpoints:
1. Create function in `functions/`
2. Create route in `routes/` (for REST) or add case in `api/mcp.js` (for MCP)
3. Both automatically use shared logic

## ✅ Testing

```bash
# REST API
curl http://localhost:3000/api/users

# MCP
curl http://localhost:3000/mcp/tools

# Create via MCP
curl -X POST http://localhost:3000/mcp/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"create_user","input":{"telegram_id":123}}'
```

## 🎯 Next Steps

1. Configure Supabase credentials in `.env`
2. Run locally: `npm start`
3. Deploy: `vercel`
4. Add env vars in Vercel Dashboard

Ready to go! 🚀
