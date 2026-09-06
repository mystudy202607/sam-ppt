// Neural Pulse 同源代理（Vercel Serverless Function）
// 作用：把浏览器的请求转发到官方 /api/neural，并补上 CORS 响应头，
// 从而绕开官方接口缺少 Access-Control-Allow-Origin 的问题。
// 密钥二选一：
//   1) 客户端请求时带 Authorization: Bearer <key>（默认，直接透传）；
//   2) 在本函数环境变量中配置 EVOROZEN_API_KEY，客户端可不传密钥。
const TARGET = 'https://pulse.evorozen.com/api/neural';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

module.exports = async function handler(req, res) {
  // 浏览器预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS).end();
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405, Object.assign({}, CORS, { 'Content-Type': 'application/json' }));
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const headers = { 'Content-Type': 'application/json' };
  const auth = req.headers['authorization'] ||
    (process.env.EVOROZEN_API_KEY ? 'Bearer ' + process.env.EVOROZEN_API_KEY : '');
  if (auth) headers['Authorization'] = auth;

  let payload = '{}';
  try { payload = JSON.stringify(req.body || {}); } catch (e) { /* ignore */ }

  try {
    const upstream = await fetch(TARGET, {
      method: 'POST',
      headers: headers,
      body: payload
    });
    const text = await upstream.text();
    res.writeHead(upstream.status, Object.assign({}, CORS, { 'Content-Type': 'application/json' }));
    res.end(text);
  } catch (e) {
    res.writeHead(502, Object.assign({}, CORS, { 'Content-Type': 'application/json' }));
    res.end(JSON.stringify({ error: 'Proxy upstream error: ' + e.message }));
  }
};
