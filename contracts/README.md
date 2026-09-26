# AgentRegistry smart contract

On-chain registry of agents for the Botchain marketplace. Listing an agent from
the "List agent" page sends a transaction to this contract; the dashboard reads
listings back from it.

## Files

- `AgentRegistry.sol` — the contract.
- `artifacts/AgentRegistry.json` — compiled ABI + bytecode (generated).

## Compile

```bash
npm run compile:contract
```

Writes `contracts/artifacts/AgentRegistry.json`.

## Deploy to BOT Chain Mainnet (Chain ID 677)

1. Put a funded BOT Chain Mainnet key in `.env.local`:

   ```
   DEPLOYER_PRIVATE_KEY=0x...
   ```

2. Deploy:

   ```bash
   npm run deploy:contract:mainnet
   ```

3. Verify contract status on RPC:

   ```bash
   npm run verify:contract:mainnet
   ```

4. Verify and publish source code on Botchain Scan:

   ```bash
   npm run verify:explorer
   ```

## Deploy to Botchain Testnet (Chain ID 968)

1. Put a funded Botchain Testnet key in `.env.local`:

   ```
   DEPLOYER_PRIVATE_KEY=0x...
   ```

2. Deploy:

   ```bash
   npm run deploy:contract
   ```

3. Verify:

   ```bash
   npm run verify:contract
   ```

Once `NEXT_PUBLIC_REGISTRY_ADDRESS` is set in `.env.local` (automatically updated by the deploy scripts), the marketplace reads and writes
agents on-chain. When it is empty, the app falls back to the off-chain API store,
so the UI keeps working without a deployed contract.

After changing `AgentRegistry.sol`, the existing deployed contract cannot be
upgraded in place. Recompile and redeploy it, then restart the app so
`NEXT_PUBLIC_REGISTRY_ADDRESS` points to the new deployment.

## Contract interface

- `listAgent(name, category, price, description, usageTier) -> uint256 id`
- `getAgent(id) -> Agent`
- `getAllAgents() -> Agent[]`
- `getAgentCount() -> uint256`
- `updateAgent(id, name, category, price, description, usageTier)`
- `setPayoutSettings(id, wallet, interval, automatic)`
- `getPayoutSettings(id) -> PayoutSettings`
- `withdrawPayout(id, amount)` — withdraws native BOT held by the registry
- event `AgentListed(uint256 indexed id, address indexed creator, string name, string price)`
- event `AgentUpdated(uint256 indexed id, string name, string price)`
- event `PayoutSettingsUpdated(uint256 indexed id, address indexed wallet, uint256 interval, bool automatic)`
- event `PayoutWithdrawn(uint256 indexed id, address indexed wallet, uint256 amount)`

The dashboard Manage panel calls `updateAgent` and `setPayoutSettings` for
on-chain listings. `withdrawPayout` requires the registry to hold native BOT;
the interval is enforced by the contract when automatic payouts are enabled.
