export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!backendUrl) {
    const payload = JSON.stringify({
      message: 'Backend service is not configured. Set BACKEND_URL in Vercel project settings.',
    });
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 503;
    return res.end(payload);
  }

  const headers = new Headers();
  for (const header of ['authorization', 'content-type', 'accept']) {
    if (req.headers[header]) headers.set(header, req.headers[header]);
  }

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  try {
    const response = await fetch(`${backendUrl}/api/auth/register/trader`, {
      method: req.method,
      headers,
      body,
    });
    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    return res.send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Trader registration proxy failed:', error);
    return res.status(502).json({ message: 'Backend service is unavailable.' });
  }
}
