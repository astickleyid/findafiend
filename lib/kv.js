// Vercel KV wrapper — falls back to in-memory Map for local dev
let _kv;

const getKv = async () => {
  if (_kv) return _kv;
  try {
    const { kv } = await import('@vercel/kv');
    _kv = kv;
  } catch {
    // In-memory fallback
    const store = new Map();
    const sets = new Map();
    _kv = {
      get: async (k) => store.get(k) ?? null,
      set: async (k, v, opts) => { store.set(k, v); return 'OK'; },
      del: async (k) => { store.delete(k); return 1; },
      sadd: async (k, ...vals) => { if (!sets.has(k)) sets.set(k, new Set()); vals.forEach(v => sets.get(k).add(v)); return vals.length; },
      smembers: async (k) => [...(sets.get(k) ?? [])],
      srem: async (k, v) => { sets.get(k)?.delete(v); return 1; },
      expire: async () => 1,
      keys: async (pattern) => {
        const prefix = pattern.replace('*', '');
        return [...store.keys()].filter(k => k.startsWith(prefix));
      }
    };
  }
  return _kv;
};

export default getKv;
