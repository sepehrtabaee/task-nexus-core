# Deployment Guide — Vercel

This guide explains how to deploy both the REST API and MCP server to Vercel.

## Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- Supabase account and database set up
- Git repository pushed to GitHub

## Quick Start

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or use the Vercel Dashboard:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Click "Deploy"

### 2. Set Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Click "Save"

### 3. Redeploy

Click "Redeploy" to apply environment variables.

## Architecture

Both the REST API and MCP server run as **Vercel Serverless Functions**:

```
vercel.com/your-project
  ├── /api/*              → REST API endpoints
  ├── /mcp/tools          → MCP tools discovery
  ├── /mcp/execute        → MCP tool execution
  └── /health             → Health check
```

## Endpoints

After deployment, your API will be at: `https://your-project.vercel.app`

### REST API
- `GET https://your-project.vercel.app/api/users`
- `POST https://your-project.vercel.app/api/users`
- `GET https://your-project.vercel.app/api/lists`
- `POST https://your-project.vercel.app/api/tasks`
- etc.

### MCP Server
- `GET https://your-project.vercel.app/mcp/tools` - List available tools
- `POST https://your-project.vercel.app/mcp/execute` - Execute a tool

### Health Check
- `GET https://your-project.vercel.app/health`

## Usage Examples

### Create a User via REST API
```bash
curl -X POST https://your-project.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Execute Tool via MCP
```bash
curl -X POST https://your-project.vercel.app/mcp/execute \
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

## Local Development

For local development, both work the same:

```bash
# Install dependencies
npm install

# Start server (port 3000)
npm start

# Access endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/mcp/tools
```

## How It Works on Vercel

Instead of running a persistent server, Vercel:

1. **Converts Express routes to Serverless Functions**
   - Each API call triggers a function execution
   - Function responds and terminates
   - Cold starts are minimal (~100ms)

2. **Both REST API and MCP share the same codebase**
   - `api/index.js` - Main Express app
   - `api/mcp.js` - MCP handler
   - `functions/` - Shared database logic

3. **No changes needed**
   - Same code works locally and on Vercel
   - Environment variables configured in Vercel Dashboard

## Performance

**Cold Start:** ~100-300ms (Vercel optimizes this)  
**Response Time:** <100ms typical  
**Scaling:** Automatic (Vercel handles scaling)

## Limitations on Vercel

✅ **Supports:**
- REST API endpoints (stateless requests)
- MCP tool discovery and execution
- Long-running database queries (up to 60 seconds default)
- File operations

❌ **Does NOT support:**
- WebSockets (use REST polling instead)
- Persistent state between requests
- Listening on a specific port

## Troubleshooting

### 500 Error on Deploy
Check environment variables in Vercel Dashboard. Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set.

### "Cannot find module" Error
```bash
# Reinstall dependencies locally
rm -rf node_modules package-lock.json
npm install

# Push changes to GitHub
git add .
git commit -m "Fix dependencies"
git push
```

### MCP Returns 404
Verify the endpoint is `POST /mcp/execute` with proper body:
```json
{
  "tool": "tool_name",
  "input": { "param": "value" }
}
```

## Monitoring

View logs in Vercel Dashboard:
1. Go to your project → Deployments
2. Click on a deployment
3. View "Function Logs"

Or use Vercel CLI:
```bash
vercel logs your-project.vercel.app
```

## Custom Domain

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records (instructions provided by Vercel)

## CI/CD

Vercel automatically deploys when you push to GitHub:
- Push to `main` → Production deployment
- Other branches → Preview deployments

## Rollback

In Vercel Dashboard:
1. Go to Deployments
2. Click the deployment you want
3. Click "Promote to Production"

## Cost

- **Free Tier:** 
  - 100 serverless function invocations per day
  - Suitable for development/testing

- **Pro Tier ($20/month):**
  - Unlimited serverless function invocations
  - Better for production

See [vercel.com/pricing](https://vercel.com/pricing) for details.

## Summary

| Aspect | Local | Vercel |
|--------|-------|--------|
| Server | `npm start` | Automatic |
| Port | 3000 | Managed |
| REST API | ✅ Works | ✅ Works |
| MCP Tools | ✅ Works | ✅ Works |
| Environment Variables | `.env` file | Dashboard |
| Scaling | Manual | Automatic |
| Logs | Console | Dashboard |

Your task manager is now production-ready on Vercel! 🚀
