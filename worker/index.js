const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#07111f"/>
  <g fill="none" stroke="#59e1ff" stroke-width="5" stroke-linecap="round">
    <path d="M32 12a20 20 0 1 0 20 20"/>
    <path d="M32 23a9 9 0 1 0 9 9"/>
    <path d="m32 32 17-17"/>
  </g>
  <circle cx="49" cy="15" r="5" fill="#adffb1"/>
</svg>`;
const TOUCH_ICON_BASE64 = "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";

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
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3">
  <link rel="icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png?v=3">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3">
  <title>DeviceScope · Connection details</title>
  <style>
    :root { color-scheme:dark; --bg:#050b13; --panel:rgba(13,25,40,.76); --line:rgba(143,184,218,.14); --line2:rgba(143,184,218,.25); --text:#f2f8ff; --muted:#93a9bd; --cyan:#59e1ff; --cyan-soft:rgba(89,225,255,.12); --lime:#adffb1; --danger:#ffb4b4; --radius:1.15rem; font-family:ui-rounded,"SF Pro Rounded",-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif; font-synthesis:none; -webkit-text-size-adjust:100%; text-rendering:optimizeLegibility; }
    *{box-sizing:border-box} html{min-width:320px;background:var(--bg)} body{min-height:100vh;min-height:100dvh;margin:0;color:var(--text);background:radial-gradient(circle at 85% 0%,rgba(30,129,186,.22),transparent 32rem),radial-gradient(circle at 0% 40%,rgba(52,216,185,.07),transparent 28rem),var(--bg)}
    button{font:inherit} button,summary{-webkit-tap-highlight-color:transparent}.shell{width:min(100%,74rem);margin:0 auto;padding:max(1rem,env(safe-area-inset-top)) max(1rem,env(safe-area-inset-right)) max(2rem,env(safe-area-inset-bottom)) max(1rem,env(safe-area-inset-left))}
    .topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem}.brand{display:flex;align-items:center;gap:.7rem;min-width:0}.mark{width:2.35rem;height:2.35rem;flex:0 0 auto;display:grid;place-items:center;border:1px solid rgba(89,225,255,.3);border-radius:.78rem;color:var(--cyan);background:linear-gradient(145deg,rgba(89,225,255,.18),rgba(89,225,255,.03));box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 .5rem 2rem rgba(0,0,0,.25)}
    .brand-title{font-size:1.05rem;font-weight:720;letter-spacing:-.02em}.brand-sub{margin-top:.1rem;color:var(--muted);font-size:.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.live{display:inline-flex;align-items:center;gap:.42rem;color:var(--lime);font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.pulse{width:.48rem;height:.48rem;border-radius:50%;background:var(--lime);box-shadow:0 0 0 .22rem rgba(173,255,177,.1),0 0 1rem rgba(173,255,177,.45)}
    .hero{position:relative;overflow:hidden;border:1px solid var(--line2);border-radius:1.55rem;background:linear-gradient(145deg,rgba(18,39,60,.92),rgba(8,17,29,.92));box-shadow:0 1.6rem 5rem rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.04);padding:1.35rem}.hero:after{content:"";position:absolute;width:13rem;height:13rem;right:-6rem;top:-6rem;border-radius:50%;background:rgba(89,225,255,.1);pointer-events:none}.eyebrow{position:relative;color:var(--muted);font-size:.76rem;font-weight:720;letter-spacing:.11em;text-transform:uppercase}.ip-row{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:.8rem;margin:.55rem 0 .8rem}.ip{min-width:0;font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:clamp(1.7rem,8.4vw,3.9rem);font-weight:760;letter-spacing:-.055em;line-height:1.08;overflow-wrap:anywhere}
    .button:focus-visible,summary:focus-visible{outline:3px solid rgba(89,225,255,.45);outline-offset:2px}.hero-meta{position:relative;display:flex;flex-wrap:wrap;gap:.45rem .65rem;align-items:center;color:#c8d8e6;font-size:.9rem}.dot{color:#476176}
    .grid{display:grid;gap:.85rem;margin-top:.85rem}.card{border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 rgba(255,255,255,.025);overflow:hidden}.card-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1rem .8rem}.card-title{display:flex;align-items:center;gap:.65rem;margin:0;font-size:1rem;letter-spacing:-.015em}.card-icon{width:1.2rem;height:1.2rem;color:var(--cyan)}.source{color:var(--muted);font-size:.72rem;white-space:nowrap}.facts{margin:0;padding:0 .95rem .9rem}.fact{display:grid;grid-template-columns:minmax(7.1rem,.8fr) minmax(0,1.2fr);gap:.75rem;align-items:start;padding:.72rem .1rem;border-top:1px solid var(--line)}.fact dt{color:var(--muted);font-size:.85rem;line-height:1.4}.fact dd{margin:0;color:#e8f3fc;font-size:.87rem;font-weight:590;text-align:right;line-height:1.4;overflow-wrap:anywhere}
    .history-list{list-style:none;margin:0;padding:0 .95rem .9rem}.history-item{display:grid;grid-template-columns:2.3rem minmax(0,1fr) auto;gap:.7rem;align-items:center;padding:.78rem .1rem;border-top:1px solid var(--line)}.history-num{width:2rem;height:2rem;display:grid;place-items:center;color:var(--cyan);background:var(--cyan-soft);border-radius:.65rem;font-size:.67rem;font-weight:760}.history-ip{font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:.85rem;font-weight:680;overflow-wrap:anywhere}.history-place{margin-top:.18rem;color:var(--muted);font-size:.76rem}.history-time{color:var(--muted);font-size:.75rem;text-align:right;white-space:nowrap}
    .button{min-height:2.75rem;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:1px solid var(--line2);border-radius:.82rem;padding:.62rem .88rem;color:var(--text);background:rgba(255,255,255,.04);cursor:pointer;font-weight:670;font-size:.84rem}.button.primary{border-color:rgba(89,225,255,.34);color:#051018;background:linear-gradient(135deg,#7ce9ff,#64d6ff);box-shadow:0 .55rem 1.5rem rgba(46,192,231,.17)}.button.danger{color:var(--danger)}.button:disabled{opacity:.58;cursor:wait}.location-body{padding:0}.location-callout{background:rgba(3,10,18,.16)}.location-copy{margin:0 0 .85rem;color:#c0d1df;font-size:.86rem;line-height:1.55}.location-details{padding:1rem;border-top:1px solid var(--line)}.precise{display:none;margin-top:.8rem}.precise.show{display:block}.accuracy{color:var(--muted);font-size:.76rem;margin-top:.3rem}
    details.card>summary{display:flex;align-items:center;justify-content:space-between;min-height:3.5rem;padding:0 1rem;cursor:pointer;list-style:none;font-weight:700}details.card>summary::-webkit-details-marker{display:none}.chevron{color:var(--muted);transition:transform .2s ease}details[open] .chevron{transform:rotate(180deg)}.privacy-note{margin:.85rem .1rem 0;color:#71899d;font-size:.76rem;line-height:1.5;text-align:center}.toast{position:fixed;z-index:20;left:50%;bottom:max(1rem,env(safe-area-inset-bottom));transform:translate(-50%,1rem);padding:.7rem .95rem;border:1px solid var(--line2);border-radius:.8rem;color:var(--text);background:#102337;box-shadow:0 .9rem 2.5rem rgba(0,0,0,.4);font-size:.84rem;opacity:0;pointer-events:none;transition:.2s ease}.toast.show{opacity:1;transform:translate(-50%,0)}.skeleton{color:var(--muted)!important;font-weight:520!important}
    .location-card{margin-top:.85rem}.location-layout{display:grid}.location-map{min-width:0;margin:0;overflow:hidden;background:#081321}.map-heading{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.4rem;padding:.75rem 1rem;font-size:.875rem;font-weight:650;border-top:1px solid var(--line)}.map-heading span{color:var(--muted);font-weight:400}.map-viewport{height:clamp(15.5rem,62vw,20rem);background:#102337}.map-viewport iframe{display:block;width:100%;height:100%;border:0;color-scheme:light}.map-empty{height:100%;margin:0;display:grid;place-content:center;padding:1.2rem;color:var(--muted);text-align:center;font-size:.875rem;line-height:1.5}.map-caption{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.2rem .8rem;padding:.3rem 1rem;font-size:.875rem;color:var(--muted)}.map-caption a{display:inline-flex;align-items:center;min-height:2.75rem}.map-caption a:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}.precise{overflow-wrap:anywhere}
    @media(min-width:46rem){.shell{padding-top:2rem;padding-bottom:3rem}.topbar{margin-bottom:1.25rem}.hero{padding:1.8rem}.location-card{margin-top:1rem}.map-viewport{height:22rem}.location-details{padding:1.1rem}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1rem}.span-2{grid-column:1/-1}.card-head{padding:1.15rem 1.15rem .85rem}.facts,.history-list{padding-left:1.1rem;padding-right:1.1rem;padding-bottom:1.05rem}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition-duration:.01ms!important}}
    [hidden]{display:none!important}.card-note{margin:0 1rem 1rem;color:var(--muted);font-size:.875rem;line-height:1.5}.retry-wrap{padding:0 1rem}.retry-wrap:has(button:not([hidden])){padding-bottom:1rem}a{color:var(--cyan)}.fact dt,.fact dd,.button,.location-copy{font-size:1rem}.source,.brand-sub,.eyebrow,.privacy-note,.history-time,.accuracy{font-size:.8125rem}.history-ip,.history-place{font-size:.875rem}.history-num{font-size:.75rem}.card-head{flex-wrap:wrap}.history-time{white-space:normal;max-width:7rem}.fact{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}.hero:after{z-index:0}.hero>*{z-index:1}.location-copy{line-height:1.6}
    .ip-checks{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:.75rem;margin-top:1.25rem}.ip-check{min-width:0;padding:1rem;border:1px solid var(--line2);border-radius:1rem;background:rgba(3,10,18,.35)}.ip-check-heading{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.7rem}.ip-check-heading h2{font-size:1rem;margin:0;color:var(--cyan)}.address{font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:clamp(1rem,3.8vw,1.35rem);line-height:1.5;overflow-wrap:anywhere}.ip-check p,.ip-check-footer p,.ip-help p{color:var(--muted);font-size:.875rem;line-height:1.6;margin:.5rem 0 0}.ip-check-footer{position:relative;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin:.85rem 0}.ip-check-footer p{flex:1 1 12rem;margin:0}.ip-help{position:relative;border-top:1px solid var(--line);padding-top:.9rem}.ip-help summary{cursor:pointer;font-size:1rem;color:var(--text)}.ip-help p{font-size:1rem}.ip-check .button:disabled{cursor:default}
    @media(min-width:46rem){.ip-checks{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:360px){.history-item{grid-template-columns:2rem minmax(0,1fr)}.history-time{grid-column:2;text-align:left;max-width:none}}
  </style>
</head>
<body>
  <main class="shell">
    <header class="topbar"><div class="brand"><div class="mark" aria-hidden="true"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M16.5 3.8 20.2 7.5M18.2 3.8h-1.7v1.7M20.2 5.8V7.5h-1.7"/></svg></div><div><div class="brand-title">DeviceScope</div><div class="brand-sub">What this site can see</div></div></div><div class="live"><span class="pulse"></span>This visit</div></header>
    <section class="hero" aria-labelledby="ip-title"><div class="eyebrow" id="ip-title">IP seen by DeviceScope</div><div class="ip-row"><div class="ip" id="current-ip">${escapeHtml(current.ip)}</div></div><div class="hero-meta" id="hero-meta"><span>${escapeHtml(current.location)}</span><span class="dot">•</span><span>${escapeHtml(current.organization || "Network provider unavailable")}</span></div>
      <div class="ip-checks" aria-label="Public IPv4 and IPv6">
        <div class="ip-check"><div class="ip-check-heading"><h2>IPv4</h2><button class="button" id="copy-ipv4" type="button" disabled aria-label="Copy public IPv4 address">Copy</button></div><div class="address" id="ipv4-address">Checking…</div><p id="ipv4-status" role="status">Checking IPv4 separately…</p></div>
        <div class="ip-check"><div class="ip-check-heading"><h2>IPv6</h2><button class="button" id="copy-ipv6" type="button" disabled aria-label="Copy public IPv6 address">Copy</button></div><div class="address" id="ipv6-address">Checking…</div><p id="ipv6-status" role="status">Checking IPv6 separately…</p></div>
      </div>
      <div class="ip-check-footer"><p id="ip-check-summary" role="status">Checking both public address types…</p><button class="button" id="retry-addresses" type="button">Recheck IPs</button></div>
      <details class="ip-help"><summary>Which IP does my device use?</summary><p>You can have both. Each connection uses one IP version. Browsers generally prefer IPv6 when available and quickly try IPv4 too if needed, using a working connection without a long wait. The website, network, and connection speed affect the choice, so there is no fixed “primary” IP for every site.</p><p>The large address above is what DeviceScope saw on this page request. The separate checks show your public addresses as seen by ipify. A VPN, iCloud Private Relay, or network translation can change these addresses; they are not necessarily assigned directly to your device.</p><p>“Not detected” means a check could not confirm an address. Your network may lack that connection type, or the check may be blocked or temporarily unavailable.</p></details>
      <noscript><p>Enable JavaScript to check IPv4 and IPv6 separately.</p></noscript>
    </section>
    <section class="card location-card" aria-labelledby="location-title"><div class="card-head"><h2 class="card-title" id="location-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Location</h2><span class="source">IP estimate · optional GPS</span></div><div class="location-body"><div class="location-callout location-layout"><figure class="location-map" aria-labelledby="map-title"><div class="map-heading" id="map-title">Approximate area <span>IP estimate</span></div><div class="map-viewport"><p class="map-empty" id="map-empty" role="status">Looking up an approximate location…</p><iframe id="location-map" title="Map of your approximate IP location" aria-describedby="map-caption" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="geolocation 'none'" hidden></iframe></div><figcaption class="map-caption" id="map-caption"><span>Map stays on the IP estimate.</span><a id="map-link" target="_blank" rel="noopener noreferrer" hidden>Open larger map</a></figcaption></figure><div class="location-details"><p class="location-copy" id="approximate-location"><strong>Approximate:</strong> ${escapeHtml(current.location)}. This comes from your network connection and may only identify a nearby city. Precise location stays in this browser and is never sent back to the server.</p><button class="button primary" id="location-button" type="button">Use precise location</button><div class="precise" id="precise-location" aria-live="polite"></div></div></div></div></section>
    <div class="grid">
      <section class="card" aria-labelledby="connection-title"><div class="card-head"><h2 class="card-title" id="connection-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12.55a11 11 0 0 1 14.08 0M8.5 16.05a6 6 0 0 1 7 0M12 20h.01M1.5 9a16 16 0 0 1 21 0"/></svg>Connection</h2><span class="source" id="connection-source">This connection</span></div><dl class="facts" id="connection-facts"></dl><p class="card-note" id="network-note" role="status">Reading connection details…</p><div class="retry-wrap"><button class="button" id="retry-network" type="button" hidden>Retry IP lookup</button></div></section>
      <section class="card" aria-labelledby="device-title"><div class="card-head"><h2 class="card-title" id="device-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>Device & browser</h2><span class="source">Browser-reported</span></div><dl class="facts" id="device-facts"><div class="fact"><dt>Detecting</dt><dd class="skeleton">Reading this browser…</dd></div></dl></section>
      <section class="card span-2" aria-labelledby="history-title"><div class="card-head"><h2 class="card-title" id="history-title"><svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>Recent IP history</h2><button class="button danger" id="clear-history" type="button">Clear</button></div><ul class="history-list" id="history-list"></ul></section>
      <details class="card span-2"><summary>Technical details <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary><dl class="facts" id="technical-facts"></dl><p class="card-note">Some details are deliberately not exposed by browsers. Exact device model, Wi-Fi name, MAC address, and private IP are not available to this page. Browser and OS labels are estimates from the user agent, which may be reduced or spoofed.</p></details>
    </div>
    <p class="privacy-note">Recent IP history is stored in a first-party cookie in this browser (up to one year), sent back to this site on visits, and not stored in an app database. Safari may remove it sooner. IPv4 and IPv6 checks connect directly to <a href="https://www.ipify.org/" target="_blank" rel="noopener noreferrer">ipify</a>, which sees the public address used for each check. Both detected address types can appear in your recent history. Missing provider/location details are looked up through <a href="https://ipwhois.io/documentation" target="_blank" rel="noopener noreferrer">ipwho.is</a> using the IP seen by DeviceScope; previous IPs and precise location are never sent to that service. The map loads from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>, which receives your connection IP and the approximate coordinates shown, never your precise location.</p>
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
    function coordinate(value,limit){
      if(typeof value!=="number"&&typeof value!=="string")return null;
      if(typeof value==="string"&&!value.trim())return null;
      const number=Number(value);
      return Number.isFinite(number)&&Math.abs(number)<=limit?number:null;
    }
    function hasMapCoordinates(){return coordinate(c.latitude,85.0511)!==null&&coordinate(c.longitude,180)!==null}
    function renderMap(){
      const frame=$("#location-map"),empty=$("#map-empty"),link=$("#map-link");
      const available=hasMapCoordinates();
      frame.hidden=!available;empty.hidden=available;link.hidden=!available;
      if(!available){
        empty.textContent=lookupState==="loading"?"Looking up an approximate location…":"An approximate map location is not available for this connection.";
        return;
      }
      // Keep a regional view and round IP coordinates; GPS never enters the map.
      const lat=Number(Number(c.latitude).toFixed(2)),lon=Number(Number(c.longitude).toFixed(2));
      const west=Math.max(-180,lon-.24),east=Math.min(180,lon+.24);
      const south=Math.max(-85.0511,lat-.14),north=Math.min(85.0511,lat+.14);
      const url=new URL("https://www.openstreetmap.org/export/embed.html");
      url.searchParams.set("bbox",[west,south,east,north].map(n=>n.toFixed(5)).join(","));
      url.searchParams.set("layer","mapnik");
      url.searchParams.set("marker",lat+","+lon);
      if(frame.src!==url.href)frame.src=url.href;
      link.href="https://www.openstreetmap.org/?mlat="+lat+"&mlon="+lon+"#map=10/"+lat+"/"+lon;
    }
    function renderConnection(){
      const entry=performance.getEntriesByType?.("navigation")?.[0];
      const protocol=entry?.nextHopProtocol||null;
      const wait=entry?.responseStart>entry?.requestStart&&entry.requestStart>0?Math.round(entry.responseStart-entry.requestStart):null;
      const missing=lookupState==="loading"?"Looking up…":lookupState==="failed"?"Lookup unavailable":"Not in IP database";
      const rows=[
        ["Version seen by site",validIp(c.ip)?(c.ip.includes(":")?"IPv6":"IPv4"):"Not detected"],
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
      renderMap();
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
    const addressChecks={4:{ip:null,state:"idle"},6:{ip:null,state:"idle"}};
    let addressesActive=false;
    const recordedAddresses=new Set(validIp(c.ip)?[c.ip]:[]);
    const ipVersion=ip=>validIp(ip)?(ip.includes(":")?6:4):null;
    function currentAddresses(){return new Set([c.ip,addressChecks[4].ip,addressChecks[6].ip].filter(validIp))}
    function renderAddresses(){
      const siteVersion=ipVersion(c.ip);
      for(const version of [4,6]){
        const check=addressChecks[version],address=check.ip||(siteVersion===version?c.ip:null);
        $("#ipv"+version+"-address").textContent=address||(check.state==="loading"?"Checking…":"Not detected");
        $("#copy-ipv"+version).disabled=!address;
        $("#ipv"+version+"-status").textContent=check.ip?(check.ip===c.ip?"Seen by ipify and DeviceScope.":"Seen by ipify for this check."):address?(check.state==="loading"?"Seen by DeviceScope · checking ipify…":"Seen by DeviceScope · separate check unavailable."):(check.state==="loading"?"Checking IPv"+version+" separately…":"Could not confirm IPv"+version+". It may be unavailable or the check may be blocked.");
      }
      const versions=new Set([...currentAddresses()].map(ipVersion));
      $("#ip-check-summary").textContent=addressesActive?"Checking both public address types…":versions.size===2?"Both IPv4 and IPv6 public addresses detected.":versions.size===1?"Only IPv"+[...versions][0]+" was detected by these checks.":"Neither address type could be confirmed. Try checking again.";
      $("#retry-addresses").disabled=addressesActive;
      $("#retry-addresses").textContent=addressesActive?"Checking…":"Recheck IPs";
    }
    function rememberAddress(ip){
      if(historyCleared||recordedAddresses.has(ip))return;
      recordedAddresses.add(ip);
      const existing=DATA.history.find(item=>item.i===ip),now=Date.now();
      DATA.history=[{i:ip,t:now,f:existing?.f||now,n:Math.min((existing?.n||0)+1,9999),l:existing?.l||"Location not looked up"},...DATA.history.filter(item=>item.i!==ip)].slice(0,6);
      while(encodeURIComponent(JSON.stringify(DATA.history)).length>3500&&DATA.history.length>1)DATA.history.pop();
      persistHistory();renderHistory();
    }
    async function checkAddresses(){
      if(addressesActive)return;
      addressesActive=true;
      for(const version of [4,6])addressChecks[version]={ip:null,state:"loading"};
      renderAddresses();renderHistory();
      await Promise.all([4,6].map(async version=>{
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
        try{
          const host=version===4?"api.ipify.org":"api6.ipify.org";
          const response=await fetch("https://"+host+"?format=json&t="+Date.now(),{signal:controller.signal,credentials:"omit",referrerPolicy:"no-referrer",cache:"no-store"});
          if(!response.ok)throw new Error("Address check unavailable");
          const result=await response.json();
          if(ipVersion(result.ip)!==version)throw new Error("Unexpected address type");
          addressChecks[version]={ip:result.ip,state:"done"};
          rememberAddress(result.ip);
        }catch{addressChecks[version]={ip:null,state:"failed"}}
        finally{clearTimeout(timer);renderAddresses();renderHistory()}
      }));
      addressesActive=false;renderAddresses();
    }
    function renderHistory(){
      $("#history-list").innerHTML=DATA.history.length?DATA.history.map((item,index)=>'<li class="history-item"><span class="history-num">'+(currentAddresses().has(item.i)?"NOW":String(index+1).padStart(2,"0"))+'</span><div><div class="history-ip">'+escapeText(item.i)+'</div><div class="history-place">'+(ipVersion(item.i)===6?"IPv6":"IPv4")+" · "+escapeText(item.l||"Unknown location")+(item.n>1?" · "+item.n+" visits":"")+'</div></div><time class="history-time" datetime="'+new Date(item.t).toISOString()+'">'+escapeText(formatTime(item.t))+'</time></li>').join(""):'<li class="card-note">History cleared. A new entry is saved on your next visit.</li>';
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
        if(!hasMapCoordinates()&&coordinate(result.latitude,85.0511)!==null&&coordinate(result.longitude,180)!==null){c.latitude=result.latitude;c.longitude=result.longitude}
        c.location=[c.city,c.region,c.country].filter(Boolean).join(", ")||"Unknown location";
        networkSource="IP lookup + browser";lookupState="done";lookupMessage="Provider and location: ipwho.is.";
        const existing=DATA.history.find(item=>item.i===c.ip);
        if(existing&&!historyCleared){existing.l=c.location.slice(0,100);persistHistory();renderHistory()}
      }catch(error){lookupState="failed";lookupMessage=error.name==="AbortError"?"IP lookup timed out; you can retry.":error.message==="Failed to fetch"?"IP lookup was blocked or could not be reached. You can retry.":error.message}
      finally{clearTimeout(timer);lookupActive=false;renderConnection();renderDevice()}
    }
    async function copyAddress(ip){
      if(!validIp(ip)){toast("No IP address to copy");return}
      try{await nav.clipboard.writeText(ip);toast("IP address copied")}
      catch{
        const a=document.createElement("textarea");a.value=ip;a.readOnly=true;a.style.cssText="position:fixed;top:0;left:0;opacity:0;font-size:16px";document.body.append(a);
        a.focus();a.select();a.setSelectionRange(0,a.value.length);
        let copied=false;try{copied=document.execCommand("copy")}catch{}a.remove();toast(copied?"IP address copied":"Copy unavailable; select the IP address to copy");
      }
    }
    for(const version of [4,6])$("#copy-ipv"+version).addEventListener("click",()=>copyAddress(addressChecks[version].ip||(ipVersion(c.ip)===version?c.ip:null)));
    $("#retry-addresses").addEventListener("click",checkAddresses);
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
    if(!c.organization||!c.asn||c.location==="Unknown location"||!hasMapCoordinates())lookupNetwork();
    checkAddresses();
  </script>
</body></html>`, history };
}

