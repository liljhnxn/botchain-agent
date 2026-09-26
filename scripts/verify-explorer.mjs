// Verifies the deployed AgentRegistry smart contract on Botchain Scan explorer.
//
// Usage: node scripts/verify-explorer.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
loadEnvConfig(root);

const address = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0x098110E536DD50de8386a4f3BBfA4e07833766B7";
const explorerBase = "https://scan.botchain.ai";
const apiUrl = `${explorerBase}/api/v2/smart-contracts/${address}`;

console.log(`Checking verification status for ${address} on Botchain Scan (${explorerBase}) ...`);

async function checkStatus() {
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Failed to query explorer API: HTTP ${res.status}`);
  }
  return res.json();
}

let data = await checkStatus();

if (data.is_verified) {
  console.log("\n✅ Contract is ALREADY VERIFIED on Botchain Scan!");
  console.log(`- Contract Name:      ${data.name}`);
  console.log(`- Compiler Version:   ${data.compiler_version}`);
  console.log(`- Optimization:       ${data.optimization_enabled ? `Enabled (${data.optimization_runs} runs)` : "Disabled"}`);
  console.log(`- Verified At:        ${data.verified_at}`);
  console.log(`- Explorer Link:      ${explorerBase}/address/${address}#code\n`);
} else {
  console.log("Contract is not yet verified. Submitting source code...");

  const sourceCode = fs.readFileSync(path.join(root, "contracts", "AgentRegistry.sol"), "utf8");

  const verifyRes = await fetch(`${apiUrl}/verification/via/flattened-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler_version: "v0.8.36+commit.8a079791",
      is_optimization_enabled: true,
      optimization_runs: 200,
      contract_name: "AgentRegistry",
      autodetect_constructor_args: true,
      source_code: sourceCode,
      evm_version: "default",
    }),
  });

  const verifyResult = await verifyRes.json();
  console.log("Verification submission response:", verifyResult.message || verifyResult);

  console.log("Waiting for explorer to finalize verification...");
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    data = await checkStatus();
    if (data.is_verified) {
      console.log("\n🎉 Verification SUCCESSFUL!");
      console.log(`- Contract Name:      ${data.name}`);
      console.log(`- Compiler Version:   ${data.compiler_version}`);
      console.log(`- Explorer Link:      ${explorerBase}/address/${address}#code\n`);
      break;
    }
  }

  if (!data.is_verified) {
    console.log("Verification in progress. Please check:", `${explorerBase}/address/${address}#code`);
  }
}

