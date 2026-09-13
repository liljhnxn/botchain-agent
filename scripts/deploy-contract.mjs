// Deploys the compiled AgentRegistry to Botchain Testnet using viem.
//
// Prerequisites:
//   1. npm run compile:contract   (produces contracts/artifacts/AgentRegistry.json)
//   2. Set DEPLOYER_PRIVATE_KEY in .env.local to a funded Botchain Testnet key.
//
// Usage: npm run deploy:contract
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load .env / .env.local exactly like the Next.js runtime does.
loadEnvConfig(root);

const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: { decimals: 18, name: "BOT", symbol: "BOT" },
  rpcUrls: { default: { http: ["https://rpc.bohr.life"] } },
  blockExplorers: {
    default: { name: "Botchain Scan", url: "https://scan.botchain.ai" },
  },
  testnet: true,
});

const artifactPath = path.join(root, "contracts", "artifacts", "AgentRegistry.json");
if (!fs.existsSync(artifactPath)) {
  console.error("Artifact not found. Run `npm run compile:contract` first.");
  process.exit(1);
}
const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const rawKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!rawKey) {
  console.error(
    "Set DEPLOYER_PRIVATE_KEY in .env.local (a funded Botchain Testnet private key)."
  );
  process.exit(1);
}
const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({ chain: botchainTestnet, transport: http() });
const walletClient = createWalletClient({ account, chain: botchainTestnet, transport: http() });

console.log(`Deploying AgentRegistry from ${account.address} ...`);

const hash = await walletClient.deployContract({ abi, bytecode, args: [] });
console.log(`Deployment tx: ${hash}`);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
if (!receipt.contractAddress) {
  console.error("Deployment failed: no contract address in receipt.");
  process.exit(1);
}

console.log(`\nAgentRegistry deployed at: ${receipt.contractAddress}`);
console.log(`Explorer: https://scan.botchain.ai/address/${receipt.contractAddress}`);

// Write the address into .env.local so the app picks it up (private key stays untouched).
const envPath = path.join(root, ".env.local");
const line = `NEXT_PUBLIC_REGISTRY_ADDRESS=${receipt.contractAddress}`;
try {
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  if (/^NEXT_PUBLIC_REGISTRY_ADDRESS=.*$/m.test(env)) {
    env = env.replace(/^NEXT_PUBLIC_REGISTRY_ADDRESS=.*$/m, line);
  } else {
    env = env.trimEnd() + (env ? "\n" : "") + line + "\n";
  }
  fs.writeFileSync(envPath, env);
  console.log(`\nUpdated .env.local. Restart the dev server (npm run dev) to apply.`);
} catch (err) {
  console.log(`\nCould not auto-update .env.local (${err.message}). Add this line manually:`);
  console.log(line);
}
