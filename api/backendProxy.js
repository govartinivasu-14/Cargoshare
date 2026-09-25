export async function proxyBackend(req, res, path) {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!backendUrl) {
    const payload = JSON.stringify({
      message: 'Backend service is not configured. Set BACKEND_URL in Vercel project settings.',
    });
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 503;
    return res.end(payload);
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query || {})) {
    if (key !== 'path' && value != null) {
      for (const item of Array.isArray(value) ? value : [value]) query.append(key, item);
    }
  }

  const target = `${backendUrl}/api/${path}${query.toString() ? `?${query}` : ''}`;
  const headers = new Headers();
  for (const header of ['authorization', 'content-type', 'accept']) {
    if (req.headers[header]) headers.set(header, req.headers[header]);
  }

  const body = ['GET', 'HEAD'].includes(req.method)
    ? undefined
    : typeof req.body === 'string'
      ? req.body
      : req.body == null
        ? undefined
        : JSON.stringify(req.body);

  try {
    const response = await fetch(target, { method: req.method, headers, body });
    const responseBody = await response.arrayBuffer();
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    return res.send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Backend proxy request failed:', error);
    return res.status(502).json({ message: 'Backend service is unavailable.' });
  }
}
