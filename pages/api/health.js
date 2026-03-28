import getKv from '../../lib/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const t0 = Date.now();
  const checks = {};

  // Redis / Upstash
  try {
    const kv = getKv();
    const ts = Date.now().toString();
    await kv.set('health:ping', ts);
    const val = await kv.get('health:ping');
    checks.redis = {
      status: val ? 'ok' : 'error',
      backend: process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'in-memory',
    };
  } catch (e) {
    checks.redis = { status: 'error', message: e.message };
  }

  // Driver data
  try {
    const kv = getKv();
    const driverIds = await kv.smembers('drivers:index');
    checks.data = { status: 'ok', drivers: driverIds.length };
  } catch (e) {
    checks.data = { status: 'error', message: e.message };
  }

  // Runtime
  checks.runtime = {
    status: 'ok',
    region: process.env.VERCEL_REGION || 'unknown',
    node: process.version,
  };

  const allOk = Object.values(checks).every(c => c.status === 'ok');
  res.status(200).json({
    status: allOk ? 'ok' : 'degraded',
    latencyMs: Date.now() - t0,
    timestamp: Date.now(),
    checks,
  });
}
