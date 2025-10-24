"use client";

import {
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
  Package,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "processing":
        return <Clock className="w-3 h-3 text-blue-500 animate-pulse" />;
      case "offline":
        return <AlertCircle className="w-3 h-3 text-gray-400" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      case "error":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const onlineCount = agents.filter(
    (agent) => agent.status === "online",
  ).length;
  const totalCount = agents.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {onlineCount}/{totalCount} online
          </Badge>
        </div>
        <Progress
          value={(onlineCount / totalCount) * 100}
          className="h-1 mt-2"
        />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
            >
              <div className="flex-shrink-0">{agent.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {agent.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(agent.status)}`}
                  >
                    {agent.status}
                  </Badge>
                </div>
                {agent.processingTime && (
                  <p className="text-xs text-muted-foreground">
                    Avg: {Math.round(agent.processingTime)}ms
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">{getStatusIcon(agent.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
