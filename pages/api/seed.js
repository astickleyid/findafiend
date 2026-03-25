import { Redis } from '@upstash/redis';
import { v4 as uuid } from 'uuid';

const DRIVERS = [
  { name:"Big Tone", car:"2008 Chevy Impala", phone:"313-555-0101", cashapp:"BigToneDetroit", price:6, lat:42.3314, lng:-83.0458, tags:["no questions","cash only","late nights"], hood:"East Detroit" },
  { name:"Dre", car:"2011 Dodge Charger", phone:"313-555-0102", cashapp:"DreWheelz", price:7, lat:42.3523, lng:-83.0694, tags:["fast","music loud","Cash App ok"], hood:"North End" },
  { name:"Keisha B", car:"2015 Nissan Altima", phone:"313-555-0103", cashapp:"KeishaRidez", price:6, lat:42.3184, lng:-83.2314, tags:["safe driver","kids ok","AC works"], hood:"Westside" },
  { name:"Pookie", car:"2006 Ford Crown Vic", phone:"313-555-0104", cashapp:"", price:5, lat:42.3825, lng:-83.1027, tags:["cash only","no questions","cheap"], hood:"8 Mile" },
  { name:"Lil Slim", car:"2013 Chevy Malibu", phone:"313-555-0105", cashapp:"SlimShady313", price:7, lat:42.2981, lng:-83.1837, tags:["aux cord","cold water","long trips ok"], hood:"Southwest Detroit" },
  { name:"Shay", car:"2016 Toyota Camry", phone:"313-555-0106", cashapp:"ShayDrives", price:8, lat:42.4056, lng:-83.0124, tags:["safe driver","AC works","Venmo ok"], hood:"Warren Ave" },
  { name:"Smoke", car:"2009 Pontiac G6", phone:"313-555-0107", cashapp:"", price:5, lat:42.3389, lng:-83.1731, tags:["cash only","no questions","late nights"], hood:"Brightmoor" },
  { name:"Q", car:"2012 Ford Fusion", phone:"313-555-0108", cashapp:"QMoney313", price:6, lat:42.3631, lng:-82.9981, tags:["fast","music loud","Cash App ok"], hood:"East English Village" },
  { name:"Mama T", car:"2014 Dodge Caravan", phone:"313-555-0109", cashapp:"MamaTrides", price:8, lat:42.3201, lng:-83.2891, tags:["kids ok","safe driver","long trips ok"], hood:"Dearborn" },
  { name:"Rico", car:"2010 Chevy Tahoe", phone:"313-555-0110", cashapp:"RicoDetroit", price:9, lat:42.4312, lng:-83.1456, tags:["big car","groups ok","cash only"], hood:"Ferndale" },
  { name:"Big Moe", car:"2009 Chevy Impala", phone:"419-555-0201", cashapp:"BigMoeToledo", price:5, lat:41.6639, lng:-83.5552, tags:["cash only","late nights","no questions"], hood:"North Toledo" },
  { name:"Tasha", car:"2013 Nissan Sentra", phone:"419-555-0202", cashapp:"TashaWheelz", price:6, lat:41.6753, lng:-83.5801, tags:["safe driver","AC works","kids ok"], hood:"Old West End" },
  { name:"D-Loc", car:"2007 Ford Taurus", phone:"419-555-0203", cashapp:"", price:5, lat:41.6521, lng:-83.5234, tags:["cash only","no questions","cheap"], hood:"East Toledo" },
  { name:"Jaylen", car:"2011 Dodge Avenger", phone:"419-555-0204", cashapp:"JaylenToledo", price:6, lat:41.6891, lng:-83.6012, tags:["aux cord","fast","Cash App ok"], hood:"South Toledo" },
  { name:"Nae Nae", car:"2015 Kia Optima", phone:"419-555-0205", cashapp:"NaeNaeRidez", price:7, lat:41.6445, lng:-83.5689, tags:["safe driver","Venmo ok","cold water"], hood:"Birmingham" },
  { name:"Locs", car:"2008 Pontiac Grand Prix", phone:"419-555-0206", cashapp:"", price:5, lat:41.7012, lng:-83.5123, tags:["cash only","no questions","late nights"], hood:"Junction" },
  { name:"Boogie", car:"2014 Chevy Cruze", phone:"419-555-0207", cashapp:"BoogieToledo", price:6, lat:41.6678, lng:-83.6234, tags:["music loud","Cash App ok","long trips ok"], hood:"Westgate" },
];

