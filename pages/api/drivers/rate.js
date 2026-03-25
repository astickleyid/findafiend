import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const { rideId, rating } = req.body;
  if (!rideId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rideId and rating (1-5) required' });
  }

  const raw = await redis.get(`ride:${rideId}`);
  if (!raw) return res.status(404).json({ error: 'Ride not found' });

  const ride = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (ride.rated) return res.status(400).json({ error: 'Already rated' });

  // Update driver rating (rolling average)
  const driverRaw = await redis.get(`driver:${ride.driverId}`);
  if (driverRaw) {
    const driver = typeof driverRaw === 'string' ? JSON.parse(driverRaw) : driverRaw;
    const trips = driver.trips || 1;
    driver.rating = parseFloat(((driver.rating * trips + rating) / (trips + 1)).toFixed(1));
    await redis.set(`driver:${ride.driverId}`, JSON.stringify(driver));
  }

  // Mark ride as rated
  ride.rated = true;
  ride.riderRating = rating;
  await redis.set(`ride:${rideId}`, JSON.stringify(ride));

  res.status(200).json({ success: true });
}
