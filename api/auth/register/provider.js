export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!backendUrl) return res.status(503).send(JSON.stringify({ message: 'Backend service is not configured. Set BACKEND_URL in Vercel project settings.' }));
  const headers = new Headers({ 'content-type': req.headers['content-type'] || 'application/json' });
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  try {
    const response = await fetch(`${backendUrl}/api/auth/register/provider`, { method: req.method, headers, body });
    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    if (response.headers.get('content-type')) res.setHeader('Content-Type', response.headers.get('content-type'));
    return res.send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Provider registration proxy failed:', error);
    return res.status(502).json({ message: 'Backend service is unavailable.' });
  }
}
