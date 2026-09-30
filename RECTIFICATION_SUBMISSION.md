# Botchain Agent Marketplace — Rectification Submission

> **Quoted Review Message:**  
> **Project:** Botchain Agent Marketplace  
> **Live date:** 2026-09-24 Day 1 First check: 2026-09-30 · Held for rectification  
> **Result:** Held for rectification  
> **Failed:**  
> - **KPI 1 Twitter:** Not submitted  
> - **KPI 2 PR:** Not submitted  
> - **KPI 3 Website:** Website display verification: website opened, BOT Chain name is visible, has clickable https://scan.botchain.ai, but no clickable https://botchain.ai; website display verification failed  
> - **KPI 6 On-chain:** Not submitted  
> **Passed:**  
> - **KPI 4 Product availability:** mainnet MVP is live; wallet can connect, interact with the contract and consume gas; product availability verification passed  
> - **KPI 5 Project independence:** mainnet go-live and product interaction have been manually verified; independence verification passed  
> **Summary:** This is held for rectification under the new standard. Quote this message and submit the missing items within 2 weeks. The second review is final.

---

## 1. KPI 3: Website Display Verification (RECTIFIED)

### Resolution Details
- **Issue reported:** Clickable `https://scan.botchain.ai` was present, but no clickable link to `https://botchain.ai`.
- **Changes applied:**
  1. **Top Navigation Header:** Added a prominent, styled button with external link icon linking directly to `https://botchain.ai` across every page (`Home`, `/agents`, `/agents/[slug]`, `/dashboard`, `/list-agent`).
  2. **Header Branding:** The "BOT Chain" header brand title is now hyperlinked directly to `https://botchain.ai`.
  3. **Hero Blurb:** The main hero copy explicitly hyperlinks `Botchain (botchain.ai)` to `https://botchain.ai`.
  4. **Network & Ecosystem Status Card:** Added a dedicated "Official Website" clickable card pointing to `https://botchain.ai` alongside RPC and Explorer cards.
  5. **Global Shared Footer:** Added an omnipresent footer across all routes containing direct, clickable links to:
     - `https://botchain.ai` (Official Website)
     - `https://scan.botchain.ai` (Mainnet Explorer)
     - `https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7` (Verified Contract)

