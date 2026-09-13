import { NextResponse } from "next/server";
import { Schema, model, models } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { addAgentToStore, readAgentStore } from "@/lib/agent-store";

const agentSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    usageTier: { type: String, required: true },
    creatorAddress: { type: String },
    txHash: { type: String },
    status: { type: String, enum: ["pending", "review", "live"], default: "pending" },
  },
  { timestamps: true }
);

const AgentModel = models.Agent || model("Agent", agentSchema);

export async function GET() {
  try {
    await connectToDatabase();
    const agents = await AgentModel.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      agents.map((agent: any) => ({
        _id: String(agent._id),
        name: agent.name,
        category: agent.category,
        price: agent.price,
        description: agent.description,
        usageTier: agent.usageTier,
        creatorAddress: agent.creatorAddress,
        status: agent.status,
        createdAt: agent.createdAt,
      }))
    );
  } catch {
    return NextResponse.json(readAgentStore());
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.name || !payload.category || !payload.price || !payload.description || !payload.usageTier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const agent = {
      name: String(payload.name),
      category: String(payload.category),
      price: String(payload.price),
      description: String(payload.description),
      usageTier: String(payload.usageTier),
      creatorAddress: payload.creatorAddress ? String(payload.creatorAddress) : undefined,
      txHash: payload.txHash ? String(payload.txHash) : undefined,
      status: payload.status ? String(payload.status) : "live",
    };

    try {
      await connectToDatabase();
      const created = await AgentModel.create(agent);
      return NextResponse.json({
        _id: String(created._id),
        ...agent,
        createdAt: created.createdAt,
      });
    } catch {
      const saved = addAgentToStore({
        ...agent,
        status: (agent.status as "pending" | "review" | "live") || "pending",
      });
      return NextResponse.json(saved, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
