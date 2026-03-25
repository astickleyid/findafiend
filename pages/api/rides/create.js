import getKv from '../../../lib/kv';
import { v4 as uuid } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const kv = await getKv();
  const { driverId, riderName, pickup, destination, riderPhone } = req.body;

  if (!driverId || !pickup || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const raw = await kv.get(`driver:${driverId}`);
  if (!raw) return res.status(404).json({ error: 'Driver not found' });

  const driver = typeof raw === 'string' ? JSON.parse(raw) : raw;

  const rideId = uuid();
  const ride = {
    id: rideId,
    driverId,
    driverName: driver.name,
    driverCar: driver.car,
    driverPhone: driver.phone,
    driverCashapp: driver.cashapp,
    driverPrice: driver.price,
    riderName: riderName || 'Anonymous',
    riderPhone: riderPhone || '',
    pickup,
    destination,
    status: 'pending', // pending | accepted | en_route | completed | cancelled
    createdAt: Date.now(),
  };

  await kv.set(`ride:${rideId}`, JSON.stringify(ride));
  await kv.set(`driver:${driverId}:pendingRide`, rideId);

  res.status(200).json({ success: true, rideId, ride });
}
