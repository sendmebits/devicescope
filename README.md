<div align="center">

# DeviceScope

See what a website can learn about your device and connection.

![JavaScript](https://img.shields.io/badge/JavaScript-ESM-20232a?logo=javascript&logoColor=f7df1e)
![Cloudflare Workers](https://img.shields.io/badge/runtime-Cloudflare%20Workers-f38020?logo=cloudflare&logoColor=white)
![Dependencies](https://img.shields.io/badge/dependencies-none-2ea44f)

</div>

DeviceScope shows the public IPv4 and IPv6 addresses, approximate network location, provider, browser, OS, display, and other details exposed to a website. Precise location is optional and stays in the browser.

Recent IPs are kept in a first-party cookie. There is no app database.

## Build

Requires Node.js 18 or newer. No install step is needed.

```sh
npm run build
npm run validate
```

Run the device and privacy checks with:

```sh
node scripts/test-device.mjs
```

The source is [`worker/index.js`](worker/index.js). The build outputs a deployable Cloudflare Worker to `dist/`.

## Data sources

- [ipify](https://www.ipify.org/) checks IPv4 and IPv6 separately.
- [ipwho.is](https://ipwhois.io/) provides network and approximate location data when hosting metadata is unavailable.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) displays the approximate area.
