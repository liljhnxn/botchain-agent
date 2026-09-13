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

## Deploy to Botchain Testnet

1. Put a funded Botchain Testnet key in `.env.local`:

   ```
   DEPLOYER_PRIVATE_KEY=0x...
   ```

2. Deploy:

   ```bash
   npm run deploy:contract
   ```

3. Copy the printed address into `.env.local` and restart `npm run dev`:

   ```
   NEXT_PUBLIC_REGISTRY_ADDRESS=0x...
   ```

Once `NEXT_PUBLIC_REGISTRY_ADDRESS` is set, the marketplace reads and writes
agents on-chain. When it is empty, the app falls back to the off-chain API store,
so the UI keeps working without a deployed contract.

## Contract interface

- `listAgent(name, category, price, description, usageTier) -> uint256 id`
- `getAgent(id) -> Agent`
- `getAllAgents() -> Agent[]`
- `getAgentCount() -> uint256`
- event `AgentListed(uint256 indexed id, address indexed creator, string name, string price)`
