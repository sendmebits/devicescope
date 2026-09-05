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

function locationLabel(cf) {
  return [cf?.city, cf?.region, cf?.country].filter(Boolean).join(", ") || "Unknown location";
}

function updateHistory(request, current) {
  const prior = readCookie(request, HISTORY_COOKIE);
  const history = Array.isArray(prior) ? prior.filter((item) => item && typeof item.i === "string") : [];
  const existing = history.find((item) => item.i === current.ip);
  const now = Date.now();
  const next = { i: current.ip, t: now, f: existing?.f || now, n: Math.min((existing?.n || 0) + 1, 9999), l: current.location };
  return [next, ...history.filter((item) => item.i !== current.ip)].sort((a, b) => b.t - a.t).slice(0, MAX_HISTORY);
}

function buildPage(request) {
  const cf = request.cf || {};
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const current = {
    ip: request.headers.get("cf-connecting-ip") || forwarded || "Unavailable",
    location: locationLabel(cf), city: cf.city || null, region: cf.region || null, regionCode: cf.regionCode || null,
    country: cf.country || null, continent: cf.continent || null, postalCode: cf.postalCode || null, timezone: cf.timezone || null,
    latitude: cf.latitude || null, longitude: cf.longitude || null, asn: cf.asn || null, organization: cf.asOrganization || null,
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
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar"><div class="brand"><div class="mark" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M16.5 3.8 20.2 7.5M18.2 3.8h-1.7v1.7M20.2 5.8V7.5h-1.7"/></svg></div><div><div class="brand-title">DeviceScope</div><div class="brand-sub">What this site can see</div></div></div><div class="live"><span class="pulse"></span>Live</div></header>
    <section class="hero" aria-labelledby="ip-title"><div class="eyebrow" id="ip-title">Your public IP address</div><div class="ip-row"><div class="ip" id="current-ip">${escapeHtml(current.ip)}</div><button class="icon-btn" id="copy-ip" type="button" aria-label="Copy IP address" title="Copy IP address"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></svg></button></div><div class="hero-meta"><span>${escapeHtml(current.location)}</span><span class="dot">•</span><span>${escapeHtml(current.organization || "Network provider unavailable")}</span></div></section>
    <div class="grid">
      <section class="card" aria-labelledby="connection-title"><div class="card-head"><h2 class="card-title" id="connection-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12.55a11 11 0 0 1 14.08 0M8.5 16.05a6 6 0 0 1 7 0M12 20h.01M1.5 9a16 16 0 0 1 21 0"/></svg>Connection</h2><span class="source">Server-observed</span></div><dl class="facts" id="connection-facts"></dl></section>
      <section class="card" aria-labelledby="device-title"><div class="card-head"><h2 class="card-title" id="device-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>Device & browser</h2><span class="source">Browser-reported</span></div><dl class="facts" id="device-facts"><div class="fact"><dt>Detecting</dt><dd class="skeleton">Reading this browser…</dd></div></dl></section>
      <section class="card span-2" aria-labelledby="location-title"><div class="card-head"><h2 class="card-title" id="location-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Location</h2><span class="source">Permission-controlled</span></div><div class="location-body"><div class="location-callout"><p class="location-copy"><strong>Approximate:</strong> ${escapeHtml(current.location)}. This comes from your network connection and may only identify a nearby city. Precise location stays in this browser and is never sent back to the server.</p><button class="button primary" id="location-button" type="button">Use precise location</button><div class="precise" id="precise-location" aria-live="polite"></div></div></div></section>
      <section class="card span-2" aria-labelledby="history-title"><div class="card-head"><h2 class="card-title" id="history-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>Recent IP history</h2><button class="button danger" id="clear-history" type="button">Clear</button></div><ul class="history-list" id="history-list"></ul></section>
      <details class="card span-2"><summary>Technical details <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary><dl class="facts" id="technical-facts"></dl></details>
    </div>
    <p class="privacy-note">Recent IPs are kept only in a cookie on this device for one year. Clearing Safari website data also removes them.</p>
  </main><div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script>
    const DATA=${payload};const $=s=>document.querySelector(s);const text=(v,f="Unavailable")=>v===null||v===undefined||v===""?f:String(v);const yesNo=v=>v?"Yes":"No";
    function escapeText(v){const d=document.createElement("div");d.textContent=String(v);return d.innerHTML}function fact(l,v){return '<div class="fact"><dt>'+escapeText(l)+'</dt><dd>'+escapeText(text(v))+'</dd></div>'}function toast(m){const e=$("#toast");e.textContent=m;e.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>e.classList.remove("show"),1800)}
    function formatTime(t){try{return new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(t))}catch{return new Date(t).toLocaleString()}}
    const c=DATA.current,nav=navigator,connection=nav.connection||nav.mozConnection||nav.webkitConnection;
    $("#connection-facts").innerHTML=[["Provider",c.organization],["ASN",c.asn?"AS"+c.asn:null],["Approx. location",c.location],["Edge region",c.colo],["HTTP protocol",c.protocol],["TLS",c.tlsVersion],["Connection type",connection?.effectiveType?.toUpperCase()],["Estimated downlink",connection?.downlink?connection.downlink+" Mbps":null],["Estimated latency",connection?.rtt?connection.rtt+" ms":null],["Data saver",connection?.saveData===undefined?null:yesNo(connection.saveData)]].map(x=>fact(x[0],x[1])).join("");
    const standalone=window.matchMedia?.("(display-mode: standalone)").matches||nav.standalone===true;
    $("#device-facts").innerHTML=[["Platform",nav.userAgentData?.platform||nav.platform],["Language",nav.language],["Time zone",Intl.DateTimeFormat().resolvedOptions().timeZone],["Screen",screen.width+" × "+screen.height+" CSS px"],["Viewport",innerWidth+" × "+innerHeight+" CSS px"],["Pixel density",devicePixelRatio+"×"],["Touch points",nav.maxTouchPoints],["CPU threads",nav.hardwareConcurrency],["Memory",nav.deviceMemory?nav.deviceMemory+" GB (approx.)":null],["Standalone app",yesNo(standalone)]].map(x=>fact(x[0],x[1])).join("");
    const orientation=screen.orientation?.type||(innerWidth>innerHeight?"Landscape":"Portrait");
    $("#technical-facts").innerHTML=[["User agent",nav.userAgent],["Browser vendor",nav.vendor],["Languages",nav.languages?.join(", ")],["Accept-Language",c.acceptLanguage],["Colour depth",screen.colorDepth+" bit"],["Orientation",orientation],["Cookies enabled",yesNo(nav.cookieEnabled)],["Online",yesNo(nav.onLine)],["Do Not Track",nav.doNotTrack==="1"?"Enabled":nav.doNotTrack==="0"?"Disabled":"Not specified"],["Global Privacy Control",nav.globalPrivacyControl===undefined?"Not reported":yesNo(nav.globalPrivacyControl)],["Latitude (network)",c.latitude],["Longitude (network)",c.longitude],["Postal code (network)",c.postalCode],["Region code",c.regionCode],["Country / continent",[c.country,c.continent].filter(Boolean).join(" / ")],["TLS cipher",c.tlsCipher]].map(x=>fact(x[0],x[1])).join("");
    $("#history-list").innerHTML=DATA.history.map((item,index)=>'<li class="history-item"><span class="history-num">'+(index===0?"NOW":String(index+1).padStart(2,"0"))+'</span><div><div class="history-ip">'+escapeText(item.i)+'</div><div class="history-place">'+escapeText(item.l||"Unknown location")+(item.n>1?" · "+item.n+" visits":"")+'</div></div><time class="history-time" datetime="'+new Date(item.t).toISOString()+'">'+escapeText(formatTime(item.t))+'</time></li>').join("");
    $("#copy-ip").addEventListener("click",async()=>{try{await nav.clipboard.writeText(c.ip);toast("IP address copied")}catch{const a=document.createElement("textarea");a.value=c.ip;document.body.append(a);a.select();document.execCommand("copy");a.remove();toast("IP address copied")}});
    $("#clear-history").addEventListener("click",()=>{document.cookie="${HISTORY_COOKIE}=; Max-Age=0; Path=/; Secure; SameSite=Lax";location.reload()});
    $("#location-button").addEventListener("click",()=>{const b=$("#location-button"),o=$("#precise-location");if(!nav.geolocation){o.className="precise show";o.textContent="Precise location is not supported by this browser.";return}b.disabled=true;b.textContent="Requesting permission…";nav.geolocation.getCurrentPosition(p=>{const lat=p.coords.latitude.toFixed(6),lon=p.coords.longitude.toFixed(6);o.className="precise show";o.innerHTML='<strong>'+lat+', '+lon+'</strong><div class="accuracy">Accurate to about '+Math.round(p.coords.accuracy)+' metres · coordinates remain on this page</div>';b.textContent="Location found"},e=>{const m={1:"Location permission was not allowed.",2:"Your location could not be determined.",3:"The location request timed out."};o.className="precise show";o.textContent=m[e.code]||"Location could not be retrieved.";b.disabled=false;b.textContent="Try precise location again"},{enableHighAccuracy:true,timeout:12000,maximumAge:30000})});
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
      "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "permissions-policy": "geolocation=(self), camera=(), microphone=()", "referrer-policy": "no-referrer", "x-content-type-options": "nosniff",
      "set-cookie": "${HISTORY_COOKIE}=" + encodeURIComponent(JSON.stringify(history)) + "; Max-Age=31536000; Path=/; Secure; SameSite=Lax",
    }});
  },
};
