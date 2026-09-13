export type AgentRecord = {
  _id?: string;
  name: string;
  category: string;
  price: string;
  description: string;
  usageTier: string;
  creatorAddress?: string;
  status: "pending" | "live" | "review";
  createdAt?: string;
};

const inMemoryAgents: AgentRecord[] = [
  {
    _id: "seed-1",
    name: "Alpha Research Bot",
    category: "Analytics",
    price: "0.25 BOT",
    description: "Cross-chain market monitoring and strategy automation for research teams.",
    usageTier: "Starter, Pro, Enterprise",
    creatorAddress: "0x0000000000000000000000000000000000000000",
    status: "live",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-2",
    name: "Market Pulse AI",
    category: "Trading",
    price: "0.32 BOT",
    description: "Market sentiment routing and execution alerting for treasury teams.",
    usageTier: "Starter, Advanced",
    creatorAddress: "0x0000000000000000000000000000000000000000",
    status: "live",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

export function readAgentStore() {
  return inMemoryAgents;
}

export function addAgentToStore(agent: AgentRecord) {
  inMemoryAgents.unshift({
    ...agent,
    _id: agent._id || `agent-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    status: agent.status || "pending",
    createdAt: agent.createdAt || new Date().toISOString(),
  });
  return inMemoryAgents[0];
}
