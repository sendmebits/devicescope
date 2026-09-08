import assert from "node:assert/strict";
import vm from "node:vm";
import worker from "../worker/index.js";

const escape = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const fixture = { ip: "8.8.8.8", success: true, city: "Toronto", region: "Ontario", country_code: "CA", continent_code: "NA", latitude: 0, longitude: 0, postal: "M5V", timezone: { id: "America/Toronto" }, connection: { isp: "Fixture ISP", asn: 1234 } };
async function page(ip="8.8.8.8", cookie="", cf) {
  const request = new Request("https://device.test/", { headers: { "cf-connecting-ip": ip, cookie } });
  if(cf)Object.defineProperty(request,"cf",{value:cf});
  const response=await worker.fetch(request);
  return {response,html:await response.text()};
}
async function runClient(html, mode="success") {
  const elements=new Map(), calls=[], cookies=new Map(), timers=new Map();
  function element(){return {innerHTML:"",_text:"",classList:{add(){},remove(){}},style:{},addEventListener(name,fn){this[name]=fn},focus(){},select(){},setSelectionRange(){},remove(){},set textContent(v){this._text=String(v);this.innerHTML=escape(v)},get textContent(){return this._text}}}
  const document={querySelector(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:element,body:{append(){}},execCommand(){return false}};
  Object.defineProperty(document,"cookie",{get(){return [...cookies].map(([k,v])=>k+"="+v).join("; ")},set(v){const pair=v.split(";")[0],i=pair.indexOf("="),key=pair.slice(0,i);if(v.includes("Max-Age=0"))cookies.delete(key);else cookies.set(key,pair.slice(i+1))}});
  const navigator={userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 Version/18.6 Mobile/15E148 Safari/604.1",platform:"iPhone",vendor:"Apple Computer, Inc.",maxTouchPoints:5,hardwareConcurrency:6,language:"en-CA",languages:["en-CA"],cookieEnabled:true,onLine:true,geolocation:{getCurrentPosition(success,error){error({code:1})}}};
  const sandbox={document,navigator,screen:{width:390,height:844,colorDepth:24},innerWidth:390,innerHeight:720,devicePixelRatio:3,location:{protocol:"https:"},performance:{getEntriesByType(){return [{nextHopProtocol:"h2",requestStart:10,responseStart:52}]}},URL,AbortController,Intl,Date,console,
    setTimeout(fn,ms){const id=timers.size+1;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},
    fetch:async(url,options)=>{calls.push({url,options});
      if(url.includes("ipify.org")){
        if(mode==="blocked"||mode==="ipv4only"&&url.includes("api6."))throw new TypeError("Failed to fetch");
        if(mode==="timeout")throw Object.assign(new Error("Timed out"),{name:"AbortError"});
        if(mode==="rate")return {ok:false,status:429};
        return {ok:true,json:async()=>({ip:mode==="mismatch"?"not an address":url.includes("api6.")?"2001:db8::1234":"192.0.2.25"})};
      }
      if(mode==="rate")return {ok:false,status:429};if(mode==="blocked")throw new TypeError("Failed to fetch");if(mode==="timeout")throw Object.assign(new Error("Timed out"),{name:"AbortError"});return {ok:true,json:async()=>({...fixture,...(mode==="mismatch"?{ip:"1.1.1.1"}:mode==="ipv6"?{ip:"2001:4860:4860::8888"}:{})})}}
  };
  sandbox.window=sandbox;sandbox.addEventListener=()=>{};sandbox.matchMedia=()=>({matches:false});
  const context=vm.createContext(sandbox);
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  new vm.Script(script).runInContext(context);
  for(let n=0;n<12;n++)await Promise.resolve();
  return {elements,calls,cookies,context,timers};
}

const {html,response}=await page();
assert.equal(response.status,200);
assert.ok(response.headers.get("set-cookie").startsWith("devicescope_history="));
assert.ok(response.headers.get("cache-control").includes("no-store"));
assert.ok(response.headers.get("content-security-policy").includes("https://ipwho.is"));
assert.ok(html.indexOf('aria-labelledby="location-title"')<html.indexOf('aria-labelledby="connection-title"'));
const client=await runClient(html);
const network=client.elements.get("#connection-facts").innerHTML;
assert.ok(network.includes("Fixture ISP")&&network.includes("AS1234")&&network.includes("Toronto"));
assert.ok(network.includes("h2")&&network.includes("42 ms"));
assert.ok(!network.includes("Estimated downlink")&&!network.includes("Unavailable"));
assert.ok(client.elements.get("#network-note").textContent.includes("does not expose"));
assert.ok(client.elements.get("#technical-facts").innerHTML.includes("Not passed through by hosting"));
assert.ok(client.elements.get("#device-facts").innerHTML.includes("Safari 18.6"));
assert.ok(client.elements.get("#technical-facts").innerHTML.includes("Latitude (IP estimate)</dt><dd>0"));
assert.equal(client.calls[0].url,"https://ipwho.is/8.8.8.8");
assert.equal(client.calls[0].options.credentials,"omit");
assert.ok(client.cookies.has("devicescope_history"));
await client.elements.get("#location-button").click();
assert.ok(client.elements.get("#precise-location").textContent.includes("permission was not allowed"));
assert.equal(client.elements.get("#location-button").disabled,false);
await client.elements.get("#copy-ipv4").click();
assert.ok(client.elements.get("#toast").textContent.includes("Copy unavailable"));
client.elements.get("#clear-history").click();
assert.equal(client.cookies.size,0);
assert.ok(client.elements.get("#history-list").innerHTML.includes("History cleared"));

const cookie=response.headers.get("set-cookie").split(";")[0];
const second=await page("1.1.1.1",cookie);
const entries=JSON.parse(decodeURIComponent(second.response.headers.get("set-cookie").split(";")[0].split("=").slice(1).join("=")));
assert.deepEqual(entries.map(x=>x.i),["1.1.1.1","8.8.8.8"]);
const malformed=await page("8.8.8.8","devicescope_history="+encodeURIComponent(JSON.stringify([{i:"1.1.1.1",t:"bad",n:"<script>"}])));
assert.ok(!malformed.html.includes('"i":"1.1.1.1"'));
const junk=await page("<script>alert(1)</script>");
assert.ok(junk.html.includes('"ip":"Unavailable"'));
assert.equal((await runClient(junk.html)).calls.filter(x=>x.url.includes("ipwho.is")).length,0);
for(const mode of ["rate","blocked","timeout","mismatch"]){
  const result=await runClient(html,mode);
  assert.equal(result.elements.get("#retry-network").hidden,false);
  assert.ok(!result.elements.get("#connection-facts").innerHTML.includes("Fixture ISP"));
}
const ipv6=await page("2001:4860:4860:0:0:0:0:8888");
assert.ok((await runClient(ipv6.html,"ipv6")).elements.get("#connection-facts").innerHTML.includes("Fixture ISP"));
const known=await page("8.8.8.8","",{city:"Waterloo",region:"Ontario",country:"CA",asOrganization:"Known network",asn:123,latitude:0,longitude:0});
assert.equal((await runClient(known.html)).calls.filter(x=>x.url.includes("ipwho.is")).length,0);
const notFound=await worker.fetch(new Request("https://device.test/missing"));
assert.equal(notFound.status,404);
console.log("Passed: Safari-like client, metadata fallbacks, IP lookup success/failure/timeout/mismatch, IPv6, HTTP timing, denied geolocation, copy failure, cookie history and clear, invalid-cookie handling, known metadata, no-store, CSP, and routes.");

assert.ok(response.headers.get("content-security-policy").includes("https://api6.ipify.org"));
assert.ok(html.includes('id="ipv4-address"')&&html.includes('id="ipv6-address"'));
assert.equal(client.elements.get("#ipv4-address").textContent,"192.0.2.25");
assert.equal(client.elements.get("#ipv6-address").textContent,"2001:db8::1234");
assert.equal(client.elements.get("#retry-addresses").disabled,false);
assert.ok(client.elements.get("#ip-check-summary").textContent.includes("Both"));
const dual=await runClient(html);
assert.ok(dual.elements.get("#history-list").innerHTML.includes("2001:db8::1234"));
assert.ok(dual.elements.get("#history-list").innerHTML.includes("192.0.2.25"));
const historyBefore=dual.cookies.get("devicescope_history");
await dual.elements.get("#retry-addresses").click();
assert.equal(dual.cookies.get("devicescope_history"),historyBefore,"Rechecking does not add visits");
dual.elements.get("#clear-history").click();
await dual.elements.get("#retry-addresses").click();
assert.equal(dual.cookies.size,0,"Recheck does not repopulate cleared history");
for(const mode of ["ipv4only","blocked","timeout","rate","mismatch"]){
  const result=await runClient(html,mode);
  assert.equal(result.elements.get("#ipv6-address").textContent,"Not detected");
  assert.equal(result.elements.get("#copy-ipv6").disabled,true);
  assert.equal(result.elements.get("#ipv4-address").textContent,mode==="ipv4only"?"192.0.2.25":"8.8.8.8");
  assert.equal(result.elements.get("#retry-addresses").disabled,false);
}
const v6fallback=await runClient(ipv6.html,"blocked");
assert.equal(v6fallback.elements.get("#ipv6-address").textContent,"2001:4860:4860:0:0:0:0:8888");
assert.equal(v6fallback.elements.get("#ipv4-address").textContent,"Not detected");
assert.ok(dual.calls.filter(x=>x.url.includes("ipify.org")).every(x=>x.options.cache==="no-store"&&x.options.credentials==="omit"&&x.options.referrerPolicy==="no-referrer"));
console.log("Passed: dual addresses, single-family and failed checks, server-address fallback, retry, privacy options, per-family copy state, history deduplication and clear persistence.");
