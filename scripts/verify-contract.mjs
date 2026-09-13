// Reads the deployed registry to confirm it is live and the ABI matches.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, defineChain, http } from "viem";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
loadEnvConfig(root);

const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: { decimals: 18, name: "BOT", symbol: "BOT" },
  rpcUrls: { default: { http: ["https://rpc.bohr.life"] } },
  testnet: true,
});

const { abi } = JSON.parse(
  fs.readFileSync(path.join(root, "contracts", "artifacts", "AgentRegistry.json"), "utf8")
);

const address = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
if (!address) {
  console.error("NEXT_PUBLIC_REGISTRY_ADDRESS not set in .env.local.");
  process.exit(1);
}

const client = createPublicClient({ chain: botchainTestnet, transport: http() });
const count = await client.readContract({ address, abi, functionName: "getAgentCount" });

console.log("Registry:", address);
console.log("getAgentCount():", count.toString());
console.log("Contract is live and responding.");
