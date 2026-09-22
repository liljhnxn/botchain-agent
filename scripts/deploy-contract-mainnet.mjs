// Deploys the compiled AgentRegistry to BOT Chain Mainnet using viem.
//
// Prerequisites:
//   1. npm run compile:contract   (produces contracts/artifacts/AgentRegistry.json)
//   2. Set DEPLOYER_PRIVATE_KEY in .env.local to a funded BOT Chain Mainnet key.
//
// Usage: npm run deploy:contract:mainnet
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

export const botchainMainnet = defineChain({
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
const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

const rawKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!rawKey) {
  console.error(
    "Set DEPLOYER_PRIVATE_KEY in .env.local (a funded BOT Chain Mainnet private key)."
  );
  process.exit(1);
}
const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({ chain: botchainMainnet, transport: http() });
const walletClient = createWalletClient({ account, chain: botchainMainnet, transport: http() });

console.log(`Deploying AgentRegistry to BOT Chain Mainnet (Chain ID: 677) from ${account.address} ...`);

try {
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer balance: ${balance} wei`);
  if (balance === 0n) {
    console.warn("\n⚠️ Warning: Deployer account has 0 BOT balance on Mainnet. The transaction may fail due to insufficient gas funds.\n");
  }
} catch (err) {
  console.log(`Note: Could not check balance before deployment (${err.message}). Proceeding...`);
}

const gasPrice = await publicClient.getGasPrice();
const estimatedGas = await publicClient.estimateGas({
  account: account.address,
  data: bytecode,
});
const gas = (estimatedGas * 106n) / 100n;
const requiredCost = gas * gasPrice;
console.log(`Estimated gas: ${estimatedGas} (allocated: ${gas})`);
console.log(`Gas price: ${Number(gasPrice) / 1e9} Gwei`);
console.log(`Estimated deploy cost: ${Number(requiredCost) / 1e18} BOT`);

const hash = await walletClient.deployContract({
  abi,
  bytecode,
  args: [],
  gas,
  gasPrice,
  type: "legacy",
});
console.log(`Deployment tx: ${hash}`);
console.log(`Explorer tx: https://scan.botchain.ai/tx/${hash}`);

console.log("Waiting for transaction receipt...");
const receipt = await publicClient.waitForTransactionReceipt({ hash });
if (!receipt.contractAddress) {
  console.error("Deployment failed: no contract address in receipt.");
  process.exit(1);
}

console.log(`\n🎉 AgentRegistry successfully deployed at: ${receipt.contractAddress}`);
console.log(`Explorer: https://scan.botchain.ai/address/${receipt.contractAddress}`);

// Write the address into .env.local so the app picks it up
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
  console.log(`\nUpdated .env.local with NEXT_PUBLIC_REGISTRY_ADDRESS.`);
} catch (err) {
  console.log(`\nCould not auto-update .env.local (${err.message}). Add this line manually:`);
  console.log(line);
}
