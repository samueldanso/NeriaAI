# query_router_agent.py
"""
NeriaMind Query Router Agent
Central coordinator for processing incoming queries
Classifies queries using ASI:One API and routes to appropriate specialized agents
Coordinates multi-agent workflow for verified Knowledge Capsule creation
"""

import os
import json
from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Optional, Dict, Any
from enum import Enum

from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    MetadataContent,
    StartSessionContent,
    EndSessionContent,
)

import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Query classification categories
class QueryType(str, Enum):
    SIMPLE_FACTUAL = "simple_factual"
    COMPLEX_REASONING = "complex_reasoning"
    VALIDATION_REQUEST = "validation_request"
    CAPSULE_LOOKUP = "capsule_lookup"
    UNKNOWN = "unknown"

# Agent configuration
ROUTER_NAME = os.getenv("ROUTER_NAME", "query_router_agent")
ROUTER_PORT = int(os.getenv("ROUTER_PORT", "9000"))
ROUTER_SEED = os.getenv("ROUTER_SEED", "query_router_secret_seed")

# ASI:One API configuration
ASI_ONE_API_KEY = os.getenv("ASI_ONE_API_KEY", "")
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi.one/v1")

# Specialized agent addresses (will be populated on startup)
AGENT_ADDRESSES = {
    "research": os.getenv("RESEARCH_AGENT_ADDRESS", ""),
    "reasoning": os.getenv("REASONING_AGENT_ADDRESS", ""),
    "validation": os.getenv("VALIDATION_AGENT_ADDRESS", ""),
    "capsule": os.getenv("CAPSULE_AGENT_ADDRESS", ""),
}

# Initialize the Query Router Agent
query_router = Agent(
    name=ROUTER_NAME,
    port=ROUTER_PORT,
    seed=ROUTER_SEED,
    mailbox=True,  # Using mailbox for Agentverse connectivity
)

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# Session tracking for multi-agent workflows
active_sessions: Dict[str, Dict[str, Any]] = {}

# Track which user is waiting for response from which agent
# Format: {specialized_agent_address: user_address}
agent_to_user_mapping: Dict[str, str] = {}

# Helper functions
def create_text_message(text: str, metadata: Optional[Dict[str, str]] = None) -> ChatMessage:
    """Create a ChatMessage with TextContent."""
    content = [TextContent(type="text", text=text)]
    if metadata:
        content.append(MetadataContent(type="metadata", metadata=metadata))
    
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=content
    )

def extract_text_content(msg: ChatMessage) -> str:
    """Extract text from ChatMessage content."""
    for item in msg.content:
        if isinstance(item, TextContent):
            return item.text
    return ""

