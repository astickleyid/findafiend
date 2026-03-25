import { Redis } from '@upstash/redis';

let _redis;

const getKv = () => {
  if (_redis) return _redis;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    // Local in-memory fallback
    const store = new Map();
    const sets = new Map();
    _redis = {
      get: async (k) => store.get(k) ?? null,
      set: async (k, v) => { store.set(k, v); return 'OK'; },
      del: async (k) => { store.delete(k); return 1; },
      sadd: async (k, ...vals) => {
        if (!sets.has(k)) sets.set(k, new Set());
        vals.forEach(v => sets.get(k).add(v));
        return vals.length;
      },
      smembers: async (k) => [...(sets.get(k) ?? [])],
      srem: async (k, v) => { sets.get(k)?.delete(v); return 1; },
    };
  }

  return _redis;
};

export default getKv;
