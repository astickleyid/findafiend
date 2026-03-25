import getKv from '../../../lib/kv';

export default async function handler(req, res) {
  const kv = await getKv();
  const { id } = req.query;

  if (req.method === 'GET') {
    const raw = await kv.get(`ride:${id}`);
    if (!raw) return res.status(404).json({ error: 'Ride not found' });
    const ride = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return res.status(200).json({ ride });
  }

  if (req.method === 'PATCH') {
    const raw = await kv.get(`ride:${id}`);
    if (!raw) return res.status(404).json({ error: 'Ride not found' });
    const ride = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const { status } = req.body;
    ride.status = status;
    ride.updatedAt = Date.now();
    if (status === 'accepted') ride.acceptedAt = Date.now();
    if (status === 'completed' || status === 'cancelled') {
      await kv.del(`driver:${ride.driverId}:pendingRide`);
      if (status === 'completed') {
        const dr = await kv.get(`driver:${ride.driverId}`);
        if (dr) {
          const d = typeof dr === 'string' ? JSON.parse(dr) : dr;
          d.trips = (d.trips || 0) + 1;
          await kv.set(`driver:${ride.driverId}`, JSON.stringify(d));
        }
      }
    }
    await kv.set(`ride:${id}`, JSON.stringify(ride));
    return res.status(200).json({ success: true, ride });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
