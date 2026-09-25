export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!backendUrl) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 503;
    return res.end(JSON.stringify({
      message: 'Backend service is not configured. Set BACKEND_URL in Vercel project settings.',
    }));
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query || {})) {
    if (key !== 'path' && value != null) {
      for (const item of Array.isArray(value) ? value : [value]) query.append(key, item);
    }
  }

  const target = `${backendUrl}/api/containers/search${query.toString() ? `?${query}` : ''}`;
  const headers = new Headers();
  for (const header of ['authorization', 'accept']) {
    if (req.headers[header]) headers.set(header, req.headers[header]);
  }

  try {
    const response = await fetch(target, { method: 'GET', headers });
    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    return res.send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Container search proxy failed:', error);
    return res.status(502).json({ message: 'Backend service is unavailable.' });
  }
}
