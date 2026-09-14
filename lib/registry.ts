import { createPublicClient, defineChain, http } from "viem";

// Botchain Testnet — kept in sync with app/providers.tsx.
export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: { decimals: 18, name: "BOT", symbol: "BOT" },
  rpcUrls: {
    default: { http: ["https://rpc.bohr.life"] },
    public: { http: ["https://rpc.bohr.life"] },
  },
  blockExplorers: {
    default: { name: "Botchain Scan", url: "https://scan.botchain.ai" },
  },
  testnet: true,
});

// ABI mirrors contracts/AgentRegistry.sol. `as const` gives wagmi/viem full type
// inference for function names, args, and return types.
export const AGENT_REGISTRY_ABI = [
  {
    type: "function",
    name: "listAgent",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "category", type: "string" },
      { name: "price", type: "string" },
      { name: "description", type: "string" },
      { name: "usageTier", type: "string" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    type: "function",
    name: "getAgentCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "updateAgent",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "name", type: "string" },
      { name: "category", type: "string" },
      { name: "price", type: "string" },
      { name: "description", type: "string" },
      { name: "usageTier", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setPayoutSettings",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "wallet", type: "address" },
      { name: "interval", type: "uint256" },
      { name: "automatic", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawPayout",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getAgent",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "name", type: "string" },
          { name: "category", type: "string" },
          { name: "price", type: "string" },
          { name: "description", type: "string" },
          { name: "usageTier", type: "string" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getPayoutSettings",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "wallet", type: "address" },
          { name: "interval", type: "uint256" },
          { name: "automatic", type: "bool" },
          { name: "lastPayoutAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getAllAgents",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "name", type: "string" },
          { name: "category", type: "string" },
          { name: "price", type: "string" },
          { name: "description", type: "string" },
          { name: "usageTier", type: "string" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "AgentListed",
    anonymous: false,
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "price", type: "string", indexed: false },
    ],
  },
] as const;

const rawAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS?.trim() ?? "";

/** True when a valid registry address is configured (contract has been deployed). */
export const isRegistryConfigured = /^0x[0-9a-fA-F]{40}$/.test(rawAddress);

/** The deployed AgentRegistry address, or null when not configured. */
export const REGISTRY_ADDRESS = isRegistryConfigured
  ? (rawAddress as `0x${string}`)
  : null;

export type OnchainAgent = {
  id: bigint;
  creator: string;
  name: string;
  category: string;
  price: string;
  description: string;
  usageTier: string;
  createdAt: bigint;
};

/** Block explorer URL for a transaction hash. */
export function explorerTxUrl(hash: string) {
  return `${botchainTestnet.blockExplorers.default.url}/tx/${hash}`;
}

/** Read every agent from the on-chain registry. Returns [] when not configured. */
export async function fetchOnchainAgents(): Promise<OnchainAgent[]> {
  if (!REGISTRY_ADDRESS) return [];

  const client = createPublicClient({ chain: botchainTestnet, transport: http() });
  const agents = await client.readContract({
    address: REGISTRY_ADDRESS,
    abi: AGENT_REGISTRY_ABI,
    functionName: "getAllAgents",
  });

  return agents as unknown as OnchainAgent[];
}
