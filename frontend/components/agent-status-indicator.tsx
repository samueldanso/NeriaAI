"use client";

import { Brain, CheckCircle, Package, Search, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface AgentStatus {
  id: string;
  name: string;
  status: "online" | "processing" | "offline" | "error";
  lastActivity?: Date;
  processingTime?: number;
  icon: React.ReactNode;
}

const AGENTS: AgentStatus[] = [
  {
    id: "query-router",
    name: "Query Router",
    status: "online",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "research",
    name: "Research Agent",
    status: "online",
    icon: <Search className="w-4 h-4" />,
  },
  {
    id: "reasoning",
    name: "Reasoning Agent",
    status: "online",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "validation",
    name: "Validation Agent",
    status: "online",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: "capsule",
    name: "Capsule Agent",
    status: "online",
    icon: <Package className="w-4 h-4" />,
  },
];

export function AgentStatusIndicator() {
  const [agents, setAgents] = useState<AgentStatus[]>(AGENTS);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate agent status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          lastActivity: new Date(),
          processingTime: Math.random() * 1000 + 100, // Random processing time
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onlineCount = agents.filter(
    (agent) => agent.status === "online",
  ).length;
  const totalCount = agents.length;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2">
        Agent Status
      </h3>
      <div className="bg-sidebar-accent rounded-lg p-3 border border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-sidebar-foreground">
            {onlineCount}/{totalCount} online
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-sidebar hover:bg-sidebar-accent transition-colors"
            >
              <div className="flex-shrink-0 text-sidebar-foreground">
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sidebar-foreground truncate">
                    {agent.name.slice(0, 4)}...
                  </span>
                  <span className="text-xs text-green-500 font-medium">
                    online
                  </span>
                </div>
                {agent.processingTime && (
                  <p className="text-xs text-sidebar-foreground/70">
                    Avg: {Math.round(agent.processingTime)}ms
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
