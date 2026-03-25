import getKv from '../../../lib/kv';
import { v4 as uuid } from 'uuid';

export default async function handler(req, res) {
  const kv = await getKv();

  if (req.method === 'POST') {
    const { name, car, phone, cashapp, price, lat, lng, tags } = req.body;

    if (!name || !car || !phone || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuid();
    const driver = {
      id,
      name: name.trim(),
      car: car.trim(),
      phone: phone.trim(),
      cashapp: (cashapp || '').trim(),
      price: Number(price) || 7,
      lat: Number(lat),
      lng: Number(lng),
      tags: tags || [],
      rating: 5.0,
      trips: 0,
      online: true,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    };

    await kv.set(`driver:${id}`, JSON.stringify(driver));
    await kv.sadd('drivers:all', id);

    return res.status(200).json({ success: true, driver });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
