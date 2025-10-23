"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AgentStatus {
  name: string;
  role: string;
  status: "active" | "pending" | "error";
  address: string;
}

export default function ChatSidebar() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus[]>([]);
  const [showAgentStatus, setShowAgentStatus] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch agent status on component mount
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch("/api/agents/status");
      const data = await response.json();
      if (data.agents) {
        setAgentStatus(Object.values(data.agents));
      }
    } catch (error) {
      console.error("Failed to fetch agent status:", error);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            NERIA AI
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Expert-Validated AI Answers
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link
            href="/chat"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/chat"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="font-medium">Chat</span>
          </Link>
          <Link
            href="/capsules"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/capsules"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Knowledge Capsules</span>
          </Link>
        </nav>

        {/* Agent Status Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Agent Status
            </h3>
            <button
              onClick={() => setShowAgentStatus(!showAgentStatus)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showAgentStatus ? "Hide" : "Show"}
            </button>
          </div>

          {showAgentStatus && (
            <div className="space-y-2">
              {agentStatus.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {agent.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.status === "active"
                          ? "bg-green-500"
                          : agent.status === "pending"
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
