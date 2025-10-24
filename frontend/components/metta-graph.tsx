"use client";

import { useState } from "react";

export function MeTTaGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    { id: "useMemo", label: "useMemo", color: "from-primary to-secondary" },
    { id: "react", label: "React", color: "from-secondary to-accent" },
    { id: "hooks", label: "Hooks", color: "from-accent to-primary" },
    {
      id: "performance",
      label: "Performance",
      color: "from-primary to-accent",
    },
  ];

  const edges = [
    { from: "useMemo", to: "react" },
    { from: "useMemo", to: "hooks" },
    { from: "useMemo", to: "performance" },
    { from: "hooks", to: "react" },
  ];

  return (
    <div className="w-full h-80 bg-surface-hover rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
      {/* SVG for edges */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        {edges.map((edge, i) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const fromIndex = nodes.indexOf(fromNode);
          const toIndex = nodes.indexOf(toNode);

          const angle1 = (fromIndex / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const angle2 = (toIndex / nodes.length) * Math.PI * 2 - Math.PI / 2;

          const x1 = 160 + Math.cos(angle1) * 100;
          const y1 = 160 + Math.sin(angle1) * 100;
          const x2 = 160 + Math.cos(angle2) * 100;
          const y2 = 160 + Math.sin(angle2) * 100;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border opacity-50"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="relative w-full h-full flex items-center justify-center">
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 100;
          const y = Math.sin(angle) * 100;

          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center cursor-pointer transition-transform ${
                  hoveredNode === node.id ? "scale-110" : ""
                }`}
              >
                <span className="text-xs font-semibold text-center text-background px-2">
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-muted">MeTTa Knowledge Graph</p>
        </div>
      </div>
    </div>
  );
}
