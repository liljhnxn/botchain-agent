# Botchain Agent Marketplace

Discover, deploy, and monetize verified AI agents on Botchain through a decentralized marketplace for on-chain services.

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
- set `NEXT_PUBLIC_REOWN_PROJECT_ID` in Vercel for wallet connection
- set `NEXT_PUBLIC_REGISTRY_ADDRESS` to `0xdd604a092389696708222c02770c7fcd9b919739` for Botchain Testnet
- set `MONGODB_URI` if using MongoDB
- ensure app metadata URL matches your deployed domain

### Publish agents on-chain from Vercel

The `/list-agent` form sends the `listAgent` transaction directly from the connected
wallet. The wallet must be connected to Botchain Testnet (chain ID `968`) and have
enough BOT for gas. Vercel does not sign this transaction.

In Vercel, open **Project Settings -> Environment Variables**, add the two
`NEXT_PUBLIC_*` values above to **Production**, then redeploy. After deployment:

1. Open `/list-agent` on the Vercel URL.
2. Connect a wallet configured for Botchain Testnet.
3. Submit the agent and approve the wallet transaction.
4. Wait for the confirmation, then use the transaction link shown by the app.

Never add `DEPLOYER_PRIVATE_KEY` to Vercel. It is only needed locally by the
contract deployment script and must remain secret. If a private key has been
shared or committed, rotate it immediately.

## Notes

- If MongoDB is unavailable, the app falls back to an in-memory store so local demos still work.
- Wallet flows require the real browser environment to have the wallet extension or browser wallet available.

## Useful scripts

```bash
npm run dev
npm run build
npm run start
```