export default {
  async fetch(request, env, ctx) {
    void env; void ctx;
    const url = new URL(request.url);
    if (url.pathname === "/favicon.svg") return new Response(FAVICON_SVG, { headers: {
      "content-type": "image/svg+xml", "cache-control": "public, max-age=86400", "x-content-type-options": "nosniff",
    }});
    if (url.pathname === "/apple-touch-icon.png" || url.pathname === "/favicon.ico") {
      const bytes = Uint8Array.from(atob(TOUCH_ICON_BASE64), (character) => character.charCodeAt(0));
      return new Response(bytes, { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400", "x-content-type-options": "nosniff" }});
    }
    if (url.pathname !== "/") return new Response("Not found", { status: 404 });
    const { html, history } = buildPage(request);
    return new Response(html, { headers: {
      "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store, max-age=0",
      "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://ipwho.is https://api.ipify.org https://api6.ipify.org; frame-src https://www.openstreetmap.org; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      "permissions-policy": "geolocation=(self), camera=(), microphone=()", "referrer-policy": "no-referrer", "x-content-type-options": "nosniff",
      "set-cookie": HISTORY_COOKIE + "=" + encodeURIComponent(JSON.stringify(history)) + "; Max-Age=31536000; Path=/; Secure; SameSite=Lax",
    }});
  },
};
