# Botchain Agent Marketplace

A Next.js marketplace demo for discovering, listing, and managing AI agents on the Botchain testnet.

## Features

- wallet-aware landing page
- agent discovery catalog
- dynamic agent detail pages
- creator listing form
- creator dashboard overview
- API route for agent submissions
- fallback in-memory data store for local demos

## Stack

- Next.js 16
- React 19
- Tailwind CSS
- Reown AppKit + Wagmi
- MongoDB-ready API with in-memory fallback

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Add your Reown project ID to `.env.local`.

4. Start the app:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Production deployment

This app is ready to deploy on Vercel or any Node-compatible hosting provider.

Recommended deploy checks:
- set `NEXT_PUBLIC_REOWN_PROJECT_ID`
- set `MONGODB_URI` if using MongoDB
- ensure app metadata URL matches your deployed domain

## Notes

- If MongoDB is unavailable, the app falls back to an in-memory store so local demos still work.
- Wallet flows require the real browser environment to have the wallet extension or browser wallet available.

## Useful scripts

```bash
npm run dev
npm run build
npm run start
```
