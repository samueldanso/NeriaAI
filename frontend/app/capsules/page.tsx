"use client";

import Link from "next/link";

// Mock data for Phase 1 demo - will be replaced with real API calls in Phase 2
const MOCK_CAPSULES = [
  {
    id: "capsule_001",
    query: "How can decentralized AI transform education in Africa?",
    created_at: "2025-01-15T10:30:00Z",
    status: "validated",
    validator: "Expert #1234",
  },
  {
    id: "capsule_002",
    query: "What are the benefits of using MeTTa for logical reasoning?",
    created_at: "2025-01-14T15:20:00Z",
    status: "validated",
    validator: "Expert #5678",
  },
  {
    id: "capsule_003",
    query: "How does the ASI Alliance ecosystem work?",
    created_at: "2025-01-13T09:15:00Z",
    status: "pending",
    validator: "Pending validation",
  },
];

export default function CapsulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">NERIA AI</h1>
            <p className="text-sm text-gray-600">
              Human–AI Knowledge Reasoning
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Query
            </Link>
            <Link href="/capsules" className="text-blue-600 font-medium">
              Capsules
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Knowledge Capsules</h2>
          <p className="text-gray-600">
            Browse verified knowledge created by AI agents and validated by
            human experts
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {MOCK_CAPSULES.filter((c) => c.status === "validated").length}
            </div>
            <div className="text-sm text-gray-600">Validated Capsules</div>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {MOCK_CAPSULES.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending Validation</div>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {MOCK_CAPSULES.length}
            </div>
            <div className="text-sm text-gray-600">Total Capsules</div>
          </div>
        </div>

        {/* Phase 2 Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold mb-1">Phase 1: Basic Setup</h3>
              <p className="text-sm text-gray-700">
                This page shows example capsules. In Phase 2, real capsules will
                be created when queries are validated by human experts via
                ASI:One.
              </p>
            </div>
          </div>
        </div>

        {/* Capsules List */}
        <div className="space-y-4">
          {MOCK_CAPSULES.map((capsule) => (
            <div
              key={capsule.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {capsule.query}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>🆔 {capsule.id}</span>
                    <span>
                      📅 {new Date(capsule.created_at).toLocaleDateString()}
                    </span>
                    <span>👤 {capsule.validator}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    capsule.status === "validated"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {capsule.status === "validated"
                    ? "✅ Validated"
                    : "⏳ Pending"}
                </span>
              </div>

              <button className="text-blue-600 text-sm font-medium hover:underline">
                View Details →
              </button>
            </div>
          ))}
        </div>

        {/* How Capsules Work */}
        <div className="mt-12 bg-white border rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">
            How Knowledge Capsules Work
          </h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <div>
                <strong>Query Submission:</strong> A user asks a complex
                question through the NERIA AI interface
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <div>
                <strong>AI Reasoning:</strong> uAgents and MeTTa analyze the
                query and create a structured reasoning chain
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <div>
                <strong>Human Validation:</strong> The reasoning is sent to
                domain experts via ASI:One for review
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <div>
                <strong>Capsule Creation:</strong> Once validated, the system
                creates an immutable Knowledge Capsule
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-blue-600">5.</span>
              <div>
                <strong>Reusability:</strong> Future queries can reference
                existing capsules, building on verified knowledge
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <p className="mb-2">Powered by Fetch.ai uAgents • MeTTa • ASI:One</p>
          <p>ETHOnline 2025 | ASI Alliance Track</p>
        </div>
      </footer>
    </div>
  );
}
