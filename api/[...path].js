import { proxyBackend } from './backendProxy.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(204).end();
  }

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || '';
  return proxyBackend(req, res, path);
}
