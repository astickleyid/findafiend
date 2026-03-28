import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0A0906;--bg2:#111009;--bg3:#1A1814;--cream:#F2EDE4;--cream2:#C8C2B8;--ember:#E8622A;--rule:rgba(242,237,228,0.1);--green:#27AE60}
  body{background:var(--bg);color:var(--cream);font-family:"DM Sans",sans-serif}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .wrap{max-width:900px;margin:0 auto;padding:24px 20px;animation:fadeIn 0.4s ease}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid var(--rule)}
  .logo{font-family:"Bebas Neue",sans-serif;font-size:28px;letter-spacing:0.05em}
  .logo span{color:var(--ember)}
  .admin-badge{font-family:"Space Mono",monospace;font-size:9px;color:var(--ember);background:rgba(232,98,42,0.12);padding:4px 10px;border-radius:1px;letter-spacing:0.1em;border:1px solid rgba(232,98,42,0.3)}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-bottom:32px;border:1px solid var(--rule)}
  .stat-cell{background:var(--bg2);padding:20px;text-align:center}
  .stat-num{font-family:"Bebas Neue",sans-serif;font-size:40px;color:var(--ember);display:block;line-height:1}
  .stat-label{font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.1em;margin-top:4px;display:block}
  .city-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px}
  .city-card{background:var(--bg2);border:1px solid var(--rule);padding:20px}
  .city-name{font-family:"Bebas Neue",sans-serif;font-size:22px;letter-spacing:0.08em;margin-bottom:4px}
  .city-code{font-family:"Space Mono",monospace;font-size:9px;color:var(--ember);letter-spacing:0.12em}
  .section-head{font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;margin-bottom:12px;color:var(--cream2)}
  .driver-table{width:100%;border-collapse:collapse;margin-bottom:32px}
  .driver-table th{font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.1em;text-align:left;padding:8px 12px;border-bottom:1px solid var(--rule);background:var(--bg3);text-transform:uppercase}
  .driver-table td{font-family:"Space Mono",monospace;font-size:11px;padding:10px 12px;border-bottom:1px solid rgba(242,237,228,0.05);color:var(--cream2);vertical-align:middle}
  .driver-table tr:hover td{background:var(--bg2)}
  .driver-name{font-family:"Bebas Neue",sans-serif;font-size:16px;color:var(--cream);letter-spacing:0.04em}
  .online-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px}
  .online{background:#27AE60;box-shadow:0 0 6px #27AE60}
  .offline{background:rgba(242,237,228,0.2)}
  .tag{font-size:9px;padding:2px 7px;border:1px solid rgba(242,237,228,0.1);border-radius:1px;color:var(--cream2);margin:0 2px;white-space:nowrap}
  .price{font-family:"Bebas Neue",sans-serif;font-size:18px;color:var(--ember)}
  .refresh-btn{font-family:"Space Mono",monospace;font-size:10px;padding:8px 16px;background:transparent;border:1px solid var(--rule);color:var(--cream2);cursor:pointer;border-radius:1px;letter-spacing:0.06em;transition:all 0.15s}
  .refresh-btn:hover{border-color:var(--ember);color:var(--ember)}
  .spinner{width:14px;height:14px;border:2px solid rgba(232,98,42,0.3);border-top-color:var(--ember);border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;margin-right:8px}
  .login-wrap{max-width:340px;margin:100px auto;padding:32px;background:var(--bg2);border:1px solid var(--rule);border-radius:2px;text-align:center}
  .login-title{font-family:"Bebas Neue",sans-serif;font-size:28px;letter-spacing:0.08em;margin-bottom:20px}
  input.key-input{width:100%;background:var(--bg3);border:1px solid var(--rule);border-radius:2px;padding:14px 16px;color:var(--cream);font-family:"Space Mono",monospace;font-size:13px;outline:none;margin-bottom:12px}
  input.key-input:focus{border-color:var(--ember)}
  .btn{width:100%;padding:16px;background:var(--ember);color:#0A0906;font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;border:none;border-radius:2px;cursor:pointer}
  @media(max-width:600px){
    .stats{grid-template-columns:repeat(2,1fr)}
    .city-row{grid-template-columns:1fr}
    .driver-table{font-size:10px}
  }
`;

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = async (k) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin?key=${k || key}`);
      const d = await r.json();
      if (r.status === 401) { alert("Wrong key"); setAuthed(false); return; }
      setData(d);
      setAuthed(true);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch { alert("Error loading data"); }
    setLoading(false);
  };

  // Auto-refresh every 30s
  useEffect(() => {
    if (!authed) return;
    const iv = setInterval(() => load(), 30000);
    return () => clearInterval(iv);
  }, [authed, key]);

  if (!authed) return (
    <>
      <Head><title>findafiend — admin</title></Head>
      <style>{S}</style>
      <div className="login-wrap">
        <div className="login-title">ADMIN</div>
        <input className="key-input" type="password" placeholder="Enter admin key..." value={key} onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} />
        <button className="btn" onClick={() => load()}>ENTER</button>
      </div>
    </>
  );

  const detroit = data?.drivers?.filter(d => d.lat > 42.0 && d.lat < 42.7) || [];
  const toledo = data?.drivers?.filter(d => d.lat > 41.4 && d.lat < 42.0) || [];

  return (
    <>
      <Head><title>findafiend — admin dashboard</title></Head>
      <style>{S}</style>
      <div className="wrap">
        <div className="topbar">
          <div>
            <div className="logo">find<span>a</span>fiend</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span className="admin-badge">ADMIN DASHBOARD</span>
            {lastRefresh && <span style={{fontFamily:"Space Mono",fontSize:9,color:"var(--cream2)"}}>UPDATED {lastRefresh}</span>}
            <button className="refresh-btn" onClick={() => load()} disabled={loading}>
              {loading ? <><span className="spinner"/>LOADING</> : "↻ REFRESH"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-cell">
            <span className="stat-num">{data?.total || 0}</span>
            <span className="stat-label">TOTAL DRIVERS</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num" style={{color:"#27AE60"}}>{data?.online || 0}</span>
            <span className="stat-label">ONLINE NOW</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num">{detroit.length}</span>
            <span className="stat-label">DETROIT</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num">{toledo.length}</span>
            <span className="stat-label">TOLEDO</span>
          </div>
        </div>

        {/* CITY CARDS */}
        <div className="city-row">
          {[["DETROIT", "313", detroit], ["TOLEDO", "419", toledo]].map(([city, code, drivers]) => (
            <div key={city} className="city-card">
              <div className="city-name">{city}</div>
              <div className="city-code">{code} · {drivers.filter(d=>d.online).length} ONLINE · {drivers.length} TOTAL</div>
              <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6}}>
                {[...new Set(drivers.map(d=>d.hood).filter(Boolean))].map(h => (
                  <span key={h} className="tag">{h}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DRIVER TABLE */}
        <div className="section-head">ALL DRIVERS</div>
        <div style={{overflowX:"auto"}}>
          <table className="driver-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>NAME</th>
                <th>CAR</th>
                <th>HOOD</th>
                <th>PRICE</th>
                <th>RATING</th>
                <th>TRIPS</th>
                <th>TAGS</th>
              </tr>
            </thead>
            <tbody>
              {(data?.drivers || []).map(d => (
                <tr key={d.id}>
                  <td><span className={`online-dot ${d.online?"online":"offline"}`}/>{d.online?"LIVE":"OFF"}</td>
                  <td><div className="driver-name">{d.name}</div></td>
                  <td>{d.car}</td>
                  <td>{d.hood || "—"}</td>
                  <td><span className="price">${d.price}</span></td>
                  <td>{"★".repeat(Math.floor(d.rating))} {d.rating}</td>
                  <td>{d.trips}</td>
                  <td>{(d.tags||[]).slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--cream2)",letterSpacing:"0.08em",textAlign:"center",paddingBottom:40}}>
          FINDAFIEND.COM · ADMIN · AUTO-REFRESH 30S
        </div>
      </div>
    </>
  );
}
