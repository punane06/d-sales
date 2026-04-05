# El Plato Seguro Landing

Marketing landing page for El Plato Seguro, built with Next.js (App Router) and exported as a static site.

## Stack

- Next.js 16.2.2
- React 18.3.1
- TypeScript 5.5.4
- Tailwind CSS 3.4.7
- Static export (`output: 'export'`)

## Requirements

- Node.js 20.9.0 or newer
- npm

## Environment Variables

Create `.env.local` from `.env.local.example` and set values:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_CLARITY_ID`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_ALLOWED_DEV_ORIGINS` (for LAN mobile testing in dev; include bare host and URL forms)

Example source: [.env.local.example](.env.local.example)

## Install

```bash
npm install
```

## Run Locally

Standard dev server:

```bash
npm run dev
```

LAN/mobile testing example:

```bash
npm run dev:lan
```

Recommended `.env.local` value for LAN testing:

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.1.11,http://192.168.1.11:3000,http://192.168.1.11:3001,localhost,http://localhost:3000,http://localhost:3001
```

Windows-safe reset flow (clears dev cache and avoids common PowerShell policy issues):

```bash
npm run dev:reset
```

If needed on restricted PowerShell environments, prefer `npm.cmd` over `npm`.

## Build

```bash
npm run build
```

Build output is written to the `out` folder (static export).

## Deploy

This project is configured for Netlify.

- Build command: `npm run build`
- Publish directory: `out`
- Runtime version: Node 20

See: [netlify.toml](netlify.toml)

## Image Optimization

A one-time utility is included to generate WebP assets:

```bash
npm run images:optimize
```

Script: [scripts/optimize-images.mjs](scripts/optimize-images.mjs)

## Project Structure

- [app](app): routes, metadata, page composition
- [components](components): reusable UI sections
- [config/content.ts](config/content.ts): centralized copy/content
- [public](public): static assets (images, logos)
- [scripts](scripts): utility scripts (dev reset, image optimization)
- [utils](utils): shared helpers

## Useful Notes

- This app uses static export mode in [next.config.js](next.config.js), so deployment should serve generated files from `out`.
- `images.unoptimized` is enabled because optimized images are pre-generated and shipped as static assets.

## Author

- Kadi Kerner
