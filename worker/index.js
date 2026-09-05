const HISTORY_COOKIE = "devicescope_history";
const MAX_HISTORY = 6;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");
}

function readCookie(request, name) {
  const cookie = request.headers.get("cookie") || "";
  const pair = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(name + "="));
  if (!pair) return null;
  try { return JSON.parse(decodeURIComponent(pair.slice(name.length + 1))); } catch { return null; }
}

function validIp(value) {
  if (typeof value !== "string" || value.length > 45) return false;
  if (/^(?:[0-9]{1,3}[.]){3}[0-9]{1,3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  if (!value.includes(":") || !/^[a-fA-F0-9:]+$/.test(value)) return false;
  try { return new URL("https://[" + value + "]/").hostname.startsWith("["); } catch { return false; }
}

function locationLabel(cf) {
  return [cf?.city, cf?.region, cf?.country].filter(Boolean).join(", ") || "Unknown location";
}

function updateHistory(request, current) {
  const prior = readCookie(request, HISTORY_COOKIE);
  const history = Array.isArray(prior) ? prior.filter((item) =>
    item && validIp(item.i) && Number.isFinite(item.t) && item.t > Date.now() - 31536000000
  ).slice(0, MAX_HISTORY).map((item) => ({
    i: item.i, t: item.t, f: Number.isFinite(item.f) ? item.f : item.t,
    n: Number.isFinite(item.n) ? Math.max(1, Math.min(Math.floor(item.n), 9999)) : 1,
    l: typeof item.l === "string" ? item.l.slice(0, 100) : "Unknown location",
  })) : [];
  if (!validIp(current.ip)) return history;
  const existing = history.find((item) => item.i === current.ip);
  const now = Date.now();
  const next = { i: current.ip, t: now, f: existing?.f || now, n: Math.min((existing?.n || 0) + 1, 9999), l: current.location === "Unknown location" ? (existing?.l || current.location) : current.location };
  const result = [next, ...history.filter((item) => item.i !== current.ip)].sort((a, b) => b.t - a.t).slice(0, MAX_HISTORY);
  while (encodeURIComponent(JSON.stringify(result)).length > 3500 && result.length > 1) result.pop();
  return result;
}

function buildPage(request) {
  const cf = request.cf || {};
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const current = {
    ip: [request.headers.get("cf-connecting-ip"), forwarded].find(validIp) || "Unavailable",
    location: locationLabel(cf), city: cf.city || null, region: cf.region || null, regionCode: cf.regionCode || null,
    country: cf.country || null, continent: cf.continent || null, postalCode: cf.postalCode || null, timezone: cf.timezone || null,
    latitude: cf.latitude ?? null, longitude: cf.longitude ?? null, asn: cf.asn || null, organization: cf.asOrganization || null,
    colo: cf.colo || null, protocol: cf.httpProtocol || null, tlsVersion: cf.tlsVersion || null, tlsCipher: cf.tlsCipher || null,
    userAgent: request.headers.get("user-agent") || "Unavailable", acceptLanguage: request.headers.get("accept-language") || null,
    requestedAt: Date.now(),
  };
  const history = updateHistory(request, current);
  const payload = safeJson({ current, history });

  return { html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#07111f">
  <meta name="color-scheme" content="dark">
  <meta name="description" content="See the IP address, connection, browser, device, display, and location information visible to a website.">
  <title>DeviceScope · Connection details</title>
  <style>
    :root { color-scheme:dark; --bg:#050b13; --panel:rgba(13,25,40,.76); --line:rgba(143,184,218,.14); --line2:rgba(143,184,218,.25); --text:#f2f8ff; --muted:#93a9bd; --cyan:#59e1ff; --cyan-soft:rgba(89,225,255,.12); --lime:#adffb1; --danger:#ffb4b4; --radius:1.15rem; font-family:ui-rounded,"SF Pro Rounded",-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif; font-synthesis:none; -webkit-text-size-adjust:100%; text-rendering:optimizeLegibility; }
    *{box-sizing:border-box} html{min-width:320px;background:var(--bg)} body{min-height:100vh;min-height:100dvh;margin:0;color:var(--text);background:radial-gradient(circle at 85% 0%,rgba(30,129,186,.22),transparent 32rem),radial-gradient(circle at 0% 40%,rgba(52,216,185,.07),transparent 28rem),var(--bg)}
    button{font:inherit} button,summary{-webkit-tap-highlight-color:transparent}.shell{width:min(100%,74rem);margin:0 auto;padding:max(1rem,env(safe-area-inset-top)) max(1rem,env(safe-area-inset-right)) max(2rem,env(safe-area-inset-bottom)) max(1rem,env(safe-area-inset-left))}
    .topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem}.brand{display:flex;align-items:center;gap:.7rem;min-width:0}.mark{width:2.35rem;height:2.35rem;flex:0 0 auto;display:grid;place-items:center;border:1px solid rgba(89,225,255,.3);border-radius:.78rem;color:var(--cyan);background:linear-gradient(145deg,rgba(89,225,255,.18),rgba(89,225,255,.03));box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 .5rem 2rem rgba(0,0,0,.25)}
    .brand-title{font-size:1.05rem;font-weight:720;letter-spacing:-.02em}.brand-sub{margin-top:.1rem;color:var(--muted);font-size:.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.live{display:inline-flex;align-items:center;gap:.42rem;color:var(--lime);font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.pulse{width:.48rem;height:.48rem;border-radius:50%;background:var(--lime);box-shadow:0 0 0 .22rem rgba(173,255,177,.1),0 0 1rem rgba(173,255,177,.45)}
    .hero{position:relative;overflow:hidden;border:1px solid var(--line2);border-radius:1.55rem;background:linear-gradient(145deg,rgba(18,39,60,.92),rgba(8,17,29,.92));box-shadow:0 1.6rem 5rem rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.04);padding:1.35rem}.hero:after{content:"";position:absolute;width:13rem;height:13rem;right:-6rem;top:-6rem;border-radius:50%;background:rgba(89,225,255,.1);pointer-events:none}.eyebrow{position:relative;color:var(--muted);font-size:.76rem;font-weight:720;letter-spacing:.11em;text-transform:uppercase}.ip-row{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:.8rem;margin:.55rem 0 .8rem}.ip{min-width:0;font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:clamp(1.7rem,8.4vw,3.9rem);font-weight:760;letter-spacing:-.055em;line-height:1.08;overflow-wrap:anywhere}
    .icon-btn{width:2.8rem;height:2.8rem;flex:0 0 auto;display:grid;place-items:center;border:1px solid var(--line2);border-radius:.9rem;color:var(--cyan);background:rgba(255,255,255,.035);cursor:pointer}.icon-btn:active{transform:scale(.96)}.icon-btn:focus-visible,.button:focus-visible,summary:focus-visible{outline:3px solid rgba(89,225,255,.45);outline-offset:2px}.hero-meta{position:relative;display:flex;flex-wrap:wrap;gap:.45rem .65rem;align-items:center;color:#c8d8e6;font-size:.9rem}.dot{color:#476176}
    .grid{display:grid;gap:.85rem;margin-top:.85rem}.card{border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 rgba(255,255,255,.025);overflow:hidden}.card-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1rem .8rem}.card-title{display:flex;align-items:center;gap:.65rem;margin:0;font-size:1rem;letter-spacing:-.015em}.card-icon{width:1.2rem;height:1.2rem;color:var(--cyan)}.source{color:var(--muted);font-size:.72rem;white-space:nowrap}.facts{margin:0;padding:0 .95rem .9rem}.fact{display:grid;grid-template-columns:minmax(7.1rem,.8fr) minmax(0,1.2fr);gap:.75rem;align-items:start;padding:.72rem .1rem;border-top:1px solid var(--line)}.fact dt{color:var(--muted);font-size:.85rem;line-height:1.4}.fact dd{margin:0;color:#e8f3fc;font-size:.87rem;font-weight:590;text-align:right;line-height:1.4;overflow-wrap:anywhere}
    .history-list{list-style:none;margin:0;padding:0 .95rem .9rem}.history-item{display:grid;grid-template-columns:2.3rem minmax(0,1fr) auto;gap:.7rem;align-items:center;padding:.78rem .1rem;border-top:1px solid var(--line)}.history-num{width:2rem;height:2rem;display:grid;place-items:center;color:var(--cyan);background:var(--cyan-soft);border-radius:.65rem;font-size:.67rem;font-weight:760}.history-ip{font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:.85rem;font-weight:680;overflow-wrap:anywhere}.history-place{margin-top:.18rem;color:var(--muted);font-size:.76rem}.history-time{color:var(--muted);font-size:.75rem;text-align:right;white-space:nowrap}
    .button{min-height:2.75rem;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:1px solid var(--line2);border-radius:.82rem;padding:.62rem .88rem;color:var(--text);background:rgba(255,255,255,.04);cursor:pointer;font-weight:670;font-size:.84rem}.button.primary{border-color:rgba(89,225,255,.34);color:#051018;background:linear-gradient(135deg,#7ce9ff,#64d6ff);box-shadow:0 .55rem 1.5rem rgba(46,192,231,.17)}.button.danger{color:var(--danger)}.button:disabled{opacity:.58;cursor:wait}.location-body{padding:0 .95rem .95rem}.location-callout{padding:1rem;border:1px solid var(--line);border-radius:.9rem;background:rgba(3,10,18,.32)}.location-copy{margin:0 0 .85rem;color:#c0d1df;font-size:.86rem;line-height:1.55}.precise{display:none;margin-top:.8rem}.precise.show{display:block}.accuracy{color:var(--muted);font-size:.76rem;margin-top:.3rem}
    details.card>summary{display:flex;align-items:center;justify-content:space-between;min-height:3.5rem;padding:0 1rem;cursor:pointer;list-style:none;font-weight:700}details.card>summary::-webkit-details-marker{display:none}.chevron{color:var(--muted);transition:transform .2s ease}details[open] .chevron{transform:rotate(180deg)}.privacy-note{margin:.85rem .1rem 0;color:#71899d;font-size:.76rem;line-height:1.5;text-align:center}.toast{position:fixed;z-index:20;left:50%;bottom:max(1rem,env(safe-area-inset-bottom));transform:translate(-50%,1rem);padding:.7rem .95rem;border:1px solid var(--line2);border-radius:.8rem;color:var(--text);background:#102337;box-shadow:0 .9rem 2.5rem rgba(0,0,0,.4);font-size:.84rem;opacity:0;pointer-events:none;transition:.2s ease}.toast.show{opacity:1;transform:translate(-50%,0)}.skeleton{color:var(--muted)!important;font-weight:520!important}
    @media(min-width:46rem){.shell{padding-top:2rem;padding-bottom:3rem}.topbar{margin-bottom:1.25rem}.hero{padding:1.8rem}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1rem}.span-2{grid-column:1/-1}.card-head{padding:1.15rem 1.15rem .85rem}.facts,.history-list,.location-body{padding-left:1.1rem;padding-right:1.1rem;padding-bottom:1.05rem}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition-duration:.01ms!important}}
    [hidden]{display:none!important}.card-note{margin:0 1rem 1rem;color:var(--muted);font-size:.875rem;line-height:1.5}.retry-wrap{padding:0 1rem}.retry-wrap:has(button:not([hidden])){padding-bottom:1rem}a{color:var(--cyan)}.fact dt,.fact dd,.button,.location-copy{font-size:1rem}.source,.brand-sub,.eyebrow,.privacy-note,.history-time,.accuracy{font-size:.8125rem}.history-ip,.history-place{font-size:.875rem}.history-num{font-size:.75rem}.card-head{flex-wrap:wrap}.history-time{white-space:normal;max-width:7rem}.fact{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}.hero:after{z-index:0}.hero>*{z-index:1}.location-copy{line-height:1.6}
    @media(max-width:360px){.history-item{grid-template-columns:2rem minmax(0,1fr)}.history-time{grid-column:2;text-align:left;max-width:none}}
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar"><div class="brand"><div class="mark" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M16.5 3.8 20.2 7.5M18.2 3.8h-1.7v1.7M20.2 5.8V7.5h-1.7"/></svg></div><div><div class="brand-title">DeviceScope</div><div class="brand-sub">What this site can see</div></div></div><div class="live"><span class="pulse"></span>This visit</div></header>
    <section class="hero" aria-labelledby="ip-title"><div class="eyebrow" id="ip-title">Your public IP address</div><div class="ip-row"><div class="ip" id="current-ip">${escapeHtml(current.ip)}</div><button class="icon-btn" id="copy-ip" type="button" aria-label="Copy IP address" title="Copy IP address"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></svg></button></div><div class="hero-meta" id="hero-meta"><span>${escapeHtml(current.location)}</span><span class="dot">•</span><span>${escapeHtml(current.organization || "Network provider unavailable")}</span></div></section>
    <div class="grid">
      <section class="card" aria-labelledby="connection-title"><div class="card-head"><h2 class="card-title" id="connection-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12.55a11 11 0 0 1 14.08 0M8.5 16.05a6 6 0 0 1 7 0M12 20h.01M1.5 9a16 16 0 0 1 21 0"/></svg>Connection</h2><span class="source" id="connection-source">This connection</span></div><dl class="facts" id="connection-facts"></dl><p class="card-note" id="network-note" role="status">Reading connection details…</p><div class="retry-wrap"><button class="button" id="retry-network" type="button" hidden>Retry IP lookup</button></div></section>
      <section class="card" aria-labelledby="device-title"><div class="card-head"><h2 class="card-title" id="device-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>Device & browser</h2><span class="source">Browser-reported</span></div><dl class="facts" id="device-facts"><div class="fact"><dt>Detecting</dt><dd class="skeleton">Reading this browser…</dd></div></dl></section>
      <section class="card span-2" aria-labelledby="location-title"><div class="card-head"><h2 class="card-title" id="location-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Location</h2><span class="source">Permission-controlled</span></div><div class="location-body"><div class="location-callout"><p class="location-copy" id="approximate-location"><strong>Approximate:</strong> ${escapeHtml(current.location)}. This comes from your network connection and may only identify a nearby city. Precise location stays in this browser and is never sent back to the server.</p><button class="button primary" id="location-button" type="button">Use precise location</button><div class="precise" id="precise-location" aria-live="polite"></div></div></div></section>
      <section class="card span-2" aria-labelledby="history-title"><div class="card-head"><h2 class="card-title" id="history-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>Recent IP history</h2><button class="button danger" id="clear-history" type="button">Clear</button></div><ul class="history-list" id="history-list"></ul></section>
      <details class="card span-2"><summary>Technical details <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary><dl class="facts" id="technical-facts"></dl><p class="card-note">Some details are deliberately not exposed by browsers. Exact device model, Wi-Fi name, MAC address, and private IP are not available to this page. Browser and OS labels are estimates from the user agent, which may be reduced or spoofed.</p></details>
    </div>
    <p class="privacy-note">Recent IP history is stored in a first-party cookie in this browser (up to one year), sent back to this site on visits, and not stored in an app database. Safari may remove it sooner. Missing provider/location details are looked up through <a href="https://ipwhois.io/documentation" target="_blank" rel="noopener noreferrer">ipwho.is</a> using the displayed IP; previous IPs and precise location are never sent to that service.</p>
  </main><div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script>
    const DATA=${payload};
    const $=s=>document.querySelector(s), nav=navigator, c=DATA.current;
    const COOKIE="devicescope_history";
    const text=(v,f="Not reported")=>v===null||v===undefined||v===""?f:String(v);
    const yesNo=v=>v?"Yes":"No";
    function escapeText(v){const d=document.createElement("div");d.textContent=String(v);return d.innerHTML}
    function fact(l,v){return '<div class="fact"><dt>'+escapeText(l)+'</dt><dd>'+escapeText(text(v))+'</dd></div>'}
    function facts(selector,rows){$(selector).innerHTML=rows.map(x=>fact(x[0],x[1])).join("")}
    function toast(m){const e=$("#toast");e.textContent=m;e.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>e.classList.remove("show"),2200)}
    function formatTime(t){return new Date(t).toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}
    const validIp=function validIp(value) {
  if (typeof value !== "string" || value.length > 45) return false;
  if (/^(?:[0-9]{1,3}[.]){3}[0-9]{1,3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  if (!value.includes(":") || !/^[a-fA-F0-9:]+$/.test(value)) return false;
  try { return new URL("https://[" + value + "]/").hostname.startsWith("["); } catch { return false; }
};
    const connection=nav.connection||nav.mozConnection||nav.webkitConnection;
    let lookupState="idle",lookupMessage="",lookupActive=false;
    let networkSource="Site request", historyCleared=false;
    const unavailableBrowser="Not exposed by this browser";
    const metadataMissing="Not passed through by hosting";
    function browserInfo(){
      const ua=nav.userAgent||"";
      const rules=[[/EdgiOS\\/([\\d.]+)/,"Edge"],[/Edg\\/([\\d.]+)/,"Edge"],[/CriOS\\/([\\d.]+)/,"Chrome"],[/FxiOS\\/([\\d.]+)/,"Firefox"],[/OPR\\/([\\d.]+)/,"Opera"],[/Chrome\\/([\\d.]+)/,"Chrome"],[/Firefox\\/([\\d.]+)/,"Firefox"],[/Version\\/([\\d.]+).*Safari/,"Safari"]];
      const found=rules.map(([r,name])=>{const m=ua.match(r);return m?name+" "+m[1]:null}).find(Boolean);
      let os="Not reported";
      const ios=ua.match(/(?:CPU (?:iPhone )?OS|iPhone OS) ([\\d_]+)/),android=ua.match(/Android ([\\d.]+)/),mac=ua.match(/Mac OS X ([\\d_]+)/);
      if(ios)os="iOS / iPadOS "+ios[1].replaceAll("_",".");
      else if(/Mac/.test(nav.platform)&&nav.maxTouchPoints>1)os="iPadOS (desktop user agent)";
      else if(android)os="Android "+android[1];
      else if(/Windows NT 10/.test(ua))os="Windows 10 / 11";
      else if(mac)os="macOS "+mac[1].replaceAll("_",".");
      else if(/Linux/.test(ua))os="Linux";
      return {browser:found||(/AppleWebKit/.test(ua)?"WebKit / in-app browser":"Not identified"),os};
    }
    function renderConnection(){
      const entry=performance.getEntriesByType?.("navigation")?.[0];
      const protocol=entry?.nextHopProtocol||null;
      const wait=entry?.responseStart>entry?.requestStart&&entry.requestStart>0?Math.round(entry.responseStart-entry.requestStart):null;
      const missing=lookupState==="loading"?"Looking up…":lookupState==="failed"?"Lookup unavailable":"Not in IP database";
      const rows=[
        ["Public IP version",validIp(c.ip)?(c.ip.includes(":")?"IPv6":"IPv4"):"Not detected"],
        ["Provider / network",c.organization||missing],["ASN",c.asn?String(c.asn).replace(/^AS/i,"AS").replace(/^(?!AS)/,"AS"):missing],
        ["Approx. location",c.location!=="Unknown location"?c.location:missing],
        ["Page transport",location.protocol==="https:"?"HTTPS":"HTTP"],
        ["HTTP protocol",protocol||c.protocol||unavailableBrowser],
        ["Page response wait",wait!==null?wait+" ms (includes server time)":"Not reported"],
      ];
      // Safari has no Network Information API. Do not make unsupported rows look like failed checks.
      if(connection){
        if(connection.type)rows.push(["Network type",connection.type]);
        if(connection.effectiveType)rows.push(["Effective speed class",connection.effectiveType.toUpperCase()]);
        if(Number.isFinite(connection.downlink))rows.push(["Browser downlink estimate",connection.downlink+" Mbps"]);
        if(Number.isFinite(connection.rtt))rows.push(["Browser latency estimate",connection.rtt+" ms"]);
        if(typeof connection.saveData==="boolean")rows.push(["Data saver preference",yesNo(connection.saveData)]);
      }
      facts("#connection-facts",rows);
      $("#connection-source").textContent=networkSource;
      $("#hero-meta").textContent=[c.location!=="Unknown location"?c.location:null,c.organization].filter(Boolean).join(" · ")||(lookupState==="loading"?"Looking up network location…":"Network details not yet available");
      $("#network-note").textContent=(lookupMessage?lookupMessage+" ":"")+(!connection?"This browser does not expose Wi-Fi/cellular type, downlink estimates, or data-saver status. ":"")+"IP details may describe a VPN or iCloud Private Relay exit, not your physical network. Page response wait is not a speed test.";
      $("#retry-network").hidden=lookupState!=="failed";
      $("#approximate-location").textContent="Approximate: "+(c.location!=="Unknown location"?c.location:(lookupState==="loading"?"looking up your IP…":"not determined"))+". IP-based location is an estimate, not GPS. A VPN or Private Relay can change it. Precise location requires permission and stays on this page.";
    }
    function renderDevice(){
      const info=browserInfo();
      const standalone=window.matchMedia("(display-mode: standalone)").matches||nav.standalone===true;
      facts("#device-facts",[
        ["Browser (reported)",info.browser],["OS (reported)",info.os],
        ["Platform",nav.userAgentData?.platform||nav.platform],["Language",nav.language],["Time zone",Intl.DateTimeFormat().resolvedOptions().timeZone],
        ["Screen",screen.width+" × "+screen.height+" CSS px"],["Viewport",innerWidth+" × "+innerHeight+" CSS px"],
        ["Pixel density",devicePixelRatio+"×"],["Touch points",nav.maxTouchPoints],
        ["CPU threads",nav.hardwareConcurrency??unavailableBrowser],["Memory",nav.deviceMemory?nav.deviceMemory+" GB (approx.)":unavailableBrowser],
        ["Standalone app",yesNo(standalone)]
      ]);
      facts("#technical-facts",[
        ["User agent",nav.userAgent],["Browser vendor",nav.vendor],["Languages",nav.languages?.join(", ")],["Accept-Language",c.acceptLanguage],
        ["Colour depth",screen.colorDepth+" bit"],["Orientation",screen.orientation?.type||(innerWidth>innerHeight?"Landscape":"Portrait")],
        ["Cookies enabled",yesNo(nav.cookieEnabled)],["Browser online signal",nav.onLine?"Online (not a connectivity test)":"Offline"],
        ["Do Not Track",nav.doNotTrack==="1"?"Enabled":nav.doNotTrack==="0"?"Disabled":"Not specified"],
        ["Global Privacy Control",nav.globalPrivacyControl===undefined?"Not reported":yesNo(nav.globalPrivacyControl)],
        ["Edge region",c.colo||metadataMissing],["TLS version",c.tlsVersion||metadataMissing],["TLS cipher",c.tlsCipher||metadataMissing],
        ["Latitude (IP estimate)",c.latitude??"Not in IP data"],["Longitude (IP estimate)",c.longitude??"Not in IP data"],
        ["Postal code (IP estimate)",c.postalCode||"Not in IP data"],["IP time zone",c.timezone||"Not in IP data"],
        ["Region code",c.regionCode||"Not in IP data"],["Country / continent",[c.country,c.continent].filter(Boolean).join(" / ")||"Not in IP data"],
        ["Network data source",networkSource]
      ]);
    }
    function renderHistory(){
      $("#history-list").innerHTML=DATA.history.length?DATA.history.map((item,index)=>'<li class="history-item"><span class="history-num">'+(item.i===c.ip?"NOW":String(index+1).padStart(2,"0"))+'</span><div><div class="history-ip">'+escapeText(item.i)+'</div><div class="history-place">'+escapeText(item.l||"Unknown location")+(item.n>1?" · "+item.n+" visits":"")+'</div></div><time class="history-time" datetime="'+new Date(item.t).toISOString()+'">'+escapeText(formatTime(item.t))+'</time></li>').join(""):'<li class="card-note">History cleared. A new entry is saved on your next visit.</li>';
      $("#clear-history").disabled=!DATA.history.length;
    }
    function persistHistory(){
      if(historyCleared)return;
      try{
        const value=encodeURIComponent(JSON.stringify(DATA.history));
        if(value.length>3500)throw new Error("Cookie too large");
        document.cookie=COOKIE+"="+value+"; Max-Age=31536000; Path=/; Secure; SameSite=Lax";
        if(!document.cookie.split(";").some(x=>x.trim().startsWith(COOKIE+"=")))toast("History cookie blocked by browser settings");
      }catch{toast("History could not be saved in this browser")}
    }
    async function lookupNetwork(){
      if(lookupActive)return;
      if(!validIp(c.ip)){lookupState="failed";lookupMessage="No valid visitor IP reached this site; an IP lookup cannot be performed.";renderConnection();return}
      lookupActive=true;lookupState="loading";lookupMessage="";renderConnection();
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),9000);
      try{
        const response=await fetch("https://ipwho.is/"+encodeURIComponent(c.ip),{signal:controller.signal,credentials:"omit",referrerPolicy:"no-referrer",cache:"no-store"});
        if(!response.ok)throw new Error(response.status===429?"The IP service is rate-limited. Try later.":"The IP lookup service could not be reached.");
        const result=await response.json();
        if(result.success!==true||!validIp(result.ip))throw new Error("The IP service has no details for this address.");
        const normalize=ip=>ip.includes(":")?new URL("https://["+ip+"]/").hostname:ip;
        if(normalize(result.ip)!==normalize(c.ip))throw new Error("IP lookup returned a different address; its details were not used.");
        const safe=value=>typeof value==="string"?value.slice(0,100):null;
        c.organization=c.organization||safe(result.connection?.isp)||safe(result.connection?.org);
        c.asn=c.asn||(Number.isSafeInteger(result.connection?.asn)?result.connection.asn:null);
        for(const [key,value]of Object.entries({city:result.city,region:result.region,regionCode:result.region_code,country:result.country_code,continent:result.continent_code,postalCode:result.postal,timezone:result.timezone?.id})){c[key]=c[key]||safe(value)}
        for(const key of ["latitude","longitude"]){if(c[key]===null&&Number.isFinite(result[key]))c[key]=result[key]}
        c.location=[c.city,c.region,c.country].filter(Boolean).join(", ")||"Unknown location";
        networkSource="IP lookup + browser";lookupState="done";lookupMessage="Provider and location: ipwho.is.";
        const existing=DATA.history.find(item=>item.i===c.ip);
        if(existing&&!historyCleared){existing.l=c.location.slice(0,100);persistHistory();renderHistory()}
      }catch(error){lookupState="failed";lookupMessage=error.name==="AbortError"?"IP lookup timed out; you can retry.":error.message==="Failed to fetch"?"IP lookup was blocked or could not be reached. You can retry.":error.message}
      finally{clearTimeout(timer);lookupActive=false;renderConnection();renderDevice()}
    }
    $("#copy-ip").addEventListener("click",async()=>{
      if(!validIp(c.ip)){toast("No IP address to copy");return}
      try{await nav.clipboard.writeText(c.ip);toast("IP address copied")}
      catch{
        const a=document.createElement("textarea");a.value=c.ip;a.readOnly=true;a.style.cssText="position:fixed;top:0;left:0;opacity:0;font-size:16px";document.body.append(a);
        a.focus();a.select();a.setSelectionRange(0,a.value.length);
        let copied=false;try{copied=document.execCommand("copy")}catch{}a.remove();toast(copied?"IP address copied":"Copy unavailable; select the IP address to copy");
      }
    });
    $("#clear-history").addEventListener("click",()=>{
      document.cookie=COOKIE+"=; Max-Age=0; Path=/; Secure; SameSite=Lax";
      // Clean up the incorrectly named cookie written by the first version.
      document.cookie="\\u0024{HISTORY_COOKIE}=; Max-Age=0; Path=/; Secure; SameSite=Lax";
      historyCleared=true;DATA.history=[];renderHistory();toast("IP history cleared");
    });
    $("#retry-network").addEventListener("click",lookupNetwork);
    $("#location-button").addEventListener("click",()=>{
      const b=$("#location-button"),o=$("#precise-location");
      if(!nav.geolocation){o.className="precise show";o.textContent="Precise location is not supported by this browser.";return}
      b.disabled=true;b.textContent="Finding your location…";
      nav.geolocation.getCurrentPosition(p=>{
        o.className="precise show";o.innerHTML="<strong>"+p.coords.latitude.toFixed(6)+", "+p.coords.longitude.toFixed(6)+'</strong><div class="accuracy">Accurate to about '+Math.round(p.coords.accuracy)+' metres · coordinates remain on this page</div>';
        b.disabled=false;b.textContent="Refresh precise location";
      },e=>{
        const messages={1:"Location permission was not allowed. You can change it in Safari’s website settings.",2:"Your location could not be determined.",3:"The location request timed out."};
        o.className="precise show";o.textContent=messages[e.code]||"Location could not be retrieved.";b.disabled=false;b.textContent="Try precise location again";
      },{enableHighAccuracy:true,timeout:12000,maximumAge:30000});
    });
    renderConnection();renderDevice();renderHistory();
    window.addEventListener("resize",renderDevice);
    window.addEventListener("online",()=>{renderConnection();renderDevice()});
    window.addEventListener("offline",()=>{renderConnection();renderDevice()});
    window.addEventListener("load",renderConnection);
    connection?.addEventListener?.("change",renderConnection);
    if(!c.organization||!c.asn||c.location==="Unknown location")lookupNetwork();
  </script>
</body></html>`, history };
}

export default {
  async fetch(request, env, ctx) {
    void env; void ctx;
    const url = new URL(request.url);
    if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 });
    if (url.pathname !== "/") return new Response("Not found", { status: 404 });
    const { html, history } = buildPage(request);
    return new Response(html, { headers: {
      "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store, max-age=0",
      "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://ipwho.is; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "permissions-policy": "geolocation=(self), camera=(), microphone=()", "referrer-policy": "no-referrer", "x-content-type-options": "nosniff",
      "set-cookie": HISTORY_COOKIE + "=" + encodeURIComponent(JSON.stringify(history)) + "; Max-Age=31536000; Path=/; Secure; SameSite=Lax",
    }});
  },
};
