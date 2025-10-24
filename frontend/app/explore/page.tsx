"use client";

import { useEffect, useState } from "react";

interface KnowledgeCapsule {
  id: string;
  query: string;
  reasoning: any;
  validation: any;
  confidence: number;
  createdAt: string;
  reuseCount: number;
  agentName: string;
}

export default function ExplorePage() {
  const [capsules, setCapsules] = useState<KnowledgeCapsule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] =
    useState<KnowledgeCapsule | null>(null);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockCapsules: KnowledgeCapsule[] = [
        {
          id: "capsule_001",
          query: "How do I optimize React re-renders?",
          reasoning: {
            steps: [
              "Identify re-render causes (props, state, context changes)",
              "Apply React.memo for component memoization",
              "Use useMemo for expensive calculations",
              "Implement useCallback for function references",
            ],
            confidence: 0.95,
          },
          validation: {
            status: "validated",
            validator: "Expert #1234",
            timestamp: "2025-01-15T10:30:00Z",
          },
          confidence: 0.95,
          createdAt: "2025-01-15T10:30:00Z",
          reuseCount: 247,
          agentName: "Reasoning Agent",
        },
        {
          id: "capsule_002",
          query: "Best practices for Next.js 15 App Router",
          reasoning: {
            steps: [
              "Use Server Components by default",
              "Implement proper loading states",
              "Optimize bundle size with dynamic imports",
              "Handle errors with error boundaries",
            ],
            confidence: 0.92,
          },
          validation: {
            status: "validated",
            validator: "Expert #5678",
            timestamp: "2025-01-15T11:15:00Z",
          },
          confidence: 0.92,
          createdAt: "2025-01-15T11:15:00Z",
          reuseCount: 189,
          agentName: "Reasoning Agent",
        },
      ];
      setCapsules(mockCapsules);
    } catch (error) {
      console.error("Failed to fetch capsules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCapsules = capsules.filter(
    (capsule) =>
      capsule.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.agentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Knowledge Capsules
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Verified, reusable knowledge from our multi-agent system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {capsules.length} capsules
              </span>
              <button
                onClick={fetchCapsules}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge capsules..."
              className="w-full px-4 py-3 pl-10 text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Capsules Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="ml-3 text-gray-500">Loading capsules...</span>
          </div>
        ) : filteredCapsules.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No capsules found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "No knowledge capsules available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCapsule(capsule)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {capsule.query}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          {capsule.agentName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(capsule.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                        {capsule.validation.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {capsule.confidence * 100}% confidence
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Reused</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {capsule.reuseCount} times
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Validator</span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {capsule.validation.validator}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Reasoning Steps:</strong>{" "}
                      {capsule.reasoning.steps.length}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capsule Detail Modal */}
      {selectedCapsule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Knowledge Capsule Details
                </h2>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Query */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Original Query
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCapsule.query}
                  </p>
                </div>

                {/* Reasoning Chain */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    🧠 Reasoning Chain
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <ol className="space-y-2">
                      {selectedCapsule.reasoning.steps.map(
                        (step: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {step}
                            </span>
                          </li>
                        ),
                      )}
                    </ol>
                  </div>
                </div>

                {/* Validation Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    ✅ Validation Details
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {selectedCapsule.validation.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Validator</span>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {selectedCapsule.validation.validator}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Confidence
                        </span>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {selectedCapsule.confidence * 100}%
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Reused</span>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {selectedCapsule.reuseCount} times
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    📊 Metadata
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Capsule ID</span>
                        <p className="font-mono text-gray-800 dark:text-white">
                          {selectedCapsule.id}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created</span>
                        <p className="text-gray-800 dark:text-white">
                          {new Date(selectedCapsule.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Agent</span>
                        <p className="text-gray-800 dark:text-white">
                          {selectedCapsule.agentName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Validated</span>
                        <p className="text-gray-800 dark:text-white">
                          {new Date(
                            selectedCapsule.validation.timestamp,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
