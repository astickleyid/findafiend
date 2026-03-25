import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0906;
    --bg2: #111009;
    --bg3: #1A1814;
    --cream: #F2EDE4;
    --cream2: #C8C2B8;
    --ember: #E8622A;
    --ember2: #FF7A40;
    --rule: rgba(242,237,228,0.1);
    --rule2: rgba(242,237,228,0.06);
  }

  body { background: var(--bg); }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    overflow-x: hidden;
    position: relative;
  }

  /* NOISE TEXTURE */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
    opacity: 0.4;
  }

  /* SPLASH */
  .splash {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    animation: fadeIn 0.6s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes blink { 0%,100% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } }

  .splash-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 32px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .splash-hero::after {
    content: '';
    position: absolute;
    top: 0; left: -20px; right: -20px;
    height: 1px;
    background: var(--ember);
    animation: scanline 4s linear infinite;
    opacity: 0.15;
  }

  .splash-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(var(--rule2) 1px, transparent 1px),
      linear-gradient(90deg, var(--rule2) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .splash-dot {
    width: 8px; height: 8px;
    background: var(--ember);
    border-radius: 50%;
    margin-bottom: 32px;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 16px var(--ember);
    position: relative;
    z-index: 1;
  }

  .splash-dot::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1px solid var(--ember);
    opacity: 0.3;
    animation: pulse 2s ease-in-out infinite 0.5s;
  }

  .splash-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 14vw, 72px);
    letter-spacing: 0.04em;
    line-height: 0.9;
    color: var(--cream);
    position: relative;
    z-index: 1;
  }

  .splash-title span { color: var(--ember); }

  .splash-tld {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    color: var(--cream2);
    letter-spacing: 0.15em;
    margin-top: 8px;
    position: relative;
    z-index: 1;
  }

  .splash-tagline {
    font-size: 14px;
    color: var(--cream2);
    margin-top: 24px;
    max-width: 260px;
    line-height: 1.6;
    position: relative;
    z-index: 1;
    font-weight: 300;
  }

  .splash-stats {
    display: flex;
    gap: 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    margin: 0 0 32px;
  }

  .splash-stat {
    flex: 1;
    padding: 20px 16px;
    text-align: center;
    border-right: 1px solid var(--rule);
  }

  .splash-stat:last-child { border-right: none; }

  .splash-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--ember);
    display: block;
  }

  .splash-stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--cream2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
    display: block;
  }

  .splash-actions {
    padding: 0 24px 48px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* BUTTONS */
  .btn-primary {
    width: 100%;
    padding: 18px;
    background: var(--ember);
    color: #0A0906;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.1em;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-primary:hover { background: var(--ember2); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    width: 100%;
    padding: 18px;
    background: transparent;
    color: var(--cream);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.1em;
    border: 1px solid var(--rule);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-secondary:hover { border-color: var(--cream2); }

  /* TOP BAR */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--rule);
    position: sticky;
    top: 0;
    background: rgba(10,9,6,0.95);
    backdrop-filter: blur(8px);
    z-index: 100;
  }

  .topbar-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.05em;
  }

  .topbar-logo span { color: var(--ember); }

  .topbar-mode {
    display: flex;
    background: var(--bg3);
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid var(--rule);
  }

  .mode-btn {
    padding: 6px 14px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    border: none;
    background: transparent;
    color: var(--cream2);
    cursor: pointer;
    transition: all 0.15s;
  }

  .mode-btn.active {
    background: var(--ember);
    color: #0A0906;
    font-weight: 700;
  }

  .topbar-loc {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--ember);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .loc-dot {
    width: 6px; height: 6px;
    background: var(--ember);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  /* MAP STRIP */
  .map-strip {
    position: relative;
    height: 180px;
    background: var(--bg2);
    overflow: hidden;
    border-bottom: 1px solid var(--rule);
  }

  .map-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--rule) 1px, transparent 1px),
      linear-gradient(90deg, var(--rule) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .map-roads {
    position: absolute;
    inset: 0;
  }

  .map-you {
    position: absolute;
    width: 14px; height: 14px;
    background: var(--ember);
    border-radius: 50%;
    border: 3px solid #0A0906;
    box-shadow: 0 0 20px var(--ember), 0 0 40px rgba(232,98,42,0.4);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .map-you::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px solid var(--ember);
    opacity: 0.4;
    animation: pulse 2s infinite;
  }

  .map-radius {
    position: absolute;
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 1px dashed rgba(232,98,42,0.25);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }

  .map-driver-dot {
    position: absolute;
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 2px solid #0A0906;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.2s;
    z-index: 5;
  }

  .map-driver-dot:hover { transform: translate(-50%, -50%) scale(1.5); }

  .map-label {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--cream2);
    letter-spacing: 0.1em;
  }

  /* SECTION HEADER */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 12px;
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.08em;
    color: var(--cream);
  }

  .section-count {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--ember);
    background: rgba(232,98,42,0.12);
    padding: 3px 8px;
    border-radius: 1px;
    letter-spacing: 0.05em;
  }

  /* FILTERS */
  .filters {
    display: flex;
    gap: 8px;
    padding: 0 20px 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .filters::-webkit-scrollbar { display: none; }

  .filter-chip {
    flex-shrink: 0;
    padding: 6px 14px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.06em;
    border: 1px solid var(--rule);
    border-radius: 1px;
    background: transparent;
    color: var(--cream2);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .filter-chip.active {
    border-color: var(--ember);
    color: var(--ember);
    background: rgba(232,98,42,0.08);
  }

  /* DRIVER CARD */
  .driver-list {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .driver-card {
    background: var(--bg2);
    border: 1px solid var(--rule);
    border-radius: 2px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    animation: slideUp 0.4s ease both;
    position: relative;
    overflow: hidden;
  }

  .driver-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--ember);
    transform: scaleY(0);
    transition: transform 0.2s;
    transform-origin: bottom;
  }

  .driver-card:hover { border-color: rgba(242,237,228,0.18); background: var(--bg3); }
  .driver-card:hover::before { transform: scaleY(1); }

  .driver-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .driver-avatar {
    width: 44px; height: 44px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    flex-shrink: 0;
    color: #0A0906;
    position: relative;
  }

  .driver-info { flex: 1; }

  .driver-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.05em;
    line-height: 1;
  }

  .driver-hood {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--cream2);
    letter-spacing: 0.1em;
    margin-top: 3px;
    text-transform: uppercase;
  }

  .driver-car {
    font-size: 12px;
    color: var(--cream2);
    margin-top: 4px;
    font-weight: 300;
  }

  .driver-price-col {
    text-align: right;
    flex-shrink: 0;
  }

  .driver-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--ember);
    line-height: 1;
  }

  .driver-price-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    color: var(--cream2);
    letter-spacing: 0.1em;
  }

  .driver-card-mid {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--rule2);
  }

  .driver-stat {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--cream2);
  }

  .driver-stat-icon { font-size: 11px; }

  .driver-tags {
    display: flex;
    gap: 6px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .driver-tag {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    padding: 3px 8px;
    border: 1px solid var(--rule);
    border-radius: 1px;
    color: var(--cream2);
    letter-spacing: 0.05em;
  }

  .driver-offline {
    position: absolute;
    inset: 0;
    background: rgba(10,9,6,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    backdrop-filter: blur(2px);
  }

  .driver-offline-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--cream2);
    letter-spacing: 0.1em;
    border: 1px solid var(--rule);
    padding: 6px 14px;
    border-radius: 1px;
  }

  .online-badge {
    width: 8px; height: 8px;
    background: #27AE60;
    border-radius: 50%;
    border: 2px solid var(--bg2);
    position: absolute;
    bottom: -2px; right: -2px;
    box-shadow: 0 0 6px #27AE60;
  }

  /* RIDE REQUEST MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .modal {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    background: var(--bg2);
    border-top: 1px solid var(--rule);
    border-radius: 4px 4px 0 0;
    padding: 24px;
    animation: slideUp 0.3s ease;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-handle {
    width: 36px; height: 3px;
    background: var(--rule);
    border-radius: 2px;
    margin: 0 auto 24px;
  }

  .modal-driver-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--rule);
    margin-bottom: 20px;
  }

  .modal-avatar {
    width: 56px; height: 56px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: #0A0906;
    flex-shrink: 0;
  }

  .modal-driver-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 0.05em;
    line-height: 1;
  }

  .modal-driver-sub {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--cream2);
    letter-spacing: 0.08em;
    margin-top: 4px;
  }

  .modal-price-big {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    color: var(--ember);
    line-height: 1;
    margin-top: -4px;
  }

  .modal-field {
    margin-bottom: 16px;
  }

  .modal-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--cream2);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }

  .modal-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--rule);
    border-radius: 2px;
    padding: 14px 16px;
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s;
  }

  .modal-input:focus { border-color: var(--ember); }
  .modal-input::placeholder { color: rgba(242,237,228,0.3); }

  .modal-notes {
    background: rgba(232,98,42,0.06);
    border: 1px solid rgba(232,98,42,0.2);
    border-radius: 2px;
    padding: 14px;
    margin-bottom: 20px;
  }

  .modal-notes-text {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--cream2);
    line-height: 1.7;
    letter-spacing: 0.03em;
  }

  .modal-row {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .modal-info-chip {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--rule);
    border-radius: 2px;
    padding: 14px;
    text-align: center;
  }

  .modal-chip-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: var(--cream);
  }

  .modal-chip-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    color: var(--cream2);
    letter-spacing: 0.1em;
    margin-top: 2px;
  }

  /* CONFIRM SCREEN */
  .confirm-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0;
    animation: fadeIn 0.3s ease;
  }

  .confirm-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
    text-align: center;
  }

  .confirm-icon {
    font-size: 48px;
    margin-bottom: 24px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .confirm-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    letter-spacing: 0.08em;
    color: var(--cream);
    margin-bottom: 8px;
  }

  .confirm-sub {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--cream2);
    letter-spacing: 0.08em;
    line-height: 1.7;
  }

  .confirm-card {
    width: 100%;
    background: var(--bg2);
    border: 1px solid var(--rule);
    border-radius: 2px;
    padding: 20px;
    margin: 32px 0;
    text-align: left;
  }

  .confirm-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--rule2);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
  }

  .confirm-row:last-child { border-bottom: none; }
  .confirm-row-label { color: var(--cream2); letter-spacing: 0.06em; }
  .confirm-row-val { color: var(--cream); }
  .confirm-row-val.ember { color: var(--ember); font-family: 'Bebas Neue', sans-serif; font-size: 18px; }

  /* DRIVER MODE */
  .driver-mode-screen {
    padding: 0;
    animation: fadeIn 0.3s ease;
  }

  .driver-status-bar {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--rule);
  }

  .driver-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .toggle-track {
    width: 52px; height: 28px;
    border-radius: 14px;
    background: var(--bg3);
    border: 1px solid var(--rule);
    position: relative;
    transition: background 0.2s;
  }

  .toggle-track.on { background: var(--ember); border-color: var(--ember); }

  .toggle-thumb {
    width: 22px; height: 22px;
    background: var(--cream);
    border-radius: 50%;
    position: absolute;
    top: 2px; left: 3px;
    transition: transform 0.2s;
  }

  .toggle-track.on .toggle-thumb { transform: translateX(24px); }

  .toggle-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.08em;
  }

  .earnings-strip {
    display: flex;
    border-bottom: 1px solid var(--rule);
  }

  .earnings-cell {
    flex: 1;
    padding: 20px 16px;
    border-right: 1px solid var(--rule);
    text-align: center;
  }

  .earnings-cell:last-child { border-right: none; }

  .earnings-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    color: var(--cream);
    display: block;
  }

  .earnings-val.green { color: #27AE60; }

  .earnings-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    color: var(--cream2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .request-card {
    margin: 20px;
    background: var(--bg2);
    border: 1px solid rgba(232,98,42,0.4);
    border-radius: 2px;
    overflow: hidden;
    animation: slideUp 0.3s ease;
  }

  .request-header {
    background: rgba(232,98,42,0.12);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(232,98,42,0.2);
  }

  .request-header-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--ember);
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .request-blink {
    width: 6px; height: 6px;
    background: var(--ember);
    border-radius: 50%;
    animation: blink 1s infinite;
  }

  .request-body { padding: 16px; }

  .request-rider-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }

  .request-detail {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--cream2);
    letter-spacing: 0.06em;
    line-height: 1.8;
    margin-bottom: 16px;
  }

  .request-actions {
    display: flex;
    gap: 10px;
  }

  .btn-accept {
    flex: 2;
    padding: 14px;
    background: #1E7E34;
    border: none;
    border-radius: 2px;
    color: var(--cream);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-accept:hover { background: #27AE60; }

  .btn-decline {
    flex: 1;
    padding: 14px;
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: 2px;
    color: var(--cream2);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-decline:hover { border-color: #C0392B; color: #C0392B; }

  .history-list {
    padding: 0 20px 32px;
  }

  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--rule2);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
  }

  .history-name { color: var(--cream); letter-spacing: 0.04em; }
  .history-route { color: var(--cream2); font-size: 9px; margin-top: 3px; letter-spacing: 0.06em; }
  .history-amt { color: #27AE60; font-size: 14px; font-weight: 700; }

  .bottom-pad { height: 40px; }

  /* STAR RATING */
  .stars { color: #F39C12; font-size: 11px; letter-spacing: 1px; }
`;

const DRIVERS = [
  { id: 1, name: "Big Dre", hood: "East Side", car: "2009 Impala", plate: "OHIO 762", distance: 0.4, eta: 3, price: 6, rating: 4.7, trips: 312, tags: ["AC works", "no questions"], online: true, color: "#C0392B" },
  { id: 2, name: "Mookie", hood: "Westwood", car: "2004 Crown Vic", plate: "FRD 1149", distance: 0.9, eta: 6, price: 5, rating: 4.5, trips: 189, tags: ["cold water", "aux cord"], online: true, color: "#2980B9" },
  { id: 3, name: "T-Bone", hood: "South Park", car: "2011 Charger", plate: "GHT 4421", distance: 1.2, eta: 8, price: 7, rating: 4.9, trips: 541, tags: ["fast", "cash or Cashapp"], online: true, color: "#8E44AD" },
  { id: 4, name: "Keisha", hood: "North End", car: "2015 Altima", plate: "NIS 9983", distance: 1.8, eta: 11, price: 8, rating: 4.8, trips: 227, tags: ["safe driver", "kids ok"], online: true, color: "#16A085" },
  { id: 5, name: "Peanut", hood: "The Bottoms", car: "2007 Tahoe", plate: "CHV 3310", distance: 2.3, eta: 14, price: 9, rating: 4.3, trips: 98, tags: ["big car", "cash only"], online: false, color: "#E67E22" },
  { id: 6, name: "Slim Ray", hood: "Hilltop", car: "2013 Camry", plate: "TOY 7621", distance: 3.1, eta: 18, price: 10, rating: 4.6, trips: 403, tags: ["music", "late nights"], online: true, color: "#2C3E50" },
];

const MAP_POSITIONS = [
  { top: "48%", left: "52%" },
  { top: "30%", left: "65%" },
  { top: "62%", left: "72%" },
  { top: "35%", left: "30%" },
  { top: "70%", left: "35%" },
  { top: "25%", left: "55%" },
];

const DRIVER_HISTORY = [
  { name: "Marcus T.", route: "Hilltop → Downtown", amt: "$8" },
  { name: "Shay W.", route: "East Side → Eastland", amt: "$6" },
  { name: "Darnell K.", route: "South Park → Airport", amt: "$14" },
  { name: "Trina M.", route: "Westwood → Mall", amt: "$7" },
];

function Stars({ rating }) {
  const full = Math.floor(rating);
  return <span className="stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

export default function FindAFiend() {
  const [screen, setScreen] = useState("splash"); // splash | home | confirm
  const [mode, setMode] = useState("rider"); // rider | driver
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [destination, setDestination] = useState("");
  const [pickup, setPickup] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [driverOnline, setDriverOnline] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    if (screen === "home" && mode === "driver") {
      const t = setTimeout(() => setShowRequest(true), 2200);
      return () => clearTimeout(t);
    }
    setShowRequest(false);
  }, [screen, mode]);

  const filteredDrivers = DRIVERS.filter(d => {
    if (filter === "online") return d.online;
    if (filter === "cheap") return d.price <= 6;
    if (filter === "close") return d.distance <= 1;
    return true;
  });

  function handleBookRide() {
    if (!destination || !pickup) return;
    setShowModal(false);
    setConfirmed(true);
    setScreen("confirm");
  }

  return (
    <>
      <style>{style}</style>
      <div className="app">
        {screen === "splash" && (
          <div className="splash">
            <div className="splash-hero">
              <div className="splash-grid" />
              <div className="splash-dot" />
              <div className="splash-title">
                find<span>a</span>fiend
              </div>
              <div className="splash-tld">FINDAFIEND.COM</div>
              <p className="splash-tagline">
                Community rides for the blocks Uber forgot. Real people, real cheap, real fast.
              </p>
            </div>

            <div className="splash-stats">
              <div className="splash-stat">
                <span className="splash-stat-num">847</span>
                <span className="splash-stat-label">Fiends Online</span>
              </div>
              <div className="splash-stat">
                <span className="splash-stat-num">$5</span>
                <span className="splash-stat-label">Avg Ride</span>
              </div>
              <div className="splash-stat">
                <span className="splash-stat-num">4 min</span>
                <span className="splash-stat-label">Avg ETA</span>
              </div>
            </div>

            <div className="splash-actions">
              <button className="btn-primary" onClick={() => { setMode("rider"); setScreen("home"); }}>
                I NEED A RIDE
              </button>
              <button className="btn-secondary" onClick={() => { setMode("driver"); setScreen("home"); }}>
                I GOT A CAR — LET'S GET IT
              </button>
            </div>
          </div>
        )}

        {screen === "home" && (
          <>
            {/* TOP BAR */}
            <div className="topbar">
              <div className="topbar-logo">find<span>a</span>fiend</div>
              <div className="topbar-mode">
                <button className={`mode-btn ${mode === "rider" ? "active" : ""}`} onClick={() => setMode("rider")}>RIDER</button>
                <button className={`mode-btn ${mode === "driver" ? "active" : ""}`} onClick={() => setMode("driver")}>DRIVER</button>
              </div>
              <div className="topbar-loc">
                <div className="loc-dot" />
                LIVE
              </div>
            </div>

            {/* MAP */}
            <div className="map-strip">
              <div className="map-grid" />
              {/* SVG roads */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(242,237,228,0.06)" strokeWidth="8" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(242,237,228,0.06)" strokeWidth="8" />
                <line x1="0" y1="30%" x2="100%" y2="60%" stroke="rgba(242,237,228,0.04)" strokeWidth="5" />
                <line x1="20%" y1="0" x2="80%" y2="100%" stroke="rgba(242,237,228,0.04)" strokeWidth="5" />
              </svg>
              {/* radius ring */}
              <div className="map-radius" />
              {/* you */}
              <div className="map-you" />
              {/* drivers */}
              {DRIVERS.filter(d => d.online).map((d, i) => (
                <div
                  key={d.id}
                  className="map-driver-dot"
                  style={{ top: MAP_POSITIONS[i].top, left: MAP_POSITIONS[i].left, background: d.color }}
                  onClick={() => { setSelectedDriver(d); setShowModal(true); }}
                  title={d.name}
                />
              ))}
              <div className="map-label">100 MI RADIUS · LIVE</div>
            </div>

            {/* RIDER MODE */}
            {mode === "rider" && (
              <>
                <div className="section-header">
                  <div className="section-title">FIENDS NEARBY</div>
                  <div className="section-count">{filteredDrivers.filter(d => d.online).length} ONLINE</div>
                </div>

                <div className="filters">
                  {["all", "online", "cheap", "close"].map(f => (
                    <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                      {f === "all" ? "ALL" : f === "online" ? "🟢 ONLINE" : f === "cheap" ? "💸 CHEAPEST" : "📍 CLOSEST"}
                    </button>
                  ))}
                </div>

                <div className="driver-list">
                  {filteredDrivers.map((d, i) => (
                    <div
                      key={d.id}
                      className="driver-card"
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => { if (d.online) { setSelectedDriver(d); setShowModal(true); } }}
                    >
                      <div className="driver-card-top">
                        <div className="driver-avatar" style={{ background: d.color }}>
                          {d.name[0]}
                          {d.online && <div className="online-badge" />}
                        </div>
                        <div className="driver-info">
                          <div className="driver-name">{d.name}</div>
                          <div className="driver-hood">{d.hood}</div>
                          <div className="driver-car">{d.car} · {d.plate}</div>
                        </div>
                        <div className="driver-price-col">
                          <div className="driver-price">${d.price}</div>
                          <div className="driver-price-label">FLAT RATE</div>
                        </div>
                      </div>

                      <div className="driver-card-mid">
                        <div className="driver-stat">
                          <span className="driver-stat-icon">📍</span>
                          {d.distance} mi
                        </div>
                        <div className="driver-stat">
                          <span className="driver-stat-icon">⏱</span>
                          {d.eta} min
                        </div>
                        <div className="driver-stat">
                          <Stars rating={d.rating} /> {d.rating}
                        </div>
                        <div className="driver-stat">
                          {d.trips} rides
                        </div>
                      </div>

                      <div className="driver-tags">
                        {d.tags.map(t => <span key={t} className="driver-tag">{t}</span>)}
                      </div>

                      {!d.online && (
                        <div className="driver-offline">
                          <div className="driver-offline-label">OFFLINE</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bottom-pad" />
              </>
            )}

            {/* DRIVER MODE */}
            {mode === "driver" && (
              <div className="driver-mode-screen">
                <div className="driver-status-bar">
                  <div className="driver-toggle" onClick={() => setDriverOnline(!driverOnline)}>
                    <div className={`toggle-track ${driverOnline ? "on" : ""}`}>
                      <div className="toggle-thumb" />
                    </div>
                    <div className="toggle-label" style={{ color: driverOnline ? "var(--ember)" : "var(--cream2)" }}>
                      {driverOnline ? "YOU'RE LIVE" : "GO ONLINE"}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--cream2)", letterSpacing: "0.08em" }}>
                    {driverOnline ? "🟢 TAKING RIDES" : "⚫ OFFLINE"}
                  </div>
                </div>

                <div className="earnings-strip">
                  <div className="earnings-cell">
                    <span className="earnings-val green">$43</span>
                    <div className="earnings-label">TODAY</div>
                  </div>
                  <div className="earnings-cell">
                    <span className="earnings-val">8</span>
                    <div className="earnings-label">RIDES</div>
                  </div>
                  <div className="earnings-cell">
                    <span className="earnings-val">4.8</span>
                    <div className="earnings-label">RATING</div>
                  </div>
                </div>

                {driverOnline && showRequest && (
                  <div className="request-card">
                    <div className="request-header">
                      <div className="request-header-label">
                        <div className="request-blink" />
                        NEW RIDE REQUEST
                      </div>
                      <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "var(--ember)" }}>0.6 mi away</div>
                    </div>
                    <div className="request-body">
                      <div className="request-rider-name">Marcus T.</div>
                      <div className="request-detail">
                        PICKUP: 1420 Broad St — East Side<br />
                        DROP: Downtown Transit Hub<br />
                        DISTANCE: ~3.2 mi · EST. $8 CASH
                      </div>
                      <div className="request-actions">
                        <button className="btn-accept" onClick={() => setShowRequest(false)}>✓ ACCEPT</button>
                        <button className="btn-decline" onClick={() => setShowRequest(false)}>SKIP</button>
                      </div>
                    </div>
                  </div>
                )}

                {!driverOnline && (
                  <div style={{ padding: "32px 20px", textAlign: "center" }}>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: "0.08em", color: "var(--cream2)", marginBottom: 8 }}>YOU'RE OFFLINE</div>
                    <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--cream2)", lineHeight: 1.8, letterSpacing: "0.06em" }}>
                      Toggle online to start<br />receiving ride requests
                    </div>
                  </div>
                )}

                <div className="section-header" style={{ marginTop: 8 }}>
                  <div className="section-title">RECENT RIDES</div>
                </div>

                <div className="history-list">
                  {DRIVER_HISTORY.map((h, i) => (
                    <div key={i} className="history-item">
                      <div>
                        <div className="history-name">{h.name}</div>
                        <div className="history-route">{h.route}</div>
                      </div>
                      <div className="history-amt">{h.amt}</div>
                    </div>
                  ))}
                </div>
                <div className="bottom-pad" />
              </div>
            )}
          </>
        )}

        {/* CONFIRM SCREEN */}
        {screen === "confirm" && selectedDriver && (
          <div className="confirm-screen">
            <div className="topbar">
              <div className="topbar-logo">find<span>a</span>fiend</div>
              <button
                onClick={() => { setScreen("home"); setConfirmed(false); setDestination(""); setPickup(""); }}
                style={{ background: "none", border: "1px solid var(--rule)", color: "var(--cream2)", fontFamily: "Space Mono", fontSize: 9, letterSpacing: "0.08em", padding: "6px 12px", borderRadius: "2px", cursor: "pointer" }}
              >
                ← BACK
              </button>
            </div>

            <div className="confirm-body">
              <div className="confirm-icon">🚗</div>
              <div className="confirm-title">RIDE REQUESTED</div>
              <div className="confirm-sub">
                {selectedDriver.name} has been notified<br />
                ETA: {selectedDriver.eta} minutes · Cash on arrival
              </div>

              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-row-label">DRIVER</span>
                  <span className="confirm-row-val">{selectedDriver.name}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-row-label">VEHICLE</span>
                  <span className="confirm-row-val">{selectedDriver.car}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-row-label">PLATE</span>
                  <span className="confirm-row-val">{selectedDriver.plate}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-row-label">PICKUP</span>
                  <span className="confirm-row-val">{pickup || "Your location"}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-row-label">DROPOFF</span>
                  <span className="confirm-row-val">{destination}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-row-label">FARE</span>
                  <span className="confirm-row-val ember">${selectedDriver.price}</span>
                </div>
              </div>

              <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--cream2)", lineHeight: 1.8, letterSpacing: "0.06em", textAlign: "center", background: "rgba(232,98,42,0.06)", border: "1px solid rgba(232,98,42,0.2)", padding: "16px", borderRadius: "2px", width: "100%" }}>
                ⚠ CASH ONLY · PAY ON ARRIVAL<br />
                Confirm identity before getting in.<br />
                Stay safe out there.
              </div>
            </div>
          </div>
        )}

        {/* RIDE REQUEST MODAL */}
        {showModal && selectedDriver && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div className="modal-handle" />

              <div className="modal-driver-row">
                <div className="modal-avatar" style={{ background: selectedDriver.color }}>
                  {selectedDriver.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="modal-driver-name">{selectedDriver.name}</div>
                  <div className="modal-driver-sub">{selectedDriver.car} · {selectedDriver.plate}</div>
                  <div style={{ marginTop: 4 }}><Stars rating={selectedDriver.rating} /> <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--cream2)" }}>{selectedDriver.rating} · {selectedDriver.trips} rides</span></div>
                </div>
                <div className="modal-price-big">${selectedDriver.price}</div>
              </div>

              <div className="modal-row">
                <div className="modal-info-chip">
                  <div className="modal-chip-val">{selectedDriver.eta} min</div>
                  <div className="modal-chip-label">ETA</div>
                </div>
                <div className="modal-info-chip">
                  <div className="modal-chip-val">{selectedDriver.distance} mi</div>
                  <div className="modal-chip-label">AWAY</div>
                </div>
                <div className="modal-info-chip">
                  <div className="modal-chip-val" style={{ color: "#27AE60" }}>LIVE</div>
                  <div className="modal-chip-label">STATUS</div>
                </div>
              </div>

              <div className="modal-field">
                <span className="modal-label">Your Pickup Spot</span>
                <input className="modal-input" placeholder="Corner of MLK + Broad..." value={pickup} onChange={e => setPickup(e.target.value)} />
              </div>

              <div className="modal-field">
                <span className="modal-label">Where You Going?</span>
                <input className="modal-input" placeholder="Dollar General on Parsons..." value={destination} onChange={e => setDestination(e.target.value)} />
              </div>

              <div className="modal-notes">
                <div className="modal-notes-text">
                  💬 Driver tags: {selectedDriver.tags.join(" · ")}<br />
                  Hood: {selectedDriver.hood} · Cash on arrival
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ opacity: destination && pickup ? 1 : 0.5 }}
                onClick={handleBookRide}
              >
                REQUEST {selectedDriver.name.toUpperCase()} — ${selectedDriver.price} CASH
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}