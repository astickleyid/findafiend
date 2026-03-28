import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  const key = req.query.key;
  if (key !== process.env.SEED_KEY) return res.status(401).json({ error: "Unauthorized" });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const driverIds = await redis.smembers("drivers:all");
  const drivers = [];
  for (const id of driverIds) {
    const raw = await redis.get(`driver:${id}`);
    if (raw) {
      const d = typeof raw === "string" ? JSON.parse(raw) : raw;
      const age = Date.now() - (d.lastSeen || 0);
      d.online = age < 5 * 60 * 1000;
      drivers.push(d);
    }
  }

  drivers.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));

  res.status(200).json({
    total: drivers.length,
    online: drivers.filter(d => d.online).length,
    detroit: drivers.filter(d => d.lat > 42.0 && d.lat < 42.7).length,
    toledo: drivers.filter(d => d.lat > 41.4 && d.lat < 42.0).length,
    drivers,
  });
}