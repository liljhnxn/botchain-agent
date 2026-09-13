// Compiles contracts/AgentRegistry.sol with solc and writes the ABI + bytecode
// artifact to contracts/artifacts/AgentRegistry.json.
//
// Usage: npm run compile:contract
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const contractPath = path.join(root, "contracts", "AgentRegistry.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "AgentRegistry.sol": { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object"] },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasFatal = false;
  for (const err of output.errors) {
    console.error(err.formattedMessage);
    if (err.severity === "error") hasFatal = true;
  }
  if (hasFatal) process.exit(1);
}

const contract = output.contracts["AgentRegistry.sol"].AgentRegistry;
const artifact = {
  contractName: "AgentRegistry",
  abi: contract.abi,
  bytecode: "0x" + contract.evm.bytecode.object,
};

const outDir = path.join(root, "contracts", "artifacts");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "AgentRegistry.json");
fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n");

console.log(`Compiled AgentRegistry -> ${path.relative(root, outPath)}`);
console.log(`Bytecode size: ${(artifact.bytecode.length - 2) / 2} bytes`);