function page(title, body, color="#E8622A") {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
  <body style="background:#0A0906;color:#F2EDE4;font-family:monospace;padding:32px 20px;max-width:420px;margin:0 auto;text-align:center">
  <div style="font-size:48px;margin-bottom:16px;color:${color}">${title === "ERROR" ? "⚠" : title === "NOPE" ? "🚫" : "✓"}</div>
  <h1 style="font-size:24px;letter-spacing:0.1em;margin-bottom:20px;color:${color}">${title}</h1>
  ${body}
  </body></html>`;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');

  const key = req.query.key || req.body?.key;
  const seedKey = process.env.SEED_KEY;

  // Check env vars first
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).send(page("ERROR", `
      <p style="color:#C8C2B8;font-size:13px;line-height:1.7;margin-bottom:20px">
        Upstash env vars missing.<br><br>
        Go to Vercel → findafiend → Settings → Environment Variables and confirm these exist:<br><br>
        <code style="color:#E8622A">UPSTASH_REDIS_REST_URL</code><br>
        <code style="color:#E8622A">UPSTASH_REDIS_REST_TOKEN</code><br><br>
        Then redeploy.
      </p>
    `));
  }

  if (!seedKey) {
    return res.status(500).send(page("ERROR", `
      <p style="color:#C8C2B8;font-size:13px;line-height:1.7;margin-bottom:20px">
        SEED_KEY env var not set.<br><br>
        Go to Vercel → findafiend → Settings → Environment Variables → add:<br><br>
        <code style="color:#E8622A">SEED_KEY = findafiend313</code><br><br>
        Then redeploy, then try again.
      </p>
    `));
  }

  if (key !== seedKey) {
    return res.status(401).send(page("NOPE", `
      <p style="color:#C8C2B8;font-size:13px;margin-bottom:20px">Wrong key.</p>
      <p style="color:#C8C2B8;font-size:12px">Try: <code style="color:#E8622A">/api/seed?key=${seedKey}</code></p>
    `));
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const seeded = [];
    for (const d of DRIVERS) {
      const id = uuid();
      const driver = {
        id, name:d.name, car:d.car, phone:d.phone, cashapp:d.cashapp || '',
        price:d.price, lat:d.lat, lng:d.lng, tags:d.tags, hood:d.hood,
        rating: parseFloat((4.3 + Math.random() * 0.7).toFixed(1)),
        trips: Math.floor(50 + Math.random() * 400),
        online: true, createdAt: Date.now(), lastSeen: Date.now(),
      };
      await redis.set(`driver:${id}`, JSON.stringify(driver));
      await redis.sadd('drivers:all', id);
      seeded.push(`${driver.name} — ${driver.hood}`);
    }

    return res.status(200).send(page("SEEDED", `
      <p style="color:#C8C2B8;font-size:13px;margin-bottom:20px">${seeded.length} drivers live in Detroit + Toledo</p>
      <div style="text-align:left;border-top:1px solid rgba(242,237,228,0.1);padding-top:16px;margin-bottom:24px">
        ${seeded.map(n => `<div style="padding:6px 0;border-bottom:1px solid rgba(242,237,228,0.06);font-size:12px;color:#C8C2B8">✓ ${n}</div>`).join('')}
      </div>
      <a href="/" style="display:block;padding:16px;background:#E8622A;color:#0A0906;text-decoration:none;font-size:18px;letter-spacing:0.1em;border-radius:2px;font-weight:bold">
        OPEN FINDAFIEND →
      </a>
    `));

  } catch (err) {
    return res.status(500).send(page("ERROR", `
      <p style="color:#C8C2B8;font-size:13px;line-height:1.7;margin-bottom:20px">
        Redis connection failed.<br><br>
        <code style="color:#E8622A;font-size:11px">${err.message}</code><br><br>
        Check that Upstash is connected to this project in Vercel dashboard.
      </p>
    `));
  }
}