async def classify_query_with_asi_one(query: str, ctx: Context) -> QueryType:
    """
    Classify query using ASI:One API.
    
    Categories:
    - simple_factual: Direct factual questions
    - complex_reasoning: Requires multi-step reasoning
    - validation_request: Human validation needed
    - capsule_lookup: Search existing knowledge
    """
    if not ASI_ONE_API_KEY:
        ctx.logger.warning("ASI:One API key not configured, using fallback classification")
        return fallback_classification(query)
    
    try:
        classification_prompt = f"""
Classify the following query into ONE of these categories:
1. simple_factual - Direct factual questions that can be answered with information retrieval
2. complex_reasoning - Questions requiring multi-step logical reasoning or analysis
3. validation_request - Requests for human expert validation or verification
4. capsule_lookup - Searching for previously validated knowledge or existing answers

Query: {query}

Respond with ONLY the category name (simple_factual, complex_reasoning, validation_request, or capsule_lookup).
"""
        
        response = requests.post(
            f"{ASI_ONE_API_URL}/classify",
            headers={
                "Authorization": f"Bearer {ASI_ONE_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "prompt": classification_prompt,
                "temperature": 0.1,
                "max_tokens": 50
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            classification = result.get("classification", "").strip().lower()
            
            # Map to QueryType enum
            if classification in ["simple_factual", "simple factual"]:
                return QueryType.SIMPLE_FACTUAL
            elif classification in ["complex_reasoning", "complex reasoning"]:
                return QueryType.COMPLEX_REASONING
            elif classification in ["validation_request", "validation request"]:
                return QueryType.VALIDATION_REQUEST
            elif classification in ["capsule_lookup", "capsule lookup"]:
                return QueryType.CAPSULE_LOOKUP
        
        ctx.logger.warning(f"ASI:One classification failed with status {response.status_code}, using fallback")
        return fallback_classification(query)
        
    except Exception as e:
        ctx.logger.error(f"Error classifying query with ASI:One: {e}")
        return fallback_classification(query)

def fallback_classification(query: str) -> QueryType:
    """Simple rule-based fallback classification."""
    query_lower = query.lower()
    
    # Capsule lookup keywords
    if any(keyword in query_lower for keyword in ["find", "search", "lookup", "retrieve", "previous", "existing"]):
        return QueryType.CAPSULE_LOOKUP
    
    # Validation keywords
    if any(keyword in query_lower for keyword in ["validate", "verify", "check", "review", "confirm"]):
        return QueryType.VALIDATION_REQUEST
    
    # Complex reasoning keywords
    if any(keyword in query_lower for keyword in ["why", "how", "analyze", "compare", "explain", "reasoning"]):
        return QueryType.COMPLEX_REASONING
    
    # Default to simple factual
    return QueryType.SIMPLE_FACTUAL

async def route_to_agent(
    ctx: Context,
    query: str,
    query_type: QueryType,
    session_id: str,
    user_address: str
) -> None:
    """Route query to appropriate specialized agent based on classification."""
    
    routing_metadata = {
        "query_type": query_type.value,
        "session_id": session_id,
        "user_address": user_address,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    if query_type == QueryType.SIMPLE_FACTUAL:
        # Route to Research Agent only
        target_address = AGENT_ADDRESSES["research"]
        ctx.logger.info(f"📚 Routing simple factual query to Research Agent: {target_address}")
        
        if target_address:
            # Track this routing for response forwarding
            agent_to_user_mapping[target_address] = user_address
            
            await ctx.send(
                target_address,
                create_text_message(query, metadata=routing_metadata)
            )
        else:
            ctx.logger.error("Research Agent address not configured")
            await ctx.send(
                user_address,
                create_text_message("Error: Research Agent not available")
            )
    
    elif query_type == QueryType.COMPLEX_REASONING:
        # Route to Reasoning Agent (which will coordinate with Research Agent)
        target_address = AGENT_ADDRESSES["reasoning"]
        ctx.logger.info(f"🧠 Routing complex reasoning query to Reasoning Agent: {target_address}")
        
        if target_address:
            # Track this routing for response forwarding
            agent_to_user_mapping[target_address] = user_address
            
            await ctx.send(
                target_address,
                create_text_message(query, metadata=routing_metadata)
            )
        else:
            ctx.logger.error("Reasoning Agent address not configured")
            await ctx.send(
                user_address,
                create_text_message("Error: Reasoning Agent not available")
            )
    
    elif query_type == QueryType.VALIDATION_REQUEST:
        # Route to Validation Agent
        target_address = AGENT_ADDRESSES["validation"]
        ctx.logger.info(f"✅ Routing validation request to Validation Agent: {target_address}")
        
        if target_address:
            # Track this routing for response forwarding
            agent_to_user_mapping[target_address] = user_address
            
            await ctx.send(
                target_address,
                create_text_message(query, metadata=routing_metadata)
            )
        else:
            ctx.logger.error("Validation Agent address not configured")
            await ctx.send(
                user_address,
                create_text_message("Error: Validation Agent not available")
            )
    
    elif query_type == QueryType.CAPSULE_LOOKUP:
        # Route to Capsule Agent for knowledge retrieval
        target_address = AGENT_ADDRESSES["capsule"]
        ctx.logger.info(f"💊 Routing capsule lookup to Capsule Agent: {target_address}")
        
        if target_address:
            # Track this routing for response forwarding
            agent_to_user_mapping[target_address] = user_address
            
            await ctx.send(
                target_address,
                create_text_message(query, metadata=routing_metadata)
            )
        else:
            ctx.logger.error("Capsule Agent address not configured")
            await ctx.send(
                user_address,
                create_text_message("Error: Capsule Agent not available")
            )
    
    else:
        ctx.logger.warning(f"Unknown query type: {query_type}")
        await ctx.send(
            user_address,
            create_text_message("Unable to classify query. Please rephrase your question.")
        )

# Chat Protocol Handlers

@chat.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming ChatMessage from users or specialized agents."""
    
    # Send acknowledgement first
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id
        )
    )
    
    ctx.logger.info(f"📨 Received ChatMessage from {sender}")
    
    # Process message content
    for content_item in msg.content:
        
        # Handle session start
        if isinstance(content_item, StartSessionContent):
            ctx.logger.info(f"🚀 Session started with {sender}")
            
            # Send welcome message with capabilities
            welcome_msg = create_text_message(
                "Welcome to NeriaMind! I can help you with:\n"
                "• Factual queries (Research)\n"
                "• Complex reasoning (Detail and Complex )\n"
                "• Knowledge validation (Human experts)\n"
                "• Capsule lookup (Verified knowledge)\n\n"
                "How can I assist you today?",
                metadata={"capabilities": "research,reasoning,validation,capsule"}
            )
            await ctx.send(sender, welcome_msg)
        
        # Handle session end
        elif isinstance(content_item, EndSessionContent):
            ctx.logger.info(f"🏁 Session ended with {sender}")
            
            # Clean up session data
            if sender in active_sessions:
                del active_sessions[sender]
        
        # Handle text content (user query or agent response)
        elif isinstance(content_item, TextContent):
            query_text = content_item.text
            ctx.logger.info(f"📝 Message: {query_text[:100]}...")
            
            # Check if this is a response from a specialized agent
            is_agent_response = any(
                agent_addr and sender == agent_addr 
                for agent_addr in AGENT_ADDRESSES.values()
            )
            
            if is_agent_response:
                # This is a response from a specialized agent - forward to original user
                ctx.logger.info(f"✅ Received response from specialized agent: {sender[:20]}...")
                
                # Look up the user who sent the original query to this agent
                user_address = agent_to_user_mapping.get(sender)
                
                if user_address:
                    ctx.logger.info(f"📤 Forwarding response to user: {user_address[:20]}...")
                    
                    # Forward the entire message to the user
                    await ctx.send(user_address, msg)
                    
                    ctx.logger.info(f"✓ Response forwarded to user successfully")
                    
                    # Clean up the mapping after forwarding (optional - keeps mapping clean)
                    # Comment out if you want to allow multiple responses from same agent
                    # del agent_to_user_mapping[sender]
                else:
                    ctx.logger.warning(f"⚠️  Could not find original user for agent response from {sender[:20]}...")
                    ctx.logger.warning(f"   Current mappings: {len(agent_to_user_mapping)} active")
            
            else:
                # This is a new query from a user
                session_id = str(uuid4())
                active_sessions[session_id] = {
                    "user_address": sender,
                    "query": query_text,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                ctx.logger.info(f"🆕 New query from user: {sender[:20]}...")
                
                # Classify the query
                ctx.logger.info("🔍 Classifying query...")
                query_type = await classify_query_with_asi_one(query_text, ctx)
                ctx.logger.info(f"📊 Query classified as: {query_type.value}")
                
                # Send classification feedback to user
                await ctx.send(
                    sender,
                    create_text_message(
                        f"✅ Query classified as: {query_type.value.replace('_', ' ').title()}\n"
                        f"🔄 Routing to appropriate agent...\n"
                        f"⏳ Please wait for the response..."
                    )
                )
                
                # Route to appropriate agent
                await route_to_agent(ctx, query_text, query_type, session_id, sender)
        
        # Handle metadata
        elif isinstance(content_item, MetadataContent):
            ctx.logger.info(f"📋 Metadata: {content_item.metadata}")

@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender} for message {msg.acknowledged_msg_id}")

# Agent Events

@query_router.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize agent and register specialized agents."""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🚀 NERIA Query Router Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {ROUTER_NAME}")
    ctx.logger.info(f"Agent Address: {query_router.address}")
    ctx.logger.info(f"Port: {ROUTER_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)
    
    # Log agent addresses
    ctx.logger.info("📍 Specialized Agent Addresses:")
    for agent_name, address in AGENT_ADDRESSES.items():
        status = "✓ Configured" if address else "✗ Not configured"
        ctx.logger.info(f"  {agent_name.capitalize()}: {address or 'N/A'} {status}")
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("ℹ️  Note: Agents communicate directly via addresses (no registration needed)")
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ Query Router Agent ready to process queries!")
    ctx.logger.info("=" * 60)

@query_router.on_event("shutdown")
async def shutdown_handler(ctx: Context):
    """Cleanup on shutdown."""
    ctx.logger.info("🛑 Query Router Agent shutting down...")
    
    # Clean up active sessions and mappings
    active_sessions.clear()
    agent_to_user_mapping.clear()
    
    ctx.logger.info("👋 Goodbye!")

# Include chat protocol
query_router.include(chat, publish_manifest=True)

# Main entry point
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting NERIA Query Router Agent...")
    print("=" * 60)
    print(f"📍 Agent Address: {query_router.address}")
    print(f"🔌 Port: {ROUTER_PORT}")
    print(f"📬 Mailbox: Enabled")
    print("=" * 60)
    print("Waiting for queries...\n")
    
    query_router.run()
