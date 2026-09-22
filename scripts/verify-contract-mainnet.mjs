// Reads the deployed registry on BOT Chain Mainnet to confirm it is live and responding.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, defineChain, http } from "viem";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
loadEnvConfig(root);

const botchainMainnet = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: { decimals: 18, name: "BOT", symbol: "BOT" },
  rpcUrls: {
    default: { http: ["https://rpc.botchain.ai"] },
    public: { http: ["https://rpc.botchain.ai"] },
  },
  blockExplorers: {
    default: { name: "Botchain Scan", url: "https://scan.botchain.ai" },
  },
  testnet: false,
});

const artifactPath = path.join(root, "contracts", "artifacts", "AgentRegistry.json");
if (!fs.existsSync(artifactPath)) {
  console.error("Artifact not found. Run `npm run compile:contract` first.");
  process.exit(1);
}
const { abi } = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const address = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
if (!address) {
  console.error("NEXT_PUBLIC_REGISTRY_ADDRESS not set in .env.local.");
  process.exit(1);
}

const client = createPublicClient({ chain: botchainMainnet, transport: http() });
try {
  const count = await client.readContract({ address, abi, functionName: "getAgentCount" });
  console.log("Network: BOT Chain Mainnet (Chain ID 677)");
  console.log("Registry Address:", address);
  console.log("Current getAgentCount():", count.toString());
  console.log("Contract is live and responding on BOT Chain Mainnet!");
} catch (error) {
  console.error("Failed to read from contract on BOT Chain Mainnet:", error.message);
  process.exit(1);
}
