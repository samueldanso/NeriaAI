"use client"

import { useState, useEffect } from "react"

interface AgentStatusPanelProps {
  status: string
}

interface AgentState {
  name: string
  icon: string
  status: "idle" | "processing" | "completed" | "error"
  progress: number
  description: string
}

export function AgentStatusPanel({ status }: AgentStatusPanelProps) {
  const [agents, setAgents] = useState<AgentState[]>([
    {
      name: "Query Router",
      icon: "🔀",
      status: "idle",
      progress: 0,
      description: "Classifying your question",
    },
    {
      name: "Research Agent",
      icon: "🔍",
      status: "idle",
      progress: 0,
      description: "Searching knowledge base",
    },
    {
      name: "Reasoning Agent",
      icon: "🧠",
      status: "idle",
      progress: 0,
      description: "Generating reasoning chain",
    },
    {
      name: "Validation Agent",
      icon: "✅",
      status: "idle",
      progress: 0,
      description: "Validating answer (2/3 consensus)",
    },
    {
      name: "Capsule Agent",
      icon: "📦",
      status: "idle",
      progress: 0,
      description: "Minting Knowledge Capsule NFT",
    },
  ])

  // Simulate agent processing
  useEffect(() => {
    if (status === "processing") {
      const interval = setInterval(() => {
        setAgents((prev) => {
          const updated = [...prev]
          let activeIndex = updated.findIndex((a) => a.status === "processing")

          if (activeIndex === -1) {
            activeIndex = 0
          }

          if (activeIndex < updated.length) {
            updated[activeIndex].progress = Math.min(updated[activeIndex].progress + Math.random() * 30, 95)

            if (updated[activeIndex].progress > 80) {
              updated[activeIndex].status = "completed"
              if (activeIndex + 1 < updated.length) {
                updated[activeIndex + 1].status = "processing"
                updated[activeIndex + 1].progress = 10
              }
            }
          }

          return updated
        })
      }, 500)

      return () => clearInterval(interval)
    } else if (status === "idle") {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: "idle",
          progress: 0,
        })),
      )
    }
  }, [status])

  const getStatusColor = (agentStatus: string) => {
    switch (agentStatus) {
      case "completed":
        return "bg-success"
      case "processing":
        return "bg-primary animate-pulse"
      case "error":
        return "bg-error"
      default:
        return "bg-border"
    }
  }

  const getStatusIcon = (agentStatus: string) => {
    switch (agentStatus) {
      case "completed":
        return "✓"
      case "processing":
        return "⟳"
      case "error":
        return "✕"
      default:
        return "○"
    }
  }

  return (
    <div className="card-base h-full flex flex-col">
      <h3 className="font-semibold mb-4 text-lg">Agent Processing</h3>

      <div className="space-y-4 flex-1">
        {agents.map((agent, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{agent.icon}</span>
                <div>
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-xs text-muted">{agent.description}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(agent.status)} text-background`}
              >
                {getStatusIcon(agent.status)}
              </span>
            </div>

            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(agent.status)} transition-all duration-300`}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-surface-hover rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">Overall Status</p>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${status === "processing" ? "bg-primary text-background" : "bg-success text-background"}`}
          >
            {status === "processing" ? "⏳ Processing" : "✅ Ready"}
          </span>
        </div>
        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${status === "processing" ? "bg-primary animate-pulse" : "bg-success"}`}
            style={{
              width: `${agents.reduce((sum, a) => sum + a.progress, 0) / agents.length}%`,
            }}
          />
        </div>
      </div>

      {/* Agent Details */}
      <div className="mt-4 p-3 bg-surface-hover rounded text-xs text-muted space-y-1">
        <p>
          <strong>Completed:</strong> {agents.filter((a) => a.status === "completed").length}/{agents.length}
        </p>
        <p className="text-xs">
          <strong>Consensus Required:</strong> 2/3 validators
        </p>
      </div>
    </div>
  )
}
