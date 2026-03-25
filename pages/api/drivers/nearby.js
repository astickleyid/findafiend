import getKv from '../../../lib/kv';
import { haversine, etaMinutes } from '../../../lib/haversine';

export default async function handler(req, res) {
  const kv = await getKv();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng, radius = 100 } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (!lat || !lng || isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: 'lat and lng required' });
  }

  const ids = await kv.smembers('drivers:all');
  const drivers = [];

  for (const id of ids) {
    const raw = await kv.get(`driver:${id}`);
    if (!raw) continue;

    const driver = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // Mark offline if last seen > 5 min ago
    const age = Date.now() - (driver.lastSeen || 0);
    if (age > 5 * 60 * 1000) driver.online = false;

    const dist = haversine(userLat, userLng, driver.lat, driver.lng);
    if (dist > parseFloat(radius)) continue;

    drivers.push({
      id: driver.id,
      name: driver.name,
      car: driver.car,
      tags: driver.tags,
      price: driver.price,
      rating: driver.rating,
      trips: driver.trips,
      online: driver.online,
      distance: Math.round(dist * 10) / 10,
      eta: etaMinutes(dist),
    });
  }

  drivers.sort((a, b) => a.distance - b.distance);

  res.status(200).json({ drivers });
}
