const { createClient } = require('@supabase/supabase-js');

async function apiAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  req.supabase = supabase;
  next();
}

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

const mcpAuth = requireToken('MCP_TOKEN', 'MCP');

module.exports = { apiAuth, mcpAuth };