### Verification Links
- **Official Website Link on DApp:** [https://botchain.ai](https://botchain.ai)
- **Explorer Link on DApp:** [https://scan.botchain.ai](https://scan.botchain.ai)
- **GitHub Repository:** [https://github.com/liljhnxn/botchain-agent](https://github.com/liljhnxn/botchain-agent)

---

## 2. KPI 6: On-Chain Verification (SUBMITTED)

### Mainnet Smart Contract Details
- **Network Name:** BOT Chain Mainnet
- **Chain ID:** `677` (`0x2a5`)
- **Native Currency:** `BOT`
- **RPC Endpoint:** [https://rpc.botchain.ai](https://rpc.botchain.ai)
- **Contract Name:** `AgentRegistry`
- **Contract Address:** [`0x098110E536DD50de8386a4f3BBfA4e07833766B7`](https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7)
- **Verified Source Code on Botchain Scan:** [Botchain Scan Contract Code](https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7#code)  
  *(Compiler: `v0.8.36+commit.8a079791`, Optimization: Enabled 200 runs)*
- **Deployer Wallet Address:** `0x83acc57bb9CDe889b248E9c740F5248637cd89f4`

### Contract Deployment Transaction
- **Tx Hash:** [`0x163e4148f8f4160387720a48b911b4eae85761726ce1710dbb73817d4bee4a05`](https://scan.botchain.ai/tx/0x163e4148f8f4160387720a48b911b4eae85761726ce1710dbb73817d4bee4a05)
- **Block:** `24,128,297`
- **Gas Used:** `1,456,959`
- **Status:** Finalized / Success

### Live On-Chain Contract Interactions (Gas Consumed on BOT Chain Mainnet)
| Transaction Hash | Method | Gas Used | Date (UTC) | Sender |
| :--- | :--- | :--- | :--- | :--- |
| [`0xa8d8efe90b1cab77c504e3c14e014990930659de7ae7bfdd1c81da45b60ea483`](https://scan.botchain.ai/tx/0xa8d8efe90b1cab77c504e3c14e014990930659de7ae7bfdd1c81da45b60ea483) | `listAgent` | 259,097 | 2026-09-26 | `0x83ac...89f4` |
| [`0xcac71bf45a20c52bd6e08f2b13d0d22efe495d719aec4d1b93a0c0adb287f150`](https://scan.botchain.ai/tx/0xcac71bf45a20c52bd6e08f2b13d0d22efe495d719aec4d1b93a0c0adb287f150) | `setPayoutSettings` | 77,894 | 2026-09-26 | `0x83ac...89f4` |
| [`0x9abaec64c2877f84bd8a62a184704a5ade07433b1734312f74f93cfe284eb57c`](https://scan.botchain.ai/tx/0x9abaec64c2877f84bd8a62a184704a5ade07433b1734312f74f93cfe284eb57c) | `listAgent` | 281,632 | 2026-09-24 | `0x9E05...79ed` |
| [`0x13ccb6f38d0f74efe2f03cf5cb2566d76c88ce9cbb3e0cb37a361231a54d3295`](https://scan.botchain.ai/tx/0x13ccb6f38d0f74efe2f03cf5cb2566d76c88ce9cbb3e0cb37a361231a54d3295) | `listAgent` | 281,596 | 2026-09-24 | `0x83ac...89f4` |
| [`0x3aca0589c2a7e242e571a6772f7f61f4540222675c79929ec7213dfd9444afa6`](https://scan.botchain.ai/tx/0x3aca0589c2a7e242e571a6772f7f61f4540222675c79929ec7213dfd9444afa6) | `listAgent` | 281,680 | 2026-09-24 | `0x17e1...97aC` |
| [`0xb4bd9db6c1769d4ecf74e288e45867f8c40e8a18b32f317115ba014684348b7f`](https://scan.botchain.ai/tx/0xb4bd9db6c1769d4ecf74e288e45867f8c40e8a18b32f317115ba014684348b7f) | `listAgent` | 281,680 | 2026-09-24 | `0x17e1...97aC` |
| [`0xfd5de1dfdd06060a702528bdac74db0418fd5db02b9c0bb4bb2d497e5b266e83`](https://scan.botchain.ai/tx/0xfd5de1dfdd06060a702528bdac74db0418fd5db02b9c0bb4bb2d497e5b266e83) | `listAgent` | 278,880 | 2026-09-24 | `0x17e1...97aC` |

---

## 3. KPI 1: Twitter Announcement Submission (SUBMITTED)

- **Official Post URL:** [https://x.com/botagentmatl/status/2105267269966143595?s=46](https://x.com/botagentmatl/status/2105267269966143595?s=46)
- **Twitter / X Handle:** `@botagentmatl`
- **Status:** Live & Public on X
- **Announcement Content:**
  > 🚀 Botchain Agent Marketplace is LIVE on @BotchainAI Mainnet!
  > 
  > Discover, deploy, and monetize autonomous AI agents with verified on-chain registries.
  > 
  > 🌐 App: https://botchain-agent.vercel.app  
  > ⚡ Official: https://botchain.ai  
  > 
  > #Botchain #AI #Web3

---

## 4. KPI 2: Press Release (PR) Submission (SUBMITTED)

- **Published Press Release URL:** [https://telegra.ph/Botchain-Agent-Marketplace-Launches-on-BOT-Chain-Mainnet-Decentralized-Infrastructure-for-Autonomous-AI-Agents-09-30](https://telegra.ph/Botchain-Agent-Marketplace-Launches-on-BOT-Chain-Mainnet-Decentralized-Infrastructure-for-Autonomous-AI-Agents-09-30)
- **Article Title:** *Botchain Agent Marketplace Launches on BOT Chain Mainnet: Decentralized Infrastructure for Autonomous AI Agents*
- **Publisher / Byline:** Botchain Agent Marketplace Team
- **Status:** Published & Publicly Accessible

### Press Release Summary & Content

#### Executive Summary
The Botchain Agent Marketplace has officially deployed on BOT Chain Mainnet (Chain ID: 677). Designed as a decentralized hub for discovering, deploying, and monetizing intelligent autonomous agents, the platform bridges cutting-edge machine intelligence with the tamper-proof security and low-latency settlement of BOT Chain.

#### Empowering Autonomous AI on BOT Chain
Autonomous AI agents require trusted execution environments, reliable identity registration, and frictionless settlement rails. Built specifically for the BOT Chain ecosystem ([https://botchain.ai](https://botchain.ai)), the Botchain Agent Marketplace provides:

1. **Decentralized Agent Registry (`AgentRegistry.sol`)**:
   Instead of relying on off-chain databases, agent metadata, creator identities, pricing parameters, and tier structures are recorded on-chain on BOT Chain Mainnet at contract address `0x098110E536DD50de8386a4f3BBfA4e07833766B7`.
2. **Native $BOT Economic Layer**:
   Users can deploy agents and pay usage fees directly using native $BOT tokens, with transparent gas consumption and verifiable state transitions on Botchain Scan ([https://scan.botchain.ai](https://scan.botchain.ai)).
3. **Automated Creator Payouts**:
   Developers and AI agent creators retain full sovereignty over their intellectual property. The marketplace smart contract features configurable automated payout schedules, allowing creators to withdraw accrued earnings directly to their preferred hardware or software wallets.
4. **Curated Agent Ecosystem**:
   Launch agents include *DeFi Copilot* for autonomous treasury management and yield routing, *Risk Monitor* for on-chain anomaly detection and contract health auditing, and *Research Agent* for automated cross-chain signal synthesis.

#### Verified Smart Contract Architecture
Security and auditability are foundational to the Botchain Agent Marketplace. The smart contracts have been compiled using Solidity `0.8.36` with compiler optimization (200 runs) and are publicly verified on Botchain Scan:
- **Contract Address:** `0x098110E536DD50de8386a4f3BBfA4e07833766B7`
- **Deployment Transaction:** `0x163e4148f8f4160387720a48b911b4eae85761726ce1710dbb73817d4bee4a05`
- **Explorer Verification:** [https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7#code](https://scan.botchain.ai/address/0x098110E536DD50de8386a4f3BBfA4e07833766B7#code)

#### About Botchain Agent Marketplace
Botchain Agent Marketplace is a community-first protocol bringing decentralized coordination to autonomous intelligence. By providing standard registries, seamless wallet connectivity (Wagmi + Reown AppKit), and verifiable on-chain execution, it unlocks next-generation AI workflows for developers and users worldwide.

- **Official Website:** [https://botchain.ai](https://botchain.ai)
- **Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
- **Source Code Repository:** [https://github.com/liljhnxn/botchain-agent](https://github.com/liljhnxn/botchain-agent)
