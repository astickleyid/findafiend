import Head from 'next/head';
import { useRouter } from 'next/router';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0A0906;--cream:#F2EDE4;--cream2:#C8C2B8;--ember:#E8622A;--rule:rgba(242,237,228,0.1)}
  body{background:var(--bg);font-family:"DM Sans",sans-serif;color:var(--cream)}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
`;

const CITY_DATA = {
  detroit: {
    name: "Detroit",
    state: "MI",
    tagline: "For the D. By the D.",
    sub: "Uber don't come to every block. We do.",
    stat1: "10+", stat1l: "Fiends Rolling",
    stat2: "$5", stat2l: "Avg Ride",
    stat3: "313", stat3l: "Area Code",
    color: "#E8622A",
    hoods: ["East Side","North End","Westside","8 Mile","Southwest","Brightmoor","Dearborn","Ferndale"],
  },
  toledo: {
    name: "Toledo",
    state: "OH",
    tagline: "419 on the move.",
    sub: "Real rides. Real cheap. No surge pricing ever.",
    stat1: "7+", stat1l: "Fiends Rolling",
    stat2: "$5", stat2l: "Avg Ride",
    stat3: "419", stat3l: "Area Code",
    color: "#E8622A",
    hoods: ["North Toledo","Old West End","East Toledo","South Toledo","Birmingham","Junction","Westgate"],
  },
};

export default function SharePage() {
  const router = useRouter();
  const { city } = router.query;
  const data = CITY_DATA[city?.toLowerCase()] || CITY_DATA.detroit;

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: `findafiend.com — ${data.name}`,
        text: `${data.tagline} Cheap rides in ${data.name}. No app bs, no surge pricing.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <>
      <Head>
        <title>findafiend.com — {data.name}, {data.state}</title>
        <meta name="description" content={`${data.tagline} ${data.sub}`} />
        <meta property="og:title" content={`findafiend.com — ${data.name}, ${data.state}`} />
        <meta property="og:description" content={`${data.tagline} ${data.sub}`} />
        <meta property="og:url" content={`https://findafiend.com/share?city=${city}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{S}</style>

      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {/* HERO */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px 40px",textAlign:"center",position:"relative",overflow:"hidden",background:"var(--bg)"}}>
          {/* grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(242,237,228,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,237,228,0.05) 1px,transparent 1px)",backgroundSize:"32px 32px"}} />

          {/* pulse dot */}
          <div style={{width:10,height:10,background:"var(--ember)",borderRadius:"50%",marginBottom:28,boxShadow:"0 0 20px var(--ember)",animation:"pulse 2s infinite",position:"relative",zIndex:1}} />

          <div style={{fontFamily:"Bebas Neue",fontSize:"clamp(56px,16vw,80px)",letterSpacing:"0.04em",lineHeight:0.85,position:"relative",zIndex:1}}>
            find<span style={{color:"var(--ember)"}}>a</span>fiend
          </div>
          <div style={{fontFamily:"Space Mono",fontSize:11,color:"var(--cream2)",letterSpacing:"0.2em",marginTop:10,position:"relative",zIndex:1}}>
            {data.name.toUpperCase()}, {data.state} · FINDAFIEND.COM
          </div>

          <div style={{fontFamily:"Bebas Neue",fontSize:"clamp(22px,6vw,30px)",color:"var(--ember)",marginTop:32,letterSpacing:"0.08em",position:"relative",zIndex:1}}>
            {data.tagline}
          </div>
          <div style={{fontSize:15,color:"var(--cream2)",marginTop:12,maxWidth:280,lineHeight:1.6,position:"relative",zIndex:1,fontWeight:300}}>
            {data.sub}
          </div>
        </div>

        {/* STATS */}
        <div style={{display:"flex",borderTop:"1px solid var(--rule)",borderBottom:"1px solid var(--rule)"}}>
          {[
            [data.stat1, data.stat1l],
            [data.stat2, data.stat2l],
            [data.stat3, data.stat3l],
          ].map(([val, label], i) => (
            <div key={i} style={{flex:1,padding:"20px 16px",textAlign:"center",borderRight:i<2?"1px solid var(--rule)":"none"}}>
              <div style={{fontFamily:"Bebas Neue",fontSize:32,color:"var(--ember)"}}>{val}</div>
              <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--cream2)",letterSpacing:"0.1em",marginTop:2}}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* HOODS */}
        <div style={{padding:"20px 20px 0"}}>
          <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--ember)",letterSpacing:"0.12em",marginBottom:12}}>WE SERVE</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {data.hoods.map(h => (
              <div key={h} style={{fontFamily:"Space Mono",fontSize:9,padding:"4px 12px",border:"1px solid var(--rule)",borderRadius:1,color:"var(--cream2)",letterSpacing:"0.06em"}}>{h}</div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{padding:"24px 20px"}}>
          <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--ember)",letterSpacing:"0.12em",marginBottom:16}}>HOW IT WORKS</div>
          {[
            ["01", "Open findafiend.com on your phone"],
            ["02", "See real drivers near you right now"],
            ["03", "Book for $5–$10 flat — cash on arrival"],
            ["04", "No app, no account, no surge pricing"],
          ].map(([n, t]) => (
            <div key={n} style={{display:"flex",gap:16,padding:"10px 0",borderBottom:"1px solid rgba(242,237,228,0.06)",alignItems:"center"}}>
              <div style={{fontFamily:"Bebas Neue",fontSize:22,color:"var(--ember)",width:28,flexShrink:0}}>{n}</div>
              <div style={{fontFamily:"Space Mono",fontSize:11,color:"var(--cream2)",letterSpacing:"0.05em",lineHeight:1.5}}>{t}</div>
            </div>
          ))}
        </div>

        {/* CTA BUTTONS */}
        <div style={{padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:12}}>
          <a href="/" style={{textDecoration:"none"}}>
            <button style={{width:"100%",padding:18,background:"var(--ember)",color:"#0A0906",fontFamily:"Bebas Neue",fontSize:20,letterSpacing:"0.1em",border:"none",borderRadius:2,cursor:"pointer"}}>
              FIND A RIDE IN {data.name.toUpperCase()}
            </button>
          </a>
          <button onClick={share} style={{width:"100%",padding:18,background:"transparent",color:"var(--cream)",fontFamily:"Bebas Neue",fontSize:20,letterSpacing:"0.1em",border:"1px solid var(--rule)",borderRadius:2,cursor:"pointer"}}>
            📲 SHARE WITH YOUR PEOPLE
          </button>
          <a href="/?mode=driver" style={{textDecoration:"none"}}>
            <button style={{width:"100%",padding:14,background:"transparent",color:"var(--cream2)",fontFamily:"Space Mono",fontSize:10,letterSpacing:"0.1em",border:"1px solid rgba(242,237,228,0.06)",borderRadius:2,cursor:"pointer"}}>
              GOT A CAR? MAKE MONEY DRIVING →
            </button>
          </a>
        </div>

        {/* FOOTER */}
        <div style={{padding:"16px 20px",borderTop:"1px solid var(--rule)",textAlign:"center",fontFamily:"Space Mono",fontSize:9,color:"var(--cream2)",letterSpacing:"0.08em"}}>
          FINDAFIEND.COM · {data.name.toUpperCase()}, {data.state} · COMMUNITY RIDES
        </div>
      </div>
    </>
  );
}
