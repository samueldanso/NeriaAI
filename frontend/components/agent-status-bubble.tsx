"use client";

import { useEffect, useState } from "react";

export interface AgentStep {
  agent: string;
  icon: string;
  status: "pending" | "active" | "completed";
  message: string;
}

interface AgentStatusBubbleProps {
  steps: AgentStep[];
}

export function AgentStatusBubble({ steps }: AgentStatusBubbleProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Auto-advance to next active step
    const activeIndex = steps.findIndex((s) => s.status === "active");
    if (activeIndex !== -1) {
      setCurrentStep(activeIndex);
    }
  }, [steps]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "active":
        return "⟳";
      default:
        return "○";
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "active":
        return "text-blue-600 dark:text-blue-400 animate-pulse";
      default:
        return "text-muted-foreground/40";
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-card text-card-foreground shadow-md border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-primary">
                Neria AI Multi-Agent System
              </span>
            </div>
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    step.status === "active" ? "scale-105" : ""
                  }`}
                >
                  <span className={`text-xl ${getStepColor(step.status)}`}>
                    {getStepIcon(step.status)}
                  </span>
                  <span className="text-base">{step.icon}</span>
                  <span className={getStepColor(step.status)}>
                    {step.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
