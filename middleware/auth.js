// Authorization middleware
// Each surface (REST API and MCP) uses its own token so they can be rotated independently.
// Tokens are read from env vars: API_TOKEN and MCP_TOKEN.
// Requests must include the header:  Authorization: Bearer <token>

function requireToken(envVar, label) {
  return (req, res, next) => {
    const expected = process.env[envVar];

    if (!expected) {
      console.error(`[auth] ${envVar} is not set — rejecting all requests to ${label}`);
      return res.status(500).json({ error: 'Server misconfiguration: auth token not set' });
    }

    const authHeader = req.headers['authorization'] || '';
    const [scheme, provided] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !provided || provided !== expected) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  };
}

const apiAuth = requireToken('API_TOKEN', 'REST API');
const mcpAuth = requireToken('MCP_TOKEN', 'MCP');

module.exports = { apiAuth, mcpAuth };
