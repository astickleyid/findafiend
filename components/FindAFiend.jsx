import { useState, useEffect, useRef, useCallback } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0A0906;--bg2:#111009;--bg3:#1A1814;--cream:#F2EDE4;--cream2:#C8C2B8;--ember:#E8622A;--ember2:#FF7A40;--rule:rgba(242,237,228,0.1);--rule2:rgba(242,237,228,0.06);--green:#27AE60}
  body{background:var(--bg)}
  .app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);font-family:"DM Sans",sans-serif;color:var(--cream);overflow-x:hidden;position:relative}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:0.6}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
  .splash{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;animation:fadeIn 0.6s ease}
  .splash-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px 40px;text-align:center;position:relative;overflow:hidden}
  .splash-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(242,237,228,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(242,237,228,0.06) 1px,transparent 1px);background-size:32px 32px}
  .splash-dot{width:8px;height:8px;background:var(--ember);border-radius:50%;margin-bottom:32px;animation:pulse 2s ease-in-out infinite;box-shadow:0 0 16px var(--ember);position:relative;z-index:1}
  .splash-title{font-family:"Bebas Neue",sans-serif;font-size:clamp(52px,14vw,72px);letter-spacing:0.04em;line-height:0.9;color:var(--cream);position:relative;z-index:1}
  .splash-title span{color:var(--ember)}
  .splash-tld{font-family:"Space Mono",monospace;font-size:13px;color:var(--cream2);letter-spacing:0.15em;margin-top:8px;position:relative;z-index:1}
  .splash-tagline{font-size:14px;color:var(--cream2);margin-top:24px;max-width:260px;line-height:1.6;position:relative;z-index:1;font-weight:300}
  .splash-city{font-family:"Bebas Neue",sans-serif;font-size:18px;color:var(--ember);letter-spacing:0.15em;margin-top:16px;position:relative;z-index:1}
  .splash-stats{display:flex;border-top:1px solid rgba(242,237,228,0.1);border-bottom:1px solid rgba(242,237,228,0.1)}
  .splash-stat{flex:1;padding:20px 16px;text-align:center;border-right:1px solid rgba(242,237,228,0.1)}
  .splash-stat:last-child{border-right:none}
  .splash-stat-num{font-family:"Bebas Neue",sans-serif;font-size:28px;color:var(--ember);display:block}
  .splash-stat-label{font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px;display:block}
  .splash-actions{padding:0 24px 48px;display:flex;flex-direction:column;gap:12px}
  .btn-primary{width:100%;padding:18px;background:var(--ember);color:#0A0906;font-family:"Bebas Neue",sans-serif;font-size:20px;letter-spacing:0.1em;border:none;border-radius:2px;cursor:pointer;transition:all 0.15s}
  .btn-primary:hover{background:var(--ember2);transform:translateY(-1px)}
  .btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .btn-secondary{width:100%;padding:18px;background:transparent;color:var(--cream);font-family:"Bebas Neue",sans-serif;font-size:20px;letter-spacing:0.1em;border:1px solid rgba(242,237,228,0.1);border-radius:2px;cursor:pointer;transition:all 0.15s}
  .btn-secondary:hover{border-color:var(--cream2)}
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(242,237,228,0.1);position:sticky;top:0;background:rgba(10,9,6,0.95);backdrop-filter:blur(8px);z-index:100}
  .topbar-logo{font-family:"Bebas Neue",sans-serif;font-size:22px;letter-spacing:0.05em;cursor:pointer}
  .topbar-logo span{color:var(--ember)}
  .topbar-mode{display:flex;background:var(--bg3);border-radius:2px;overflow:hidden;border:1px solid rgba(242,237,228,0.1)}
  .mode-btn{padding:6px 14px;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.08em;border:none;background:transparent;color:var(--cream2);cursor:pointer;transition:all 0.15s}
  .mode-btn.active{background:var(--ember);color:#0A0906;font-weight:700}
  .topbar-loc{font-family:"Space Mono",monospace;font-size:9px;color:var(--ember);letter-spacing:0.08em;display:flex;align-items:center;gap:4px}
  .loc-dot{width:6px;height:6px;background:var(--ember);border-radius:50%;animation:pulse 2s infinite}
  .gps-banner{padding:12px 20px;background:rgba(232,98,42,0.08);border-bottom:1px solid rgba(232,98,42,0.2);font-family:"Space Mono",monospace;font-size:10px;color:var(--ember);letter-spacing:0.08em;display:flex;align-items:center;gap:8px}
  .gps-spinner{width:12px;height:12px;border:2px solid rgba(232,98,42,0.3);border-top-color:var(--ember);border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0}
  .map-strip{position:relative;height:180px;background:var(--bg2);overflow:hidden;border-bottom:1px solid rgba(242,237,228,0.1)}
  .map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(242,237,228,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(242,237,228,0.1) 1px,transparent 1px);background-size:40px 40px}
  .map-you{position:absolute;width:14px;height:14px;background:var(--ember);border-radius:50%;border:3px solid #0A0906;box-shadow:0 0 20px var(--ember),0 0 40px rgba(232,98,42,0.4);top:50%;left:50%;transform:translate(-50%,-50%);z-index:10}
  .map-you-ripple{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--ember);top:50%;left:50%;animation:ripple 2s infinite;opacity:0}
  .map-radius{position:absolute;width:120px;height:120px;border-radius:50%;border:1px dashed rgba(232,98,42,0.25);top:50%;left:50%;transform:translate(-50%,-50%)}
  .map-driver-dot{position:absolute;width:10px;height:10px;border-radius:50%;border:2px solid #0A0906;transform:translate(-50%,-50%);cursor:pointer;transition:all 0.2s;z-index:5}
  .map-driver-dot:hover{transform:translate(-50%,-50%) scale(1.5)}
  .map-label{position:absolute;bottom:8px;right:12px;font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.1em}
  .map-city{position:absolute;bottom:8px;left:12px;font-family:"Space Mono",monospace;font-size:9px;color:var(--ember);letter-spacing:0.08em}
  .section-header{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px}
  .section-title{font-family:"Bebas Neue",sans-serif;font-size:20px;letter-spacing:0.08em}
  .section-count{font-family:"Space Mono",monospace;font-size:10px;color:var(--ember);background:rgba(232,98,42,0.12);padding:3px 8px;border-radius:1px;letter-spacing:0.05em}
  .filters{display:flex;gap:8px;padding:0 20px 16px;overflow-x:auto;scrollbar-width:none}
  .filters::-webkit-scrollbar{display:none}
  .filter-chip{flex-shrink:0;padding:6px 14px;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.06em;border:1px solid rgba(242,237,228,0.1);border-radius:1px;background:transparent;color:var(--cream2);cursor:pointer;transition:all 0.15s;white-space:nowrap}
  .filter-chip.active{border-color:var(--ember);color:var(--ember);background:rgba(232,98,42,0.08)}
  .driver-list{padding:0 20px;display:flex;flex-direction:column;gap:1px}
  .driver-card{background:var(--bg2);border:1px solid rgba(242,237,228,0.1);border-radius:2px;padding:16px;cursor:pointer;transition:all 0.2s;animation:slideUp 0.4s ease both;position:relative;overflow:hidden}
  .driver-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ember);transform:scaleY(0);transition:transform 0.2s;transform-origin:bottom}
  .driver-card:hover{border-color:rgba(242,237,228,0.18);background:var(--bg3)}
  .driver-card:hover::before{transform:scaleY(1)}
  .driver-card-top{display:flex;align-items:flex-start;gap:12px}
  .driver-avatar{width:44px;height:44px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:"Bebas Neue",sans-serif;font-size:22px;flex-shrink:0;color:#0A0906;position:relative}
  .driver-info{flex:1}
  .driver-name{font-family:"Bebas Neue",sans-serif;font-size:20px;letter-spacing:0.05em;line-height:1}
  .driver-car{font-size:12px;color:var(--cream2);margin-top:4px;font-weight:300}
  .driver-tags{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
  .driver-tag{font-family:"Space Mono",monospace;font-size:9px;padding:3px 8px;border:1px solid rgba(242,237,228,0.1);border-radius:1px;color:var(--cream2);letter-spacing:0.05em}
  .driver-price-col{text-align:right;flex-shrink:0}
  .driver-price{font-family:"Bebas Neue",sans-serif;font-size:28px;color:var(--ember);line-height:1}
  .driver-price-label{font-family:"Space Mono",monospace;font-size:8px;color:var(--cream2);letter-spacing:0.1em}
  .driver-card-mid{display:flex;align-items:center;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(242,237,228,0.06)}
  .driver-stat{display:flex;align-items:center;gap:4px;font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2)}
  .driver-offline{position:absolute;inset:0;background:rgba(10,9,6,0.7);display:flex;align-items:center;justify-content:center;border-radius:2px;backdrop-filter:blur(2px)}
  .driver-offline-label{font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);letter-spacing:0.1em;border:1px solid rgba(242,237,228,0.1);padding:6px 14px;border-radius:1px}
  .online-badge{width:8px;height:8px;background:#27AE60;border-radius:50%;border:2px solid var(--bg2);position:absolute;bottom:-2px;right:-2px;box-shadow:0 0 6px #27AE60}
  .stars{color:#F39C12;font-size:11px;letter-spacing:1px}
  .stars-lg{color:#F39C12;font-size:28px;letter-spacing:4px;cursor:pointer}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:flex-end;animation:fadeIn 0.2s ease;backdrop-filter:blur(4px)}
  .modal{width:100%;max-width:430px;margin:0 auto;background:var(--bg2);border-top:1px solid rgba(242,237,228,0.1);border-radius:4px 4px 0 0;padding:24px;animation:slideUp 0.3s ease;max-height:90vh;overflow-y:auto}
  .modal-handle{width:36px;height:3px;background:rgba(242,237,228,0.1);border-radius:2px;margin:0 auto 24px}
  .modal-driver-row{display:flex;align-items:center;gap:14px;padding-bottom:20px;border-bottom:1px solid rgba(242,237,228,0.1);margin-bottom:20px}
  .modal-avatar{width:56px;height:56px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:"Bebas Neue",sans-serif;font-size:28px;color:#0A0906;flex-shrink:0}
  .modal-driver-name{font-family:"Bebas Neue",sans-serif;font-size:28px;letter-spacing:0.05em;line-height:1}
  .modal-driver-sub{font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);letter-spacing:0.08em;margin-top:4px}
  .modal-price-big{font-family:"Bebas Neue",sans-serif;font-size:48px;color:var(--ember);line-height:1}
  .modal-field{margin-bottom:16px}
  .modal-label{font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;display:block}
  .modal-input{width:100%;background:var(--bg3);border:1px solid rgba(242,237,228,0.1);border-radius:2px;padding:14px 16px;color:var(--cream);font-family:"DM Sans",sans-serif;font-size:15px;outline:none;transition:border-color 0.15s}
  .modal-input:focus{border-color:var(--ember)}
  .modal-input::placeholder{color:rgba(242,237,228,0.3)}
  .modal-row{display:flex;gap:12px;margin-bottom:20px}
  .modal-info-chip{flex:1;background:var(--bg3);border:1px solid rgba(242,237,228,0.1);border-radius:2px;padding:14px;text-align:center}
  .modal-chip-val{font-family:"Bebas Neue",sans-serif;font-size:24px;color:var(--cream)}
  .modal-chip-label{font-family:"Space Mono",monospace;font-size:8px;color:var(--cream2);letter-spacing:0.1em;margin-top:2px}
  .modal-warning{background:rgba(232,98,42,0.06);border:1px solid rgba(232,98,42,0.2);border-radius:2px;padding:14px;margin-bottom:20px;font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);line-height:1.7;letter-spacing:0.03em}
  .status-badge{display:inline-flex;align-items:center;gap:6px;font-family:"Space Mono",monospace;font-size:10px;padding:6px 12px;border-radius:1px;letter-spacing:0.08em}
  .status-pending{background:rgba(243,156,18,0.12);color:#F39C12;border:1px solid rgba(243,156,18,0.3)}
  .status-accepted{background:rgba(39,174,96,0.12);color:#27AE60;border:1px solid rgba(39,174,96,0.3)}
  .status-blink{animation:blink 1s infinite}
  .confirm-screen{min-height:100vh;display:flex;flex-direction:column;animation:fadeIn 0.3s ease}
  .confirm-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;text-align:center}
  .confirm-title{font-family:"Bebas Neue",sans-serif;font-size:36px;letter-spacing:0.08em;margin-bottom:8px}
  .confirm-sub{font-family:"Space Mono",monospace;font-size:11px;color:var(--cream2);letter-spacing:0.08em;line-height:1.7}
  .confirm-card{width:100%;background:var(--bg2);border:1px solid rgba(242,237,228,0.1);border-radius:2px;padding:20px;margin:20px 0;text-align:left}
  .confirm-row{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(242,237,228,0.06);font-family:"Space Mono",monospace;font-size:11px}
  .confirm-row:last-child{border-bottom:none}
  .confirm-row-label{color:var(--cream2);letter-spacing:0.06em;flex-shrink:0;margin-right:12px}
  .confirm-row-val{color:var(--cream);text-align:right}
  .confirm-row-val.ember{color:var(--ember);font-family:"Bebas Neue",sans-serif;font-size:18px}
  .confirm-row-val.green{color:#27AE60}
  .contact-card{width:100%;background:rgba(39,174,96,0.08);border:1px solid rgba(39,174,96,0.3);border-radius:2px;padding:20px;margin:16px 0;text-align:left}
  .contact-title{font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.08em;color:#27AE60;margin-bottom:12px}
  .contact-phone{font-family:"Bebas Neue",sans-serif;font-size:28px;color:var(--cream);margin-bottom:4px;letter-spacing:0.05em}
  .contact-sub{font-family:"Space Mono",monospace;font-size:9px;color:var(--cream2);letter-spacing:0.08em}
  .cashapp-btn{width:100%;padding:16px;background:#00D54B;border:none;border-radius:2px;color:#000;font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;cursor:pointer;margin-top:12px;transition:background 0.15s}
  .cashapp-btn:hover{background:#00f059}
  .phone-btn{width:100%;padding:14px;background:transparent;border:1px solid rgba(39,174,96,0.4);border-radius:2px;color:#27AE60;font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;cursor:pointer;margin-top:8px;transition:all 0.15s;text-decoration:none;display:block;text-align:center}
  .rating-card{width:100%;background:var(--bg2);border:1px solid rgba(243,156,18,0.3);border-radius:2px;padding:20px;margin:16px 0;text-align:center}
  .rating-title{font-family:"Bebas Neue",sans-serif;font-size:20px;letter-spacing:0.08em;margin-bottom:16px;color:var(--cream)}
  .rating-stars{display:flex;justify-content:center;gap:8px;margin-bottom:16px}
  .rating-star{font-size:36px;cursor:pointer;transition:transform 0.1s;line-height:1}
  .rating-star:hover{transform:scale(1.2)}
  .rating-star.lit{filter:none}
  .rating-star.dim{opacity:0.3}
  .share-bar{display:flex;gap:8px;padding:0 20px 16px}
  .share-btn{flex:1;padding:12px;background:transparent;border:1px solid rgba(242,237,228,0.1);border-radius:2px;color:var(--cream2);font-family:"Space Mono",monospace;font-size:10px;letter-spacing:0.06em;cursor:pointer;transition:all 0.15s;text-align:center}
  .share-btn:hover{border-color:var(--ember);color:var(--ember)}
  .driver-status-bar{padding:20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(242,237,228,0.1)}
  .toggle-track{width:52px;height:28px;border-radius:14px;background:var(--bg3);border:1px solid rgba(242,237,228,0.1);position:relative;transition:background 0.2s;cursor:pointer}
  .toggle-track.on{background:var(--ember);border-color:var(--ember)}
  .toggle-thumb{width:22px;height:22px;background:var(--cream);border-radius:50%;position:absolute;top:2px;left:3px;transition:transform 0.2s}
  .toggle-track.on .toggle-thumb{transform:translateX(24px)}
  .toggle-label{font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.08em}
  .earnings-strip{display:flex;border-bottom:1px solid rgba(242,237,228,0.1)}
  .earnings-cell{flex:1;padding:20px 16px;border-right:1px solid rgba(242,237,228,0.1);text-align:center}
  .earnings-cell:last-child{border-right:none}
  .earnings-val{font-family:"Bebas Neue",sans-serif;font-size:32px;display:block}
  .earnings-val.green{color:#27AE60}
  .earnings-label{font-family:"Space Mono",monospace;font-size:8px;color:var(--cream2);letter-spacing:0.1em;text-transform:uppercase;margin-top:2px}
  .request-card{margin:20px;background:var(--bg2);border:1px solid rgba(232,98,42,0.4);border-radius:2px;overflow:hidden;animation:slideUp 0.3s ease}
  .request-header{background:rgba(232,98,42,0.12);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(232,98,42,0.2)}
  .request-header-label{font-family:"Space Mono",monospace;font-size:10px;color:var(--ember);letter-spacing:0.1em;display:flex;align-items:center;gap:6px}
  .request-blink{width:6px;height:6px;background:var(--ember);border-radius:50%;animation:blink 1s infinite}
  .request-body{padding:16px}
  .request-rider-name{font-family:"Bebas Neue",sans-serif;font-size:26px;letter-spacing:0.06em;margin-bottom:4px}
  .request-detail{font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);letter-spacing:0.06em;line-height:1.8;margin-bottom:16px}
  .request-actions{display:flex;gap:10px}
  .btn-accept{flex:2;padding:14px;background:#1E7E34;border:none;border-radius:2px;color:var(--cream);font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;cursor:pointer;transition:background 0.15s}
  .btn-accept:hover{background:#27AE60}
  .btn-decline{flex:1;padding:14px;background:transparent;border:1px solid rgba(242,237,228,0.1);border-radius:2px;color:var(--cream2);font-family:"Bebas Neue",sans-serif;font-size:18px;letter-spacing:0.1em;cursor:pointer;transition:all 0.15s}
  .btn-decline:hover{border-color:#C0392B;color:#C0392B}
  .empty-state{padding:40px 20px;text-align:center}
  .empty-title{font-family:"Bebas Neue",sans-serif;font-size:24px;letter-spacing:0.08em;color:var(--cream2);margin-bottom:8px}
  .empty-sub{font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);line-height:1.7;letter-spacing:0.06em}
  .reg-body{padding:24px 20px 60px}
  .reg-title{font-family:"Bebas Neue",sans-serif;font-size:32px;letter-spacing:0.08em;margin-bottom:4px}
  .reg-sub{font-family:"Space Mono",monospace;font-size:10px;color:var(--cream2);letter-spacing:0.06em;margin-bottom:24px;line-height:1.6}
  .reg-section{font-family:"Space Mono",monospace;font-size:9px;color:var(--ember);letter-spacing:0.12em;text-transform:uppercase;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(242,237,228,0.06)}
  .tag-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .tag-option{padding:6px 12px;font-family:"Space Mono",monospace;font-size:9px;letter-spacing:0.06em;border:1px solid rgba(242,237,228,0.1);border-radius:1px;background:transparent;color:var(--cream2);cursor:pointer;transition:all 0.15s}
  .tag-option.selected{border-color:var(--ember);color:var(--ember);background:rgba(232,98,42,0.08)}
  .err-msg{font-family:"Space Mono",monospace;font-size:10px;color:#E74C3C;letter-spacing:0.06em;margin-top:12px}
  .bottom-pad{height:60px}
`;

const COLORS = ["#C0392B","#2980B9","#8E44AD","#16A085","#E67E22","#2C3E50","#D35400","#1ABC9C","#884EA0","#2ECC71"];
const TAGS = ["AC works","no questions","cash only","Cash App ok","Venmo ok","aux cord","cold water","kids ok","fast driver","late nights","safe driver","music loud","long trips ok"];

// City detection by GPS
function detectCity(lat, lng) {
  if (!lat || !lng) return null;
  // Detroit metro: ~42.33, -83.05
  if (lat > 42.0 && lat < 42.7 && lng > -83.8 && lng < -82.7) return "detroit";
  // Toledo: ~41.66, -83.56
  if (lat > 41.4 && lat < 42.0 && lng > -84.0 && lng < -83.2) return "toledo";
  return null;
}

function Stars({ r }) {
  const f = Math.floor(r);
  return <span className="stars">{"★".repeat(f)}{"☆".repeat(5-f)}</span>;
}

function RatingWidget({ rideId, driverName, onDone }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [done, setDone] = useState(false);

  const submit = async (stars) => {
    setSelected(stars);
    try {
      await fetch("/api/drivers/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, rating: stars }),
      });
    } catch {}
    setDone(true);
    setTimeout(onDone, 1500);
  };

  if (done) return (
    <div className="rating-card">
      <div style={{fontSize:32,marginBottom:8}}>⭐</div>
      <div className="rating-title">THANKS FOR THE RATING</div>
      <div style={{fontFamily:"Space Mono",fontSize:10,color:"var(--cream2)",letterSpacing:"0.06em"}}>Helps keep fiends accountable</div>
    </div>
  );

  return (
    <div className="rating-card">
      <div className="rating-title">RATE {driverName.toUpperCase()}</div>
      <div className="rating-stars">
        {[1,2,3,4,5].map(n => (
          <div key={n} className="rating-star"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => submit(n)}
            style={{opacity: (hover||selected) >= n ? 1 : 0.25}}>
            ⭐
          </div>
        ))}
      </div>
      <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--cream2)",letterSpacing:"0.06em"}}>TAP TO RATE · HELPS OTHER RIDERS</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { pending:["WAITING FOR DRIVER","status-pending"], accepted:["DRIVER ACCEPTED","status-accepted"] };
  const [label, cls] = m[status] || [status.toUpperCase(),"status-pending"];
  return <div className={"status-badge "+cls}><div className="status-blink" style={{width:6,height:6,borderRadius:"50%",background:"currentColor"}} />{label}</div>;
}

export default function FindAFiend() {
  const [screen, setScreen] = useState("splash");
  const [mode, setMode] = useState("rider");
  const [gps, setGps] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [city, setCity] = useState("");
  const [detectedCity, setDetectedCity] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dest, setDest] = useState("");
  const [rName, setRName] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [booking, setBooking] = useState(false);
  const [rideId, setRideId] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [driverOnline, setDriverOnline] = useState(false);
  const [driverProf, setDriverProf] = useState(null);
  const [pendingRide, setPendingRide] = useState(null);
  const [earnings, setEarnings] = useState({ today:0, trips:0 });
  const pollRef = useRef(null);
  const beatRef = useRef(null);

  const getGps = useCallback(() => {
    if (!navigator.geolocation) { setGpsStatus("denied"); setGps({ lat:42.3314, lng:-83.0458 }); return; }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const { latitude:lat, longitude:lng } = p.coords;
        setGps({ lat, lng }); setGpsStatus("ok");
        const c = detectCity(lat, lng);
        if (c) setDetectedCity(c);
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          setCity(d.address?.city || d.address?.town || d.address?.county || "");
        } catch {}
      },
      () => {
        setGpsStatus("denied");
        // Default: Detroit
        setGps({ lat:42.3314, lng:-83.0458 });
        setDetectedCity("detroit");
        setCity("Detroit");
      }
    );
  }, []);

  const fetchDrivers = useCallback(async (coords) => {
    if (!coords) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/drivers/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=100`);
      const d = await r.json();
      if (d.drivers) setDrivers(d.drivers);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (gps && screen === "home") fetchDrivers(gps); }, [gps, screen, fetchDrivers]);

  useEffect(() => {
    if (!rideId) return;
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/rides/${rideId}`);
        const d = await r.json();
        if (d.ride) {
          setRideData(d.ride);
          if (d.ride.status === "completed") { clearInterval(pollRef.current); setShowRating(true); }
          if (d.ride.status === "cancelled") clearInterval(pollRef.current);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [rideId]);

  useEffect(() => {
    if (!driverProf) return;
    const beat = async () => {
      try {
        const r = await fetch("/api/drivers/heartbeat", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ id:driverProf.id, lat:gps?.lat, lng:gps?.lng, online:driverOnline })
        });
        const d = await r.json();
        if (d.pendingRide && !pendingRide) {
          const rr = await fetch(`/api/rides/${d.pendingRide}`);
          const rd = await rr.json();
          if (rd.ride?.status === "pending") setPendingRide(rd.ride);
        }
      } catch {}
    };
    beat();
    beatRef.current = setInterval(beat, 10000);
    return () => clearInterval(beatRef.current);
  }, [driverProf, driverOnline, gps, pendingRide]);

  const handleBook = async () => {
    if (!pickup || !dest || !sel || booking) return;
    setBooking(true);
    try {
      const r = await fetch("/api/rides/create", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ driverId:sel.id, riderName:rName||"Anonymous", riderPhone:rPhone, pickup, destination:dest })
      });
      const d = await r.json();
      if (d.rideId) { setRideId(d.rideId); setRideData(d.ride); setShowModal(false); setScreen("tracking"); }
    } catch {}
    setBooking(false);
  };

  const handleAccept = async () => {
    if (!pendingRide) return;
    await fetch(`/api/rides/${pendingRide.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"accepted" }) });
    setPendingRide({ ...pendingRide, status:"accepted" });
    setEarnings(e => ({ today:e.today+(pendingRide.driverPrice||7), trips:e.trips+1 }));
  };

  const handleDecline = async () => {
    if (!pendingRide) return;
    await fetch(`/api/rides/${pendingRide.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status:"cancelled" }) });
    setPendingRide(null);
  };

  const handleShare = () => {
    const citySlug = detectedCity || "detroit";
    const url = `${window.location.origin}/share?city=${citySlug}`;
    if (navigator.share) {
      navigator.share({ title:"findafiend.com", text:"Cheap rides in the hood. No Uber bs.", url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  const filtered = drivers.filter(d => {
    if (filter==="online") return d.online;
    if (filter==="cheap") return d.price<=6;
    if (filter==="close") return d.distance<=1;
    return true;
  });

  const POS = [["30%","65%"],["62%","72%"],["35%","30%"],["70%","35%"],["25%","55%"],["50%","75%"],["20%","40%"],["65%","55%"]];

  const cityLabel = detectedCity === "detroit" ? "DETROIT, MI" : detectedCity === "toledo" ? "TOLEDO, OH" : city ? city.toUpperCase() : "LOCATING...";

  // SPLASH
  if (screen === "splash") return (
    <><style>{S}</style>
    <div className="app">
      <div className="splash">
        <div className="splash-hero">
          <div className="splash-grid" />
          <div className="splash-dot" />
          <div className="splash-title">find<span>a</span>fiend</div>
          <div className="splash-tld">FINDAFIEND.COM</div>
          {detectedCity && <div className="splash-city">{cityLabel}</div>}
          <p className="splash-tagline">
            {detectedCity === "detroit" ? "For the D. Uber don't come everywhere. We do." :
             detectedCity === "toledo" ? "419 on the move. Real rides, real cheap." :
             "Community rides for the blocks Uber forgot. Cash only."}
          </p>
        </div>
        <div className="splash-stats">
          <div className="splash-stat"><span className="splash-stat-num">$5</span><span className="splash-stat-label">Avg Ride</span></div>
          <div className="splash-stat"><span className="splash-stat-num">4 min</span><span className="splash-stat-label">Avg ETA</span></div>
          <div className="splash-stat"><span className="splash-stat-num">100 mi</span><span className="splash-stat-label">Radius</span></div>
        </div>
        <div className="splash-actions">
          <button className="btn-primary" onClick={() => { setMode("rider"); setScreen("home"); getGps(); }}>I NEED A RIDE</button>
          <button className="btn-secondary" onClick={() => { setMode("driver"); setScreen("register"); getGps(); }}>I GOT A CAR — LET'S GET IT</button>
          <button onClick={handleShare} style={{padding:"12px",background:"transparent",border:"1px solid rgba(242,237,228,0.06)",borderRadius:2,color:"var(--cream2)",fontFamily:"Space Mono",fontSize:10,letterSpacing:"0.08em",cursor:"pointer"}}>
            📲 SHARE WITH YOUR PEOPLE
          </button>
        </div>
      </div>
    </div></>
  );

  if (screen === "register") return (
    <><style>{S}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo" onClick={() => setScreen("splash")}>find<span>a</span>fiend</div>
        <div style={{fontFamily:"Space Mono",fontSize:10,color:"var(--cream2)",letterSpacing:"0.08em"}}>DRIVER SIGNUP</div>
        <div className="topbar-loc">{gpsStatus==="ok"?<><div className="loc-dot"/>GPS OK</>:"NO GPS"}</div>
      </div>
      <RegForm gps={gps} gpsStatus={gpsStatus} onSuccess={(p) => { setDriverProf(p); setMode("driver"); setScreen("home"); }} onBack={() => setScreen("splash")} />
    </div></>
  );

  if (screen === "tracking" && rideData) return (
    <><style>{S}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo" onClick={() => setScreen("home")}>find<span>a</span>fiend</div>
        <StatusBadge status={rideData.status} />
      </div>
      <div className="confirm-screen">
        <div className="confirm-body">
          <div style={{fontSize:48,marginBottom:20}}>{rideData.status==="pending"?"⏳":"🚗"}</div>
          <div className="confirm-title">{rideData.status==="pending"?"WAITING ON FIEND":"FIEND IS COMING"}</div>
          <div className="confirm-sub">{rideData.status==="pending"?`Sent to ${rideData.driverName}. Hang tight.`:`${rideData.driverName} accepted. Watch for the ${rideData.driverCar}.`}</div>

          {(rideData.status==="accepted"||rideData.status==="en_route") && (
            <div className="contact-card">
              <div className="contact-title">✓ DRIVER CONTACT</div>
              <div className="contact-phone">{rideData.driverPhone}</div>
              <div className="contact-sub">TEXT FIRST — CALL ONLY IN EMERGENCY</div>
              <a href={`sms:${rideData.driverPhone}`} className="phone-btn">📱 TEXT {rideData.driverName.toUpperCase()}</a>
              {rideData.driverCashapp && (
                <a href={`https://cash.app/$${rideData.driverCashapp.replace("$","")}/${rideData.driverPrice}`} target="_blank" rel="noreferrer">
                  <button className="cashapp-btn">💸 PAY ${rideData.driverPrice} ON CASH APP</button>
                </a>
              )}
            </div>
          )}

          {showRating && (
            <RatingWidget rideId={rideId} driverName={rideData.driverName} onDone={() => setShowRating(false)} />
          )}

          <div className="confirm-card">
            <div className="confirm-row"><span className="confirm-row-label">DRIVER</span><span className="confirm-row-val">{rideData.driverName}</span></div>
            <div className="confirm-row"><span className="confirm-row-label">CAR</span><span className="confirm-row-val">{rideData.driverCar}</span></div>
            <div className="confirm-row"><span className="confirm-row-label">PICKUP</span><span className="confirm-row-val">{rideData.pickup}</span></div>
            <div className="confirm-row"><span className="confirm-row-label">DROPOFF</span><span className="confirm-row-val">{rideData.destination}</span></div>
            <div className="confirm-row"><span className="confirm-row-label">FARE</span><span className="confirm-row-val ember">${rideData.driverPrice} CASH</span></div>
            <div className="confirm-row"><span className="confirm-row-label">STATUS</span><span className="confirm-row-val green">{rideData.status.toUpperCase()}</span></div>
          </div>

          <div style={{fontFamily:"Space Mono",fontSize:10,color:"var(--cream2)",lineHeight:1.8,letterSpacing:"0.06em",textAlign:"center",background:"rgba(232,98,42,0.06)",border:"1px solid rgba(232,98,42,0.2)",padding:"16px",borderRadius:"2px",width:"100%"}}>
            ⚠ CASH ONLY · PAY ON ARRIVAL<br/>Verify plate before getting in. Trust your gut.
          </div>

          <div style={{display:"flex",gap:12,marginTop:16,width:"100%"}}>
            <button className="btn-secondary" style={{flex:1}} onClick={() => { setScreen("home"); setRideId(null); setRideData(null); }}>← BACK</button>
            <button onClick={handleShare} style={{flex:1,padding:14,background:"transparent",border:"1px solid rgba(242,237,228,0.1)",borderRadius:2,color:"var(--cream2)",fontFamily:"Space Mono",fontSize:10,letterSpacing:"0.06em",cursor:"pointer"}}>📲 SHARE</button>
          </div>
        </div>
      </div>
    </div></>
  );

  // HOME
  return (
    <><style>{S}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo" onClick={() => setScreen("splash")}>find<span>a</span>fiend</div>
        <div className="topbar-mode">
          <button className={"mode-btn "+(mode==="rider"?"active":"")} onClick={() => setMode("rider")}>RIDER</button>
          <button className={"mode-btn "+(mode==="driver"?"active":"")} onClick={() => { setMode("driver"); if (!driverProf) setScreen("register"); }}>DRIVER</button>
        </div>
        <div className="topbar-loc"><div className="loc-dot"/>{gpsStatus==="ok"?"LIVE":"..."}</div>
      </div>

      {gpsStatus==="loading" && <div className="gps-banner"><div className="gps-spinner"/>DETECTING YOUR LOCATION...</div>}

      <div className="map-strip">
        <div className="map-grid"/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(242,237,228,0.06)" strokeWidth="8"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(242,237,228,0.06)" strokeWidth="8"/>
          <line x1="0" y1="30%" x2="100%" y2="60%" stroke="rgba(242,237,228,0.04)" strokeWidth="5"/>
        </svg>
        <div className="map-you-ripple"/>
        <div className="map-radius"/>
        <div className="map-you"/>
        {drivers.filter(d=>d.online).map((d,i) => (
          <div key={d.id} className="map-driver-dot"
            style={{top:POS[i%8][0],left:POS[i%8][1],background:COLORS[i%10]}}
            onClick={() => { setSel(d); setShowModal(true); }} />
        ))}
        {cityLabel && <div className="map-city">📍 {cityLabel}</div>}
        <div className="map-label">{loading?"...":drivers.filter(d=>d.online).length} FIENDS · 100 MI</div>
      </div>

      {mode==="rider" && (
        <>
          <div className="section-header">
            <div className="section-title">FIENDS NEARBY</div>
            <div className="section-count">{loading?"LOADING...":drivers.filter(d=>d.online).length+" ONLINE"}</div>
          </div>

          <div className="share-bar">
            <button className="share-btn" onClick={handleShare}>📲 SHARE WITH YOUR HOOD</button>
            <button className="share-btn" onClick={() => window.open(`/share?city=${detectedCity||"detroit"}`, "_blank")}>🌐 CITY PAGE</button>
          </div>

          <div className="filters">
            {[["all","ALL"],["online","🟢 ONLINE"],["cheap","💸 CHEAPEST"],["close","📍 CLOSEST"]].map(([v,l]) => (
              <button key={v} className={"filter-chip "+(filter===v?"active":"")} onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>

          <div className="driver-list">
            {filtered.length===0 && !loading && (
              <div className="empty-state">
                <div className="empty-title">NO FIENDS YET</div>
                <div className="empty-sub">Share findafiend.com in your area.<br/>Be the first to spread the word.</div>
              </div>
            )}
            {filtered.map((d,i) => (
              <div key={d.id} className="driver-card" style={{animationDelay:`${i*0.06}s`}}
                onClick={() => { if(d.online){setSel(d);setShowModal(true);} }}>
                <div className="driver-card-top">
                  <div className="driver-avatar" style={{background:COLORS[i%10]}}>
                    {d.name[0]}
                    {d.online && <div className="online-badge"/>}
                  </div>
                  <div className="driver-info">
                    <div className="driver-name">{d.name}</div>
                    <div className="driver-car">{d.car}</div>
                    <div className="driver-tags">{(d.tags||[]).slice(0,3).map(t=><span key={t} className="driver-tag">{t}</span>)}</div>
                  </div>
                  <div className="driver-price-col">
                    <div className="driver-price">${d.price}</div>
                    <div className="driver-price-label">FLAT RATE</div>
                  </div>
                </div>
                <div className="driver-card-mid">
                  <div className="driver-stat">📍 {d.distance} mi</div>
                  <div className="driver-stat">⏱ {d.eta} min</div>
                  <div className="driver-stat"><Stars r={d.rating}/> {d.rating}</div>
                  <div className="driver-stat">{d.trips} rides</div>
                </div>
                {!d.online && <div className="driver-offline"><div className="driver-offline-label">OFFLINE</div></div>}
              </div>
            ))}
          </div>
          <div className="bottom-pad"/>
        </>
      )}

      {mode==="driver" && driverProf && (
        <>
          <div className="driver-status-bar">
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className={"toggle-track "+(driverOnline?"on":"")} onClick={() => setDriverOnline(!driverOnline)}>
                <div className="toggle-thumb"/>
              </div>
              <div className="toggle-label" style={{color:driverOnline?"var(--ember)":"var(--cream2)"}}>{driverOnline?"YOU'RE LIVE":"GO ONLINE"}</div>
            </div>
            <div style={{fontFamily:"Space Mono",fontSize:10,color:"var(--cream2)",letterSpacing:"0.08em"}}>{driverOnline?"🟢 ACTIVE":"⚫ OFFLINE"}</div>
          </div>
          <div className="earnings-strip">
            <div className="earnings-cell"><span className="earnings-val green">${earnings.today}</span><div className="earnings-label">TODAY</div></div>
            <div className="earnings-cell"><span className="earnings-val">{(driverProf.trips||0)+earnings.trips}</span><div className="earnings-label">TOTAL RIDES</div></div>
            <div className="earnings-cell"><span className="earnings-val">5.0</span><div className="earnings-label">RATING</div></div>
          </div>

          {driverOnline && pendingRide && (
            <div className="request-card">
              <div className="request-header">
                <div className="request-header-label"><div className="request-blink"/>NEW RIDE REQUEST</div>
                <div style={{fontFamily:"Space Mono",fontSize:9,color:"var(--ember)"}}>${pendingRide.driverPrice} FLAT</div>
              </div>
              <div className="request-body">
                <div className="request-rider-name">{pendingRide.riderName}</div>
                <div className="request-detail">
                  PICKUP: {pendingRide.pickup}<br/>
                  DROP: {pendingRide.destination}<br/>
                  {pendingRide.riderPhone && <>PHONE: {pendingRide.riderPhone}</>}
                </div>
                {pendingRide.status==="accepted"
                  ? <div style={{fontFamily:"Space Mono",fontSize:11,color:"#27AE60",letterSpacing:"0.08em",padding:"10px 0"}}>✓ ACCEPTED — GO PICK THEM UP</div>
                  : <div className="request-actions">
                      <button className="btn-accept" onClick={handleAccept}>✓ ACCEPT</button>
                      <button className="btn-decline" onClick={handleDecline}>SKIP</button>
                    </div>
                }
              </div>
            </div>
          )}

          {(!driverOnline || !pendingRide) && (
            <div className="empty-state">
              {driverOnline
                ? <><div className="empty-title" style={{fontSize:20}}>WAITING FOR RIDERS</div><div className="empty-sub">Profile is live. Requests appear here.</div></>
                : <><div className="empty-title">YOU'RE OFFLINE</div><div className="empty-sub">Toggle online to start receiving<br/>ride requests in your area.</div></>
              }
            </div>
          )}
          <div className="bottom-pad"/>
        </>
      )}

      {showModal && sel && mode==="rider" && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-driver-row">
              <div className="modal-avatar" style={{background:COLORS[filtered.indexOf(sel)%10]}}>{sel.name[0]}</div>
              <div style={{flex:1}}>
                <div className="modal-driver-name">{sel.name}</div>
                <div className="modal-driver-sub">{sel.car}</div>
                <div style={{marginTop:4}}><Stars r={sel.rating}/> <span style={{fontFamily:"Space Mono",fontSize:10,color:"var(--cream2)"}}>{sel.rating} · {sel.trips} rides</span></div>
              </div>
              <div className="modal-price-big">${sel.price}</div>
            </div>
            <div className="modal-row">
              <div className="modal-info-chip"><div className="modal-chip-val">{sel.eta} min</div><div className="modal-chip-label">ETA</div></div>
              <div className="modal-info-chip"><div className="modal-chip-val">{sel.distance} mi</div><div className="modal-chip-label">AWAY</div></div>
              <div className="modal-info-chip"><div className="modal-chip-val" style={{color:"#27AE60"}}>LIVE</div><div className="modal-chip-label">STATUS</div></div>
            </div>
            <div className="modal-field"><span className="modal-label">Your Name (optional)</span><input className="modal-input" placeholder="What to call you..." value={rName} onChange={e=>setRName(e.target.value)}/></div>
            <div className="modal-field"><span className="modal-label">Your Phone</span><input className="modal-input" type="tel" placeholder="313-555-0100" value={rPhone} onChange={e=>setRPhone(e.target.value)}/></div>
            <div className="modal-field"><span className="modal-label">Pickup — be specific</span><input className="modal-input" placeholder="Corner of MLK + Broad..." value={pickup} onChange={e=>setPickup(e.target.value)}/></div>
            <div className="modal-field"><span className="modal-label">Where You Going?</span><input className="modal-input" placeholder="Downtown, Eastland Mall..." value={dest} onChange={e=>setDest(e.target.value)}/></div>
            <div className="modal-warning">💬 Tags: {(sel.tags||[]).join(" · ")||"none"}<br/>⚠ Pay <strong>${sel.price} CASH</strong> on arrival. Contact revealed after accept.</div>
            <button className="btn-primary" disabled={!pickup||!dest||booking} onClick={handleBook}>
              {booking?"SENDING...":"REQUEST "+sel.name.toUpperCase()+" — $"+sel.price+" CASH"}
            </button>
          </div>
        </div>
      )}
    </div></>
  );
}

function RegForm({ gps, gpsStatus, onSuccess, onBack }) {
  const [f, setF] = useState({ name:"", car:"", phone:"", cashapp:"", price:"7" });
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = k => e => setF(p => ({...p, [k]:e.target.value}));
  const toggleTag = t => setTags(ts => ts.includes(t) ? ts.filter(x=>x!==t) : [...ts,t]);

  const submit = async () => {
    if (!f.name||!f.car||!f.phone) { setErr("Name, car, and phone required."); return; }
    if (!gps) { setErr("Location required."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/drivers/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ ...f, lat:gps.lat, lng:gps.lng, tags })
      });
      const d = await r.json();
      if (d.driver) onSuccess(d.driver);
      else setErr(d.error||"Something went wrong");
    } catch { setErr("Network error."); }
    setLoading(false);
  };

  return (
    <div className="reg-body">
      <div className="reg-title">JOIN AS A DRIVER</div>
      <div className="reg-sub">Your name and car are public. Phone shared only after a rider books you.</div>
      <div className="reg-section">YOUR INFO</div>
      <div className="modal-field"><span className="modal-label">First Name</span><input className="modal-input" placeholder="Big Dre, Mookie, Keisha..." value={f.name} onChange={set("name")}/></div>
      <div className="modal-field"><span className="modal-label">Phone (private — shared after booking)</span><input className="modal-input" type="tel" placeholder="313-555-0147" value={f.phone} onChange={set("phone")}/></div>
      <div className="modal-field"><span className="modal-label">Cash App $Cashtag (optional)</span><input className="modal-input" placeholder="$YourTag" value={f.cashapp} onChange={set("cashapp")}/></div>
      <div className="reg-section">YOUR CAR</div>
      <div className="modal-field"><span className="modal-label">Year, Make & Model</span><input className="modal-input" placeholder="2009 Chevy Impala..." value={f.car} onChange={set("car")}/></div>
      <div className="modal-field"><span className="modal-label">Flat price per ride ($)</span><input className="modal-input" type="number" min="1" max="50" value={f.price} onChange={set("price")}/></div>
      <div className="reg-section">ABOUT YOUR RIDE</div>
      <div className="tag-grid">{TAGS.map(t => <button key={t} className={"tag-option "+(tags.includes(t)?"selected":"")} onClick={() => toggleTag(t)}>{t}</button>)}</div>
      {gpsStatus==="loading" && <div style={{fontFamily:"Space Mono",fontSize:10,color:"var(--ember)",letterSpacing:"0.08em",marginTop:20}}>📡 Getting your location...</div>}
      {err && <div className="err-msg">⚠ {err}</div>}
      <button className="btn-primary" style={{marginTop:24}} disabled={loading} onClick={submit}>{loading?"REGISTERING...":"GO LIVE AS A DRIVER"}</button>
      <button className="btn-secondary" style={{marginTop:12}} onClick={onBack}>BACK</button>
    </div>
  );
}
