#!/usr/bin/env python3
"""
Test script for Query Router Agent
Sends test queries and validates routing behavior
"""

import asyncio
import os
from datetime import datetime, timezone
from uuid import uuid4

from uagents import Agent, Context
from uagents_core.contrib.protocols.chat import (
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,
)

from dotenv import load_dotenv

load_dotenv()

# Test agent configuration
TEST_AGENT_NAME = "test_user_agent"
TEST_AGENT_PORT = 9999
TEST_AGENT_SEED = "test_user_seed_12345"

# Query Router address (get from router startup logs)
ROUTER_ADDRESS = os.getenv("ROUTER_ADDRESS", "")

if not ROUTER_ADDRESS:
    print("❌ Error: ROUTER_ADDRESS not set in .env")
    print("Start the Query Router Agent first and copy its address")
    exit(1)

# Initialize test agent
test_agent = Agent(
    name=TEST_AGENT_NAME,
    port=TEST_AGENT_PORT,
    seed=TEST_AGENT_SEED,
    mailbox=False,
)

# Test queries for each category
TEST_QUERIES = {
    "simple_factual": [
        "What is the capital of France?",
        "Who invented the telephone?",
        "What is the boiling point of water?",
    ],
    "complex_reasoning": [
        "Explain why neural networks learn hierarchical representations",
        "How does gradient descent optimize machine learning models?",
        "Why is attention mechanism important in transformers?",
    ],
    "validation_request": [
        "Please validate this reasoning chain",
        "Verify that this logic is correct",
        "Check if this conclusion follows from the premises",
    ],
    "capsule_lookup": [
        "Find previous answers about machine learning",
        "Search for existing knowledge on AI",
        "Retrieve past discussions about neural networks",
    ],
}

# Track responses
responses_received = []

def create_test_message(text: str) -> ChatMessage:
    """Create a test ChatMessage."""
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )

@test_agent.on_message(ChatMessage)
async def handle_response(ctx: Context, sender: str, msg: ChatMessage):
    """Handle responses from Query Router."""
    ctx.logger.info(f"✅ Received response from {sender}")
    
    for content in msg.content:
        if isinstance(content, TextContent):
            ctx.logger.info(f"📝 Response: {content.text}")
            responses_received.append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sender": sender,
                "text": content.text,
            })
    
    # Send ACK
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id,
        )
    )

@test_agent.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle ACKs from Query Router."""
    ctx.logger.info(f"✓ ACK received from {sender}")

@test_agent.on_event("startup")
async def send_test_queries(ctx: Context):
    """Send test queries on startup."""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🧪 Query Router Test Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Test Agent Address: {test_agent.address}")
    ctx.logger.info(f"Router Address: {ROUTER_ADDRESS}")
    ctx.logger.info("=" * 60)
    
    # Wait for agent to be ready
    await asyncio.sleep(2)
    
    # Send start session
    ctx.logger.info("🚀 Starting test session...")
    start_msg = ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[StartSessionContent(type="start-session")]
    )
    await ctx.send(ROUTER_ADDRESS, start_msg)
    
    await asyncio.sleep(1)
    
    # Test each query category
    for category, queries in TEST_QUERIES.items():
        ctx.logger.info("=" * 60)
        ctx.logger.info(f"Testing category: {category}")
        ctx.logger.info("=" * 60)
        
        for query in queries:
            ctx.logger.info(f"📤 Sending query: {query}")
            test_msg = create_test_message(query)
            await ctx.send(ROUTER_ADDRESS, test_msg)
            
            # Wait between queries
            await asyncio.sleep(3)
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ All test queries sent!")
    ctx.logger.info(f"📊 Total queries sent: {sum(len(q) for q in TEST_QUERIES.values())}")
    ctx.logger.info("=" * 60)
    ctx.logger.info("Waiting for responses... (press Ctrl+C to stop)")
    ctx.logger.info("=" * 60)

async def print_summary():
    """Print test summary after some time."""
    await asyncio.sleep(30)  # Wait 30 seconds for responses
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Total Queries Sent: {sum(len(q) for q in TEST_QUERIES.values())}")
    print(f"Responses Received: {len(responses_received)}")
    print("=" * 60)
    
    if responses_received:
        print("\n📝 Received Responses:")
        for i, response in enumerate(responses_received, 1):
            print(f"\n{i}. {response['text'][:100]}...")
    else:
        print("\n⚠️  No responses received yet. Check:")
        print("   1. Query Router is running")
        print("   2. Router address is correct in .env")
        print("   3. Specialized agents are running")
        print("   4. No firewall blocking connections")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🧪 NERIA Query Router Test Suite")
    print("=" * 60)
    print(f"Router Address: {ROUTER_ADDRESS}")
    print(f"Test Agent Port: {TEST_AGENT_PORT}")
    print("=" * 60)
    print("\nThis will send test queries to verify routing behavior.")
    print("Make sure the Query Router and all specialized agents are running!\n")
    
    # Run test agent
    try:
        # Schedule summary print
        asyncio.create_task(print_summary())
        test_agent.run()
    except KeyboardInterrupt:
        print("\n\n" + "=" * 60)
        print("🛑 Test stopped by user")
        print("=" * 60)
        print(f"📊 Responses received: {len(responses_received)}")
        print("=" * 60)

