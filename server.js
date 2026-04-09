require('dotenv').config();
const app = require('./api/index');

const PORT = process.env.PORT || 3000;

// Only start server if running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 REST API: http://localhost:${PORT}/api/*`);
    console.log(`🔧 MCP Server: http://localhost:${PORT}/mcp/*`);
  });
}

module.exports = app;
