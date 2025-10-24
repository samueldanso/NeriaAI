import { type NextRequest, NextResponse } from "next/server";

// Agent addresses and their roles
const AGENTS = {
  reasoning: {
    address:
      "agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu",
    name: "Reasoning Agent",
    role: "Generates MeTTa logic chains",
    status: "active",
  },
  validation: {
    address:
      "agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm",
    name: "Validation Agent",
    role: "Coordinates expert review via ASI:One",
    status: "active",
  },
  research: {
    address:
      "agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm",
    name: "Research Agent",
    role: "Searches existing Knowledge Capsules",
    status: "pending",
  },
  capsule: {
    address:
      "agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246",
    name: "Capsule Agent",
    role: "Stores and retrieves verified knowledge",
    status: "pending",
  },
  router: {
    address:
      "agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu",
    name: "Query Router Agent",
    role: "Classifies intent and routes queries",
    status: "pending",
  },
};

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would ping each agent to check status
    // For now, return the configured agent status
    return NextResponse.json({
      agents: AGENTS,
      totalAgents: Object.keys(AGENTS).length,
      activeAgents: Object.values(AGENTS).filter(
        (agent) => agent.status === "active",
      ).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch agent status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
