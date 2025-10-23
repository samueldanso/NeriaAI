#!/usr/bin/env node

/**
 * NERIA AI Frontend Integration Test
 * Tests the API routes and agent communication
 */

const BASE_URL = "http://localhost:3000";

async function testAPIEndpoint(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🧪 Testing NERIA AI Frontend Integration...\n");

  // Test 1: Agent Status
  console.log("1. Testing Agent Status API...");
  await testAPIEndpoint("/api/agents/status");

  // Test 2: Chat API (Direct Agent Communication)
  console.log("\n2. Testing Chat API (Direct Agent Communication)...");
  await testAPIEndpoint("/api/chat", "POST", {
    message: "How do I optimize React re-renders?",
    agentType: "reasoning",
  });

  // Test 3: Backend Query API
  console.log("\n3. Testing Backend Query API...");
  await testAPIEndpoint("/api/backend/query", "POST", {
    query: "What are the best practices for Next.js 15?",
    sessionId: "test_session_123",
  });

  console.log("\n🎉 Integration tests completed!");
  console.log("\n📝 Next Steps:");
  console.log("1. Start your agents: python agents/reasoning_agent.py");
  console.log("2. Start backend: python backend/main.py");
  console.log("3. Start frontend: npm run dev");
  console.log("4. Visit: http://localhost:3000");
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAPIEndpoint, runTests };
