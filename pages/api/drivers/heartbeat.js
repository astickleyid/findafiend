import getKv from '../../../lib/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const kv = await getKv();
  const { id, lat, lng, online } = req.body;

  if (!id) return res.status(400).json({ error: 'Driver id required' });

  const raw = await kv.get(`driver:${id}`);
  if (!raw) return res.status(404).json({ error: 'Driver not found' });

  const driver = typeof raw === 'string' ? JSON.parse(raw) : raw;
  driver.lastSeen = Date.now();
  if (lat) driver.lat = parseFloat(lat);
  if (lng) driver.lng = parseFloat(lng);
  if (online !== undefined) driver.online = online;

  await kv.set(`driver:${id}`, JSON.stringify(driver));

  // Check for pending ride requests for this driver
  const rideId = await kv.get(`driver:${id}:pendingRide`);

  res.status(200).json({ success: true, pendingRide: rideId || null });
}
