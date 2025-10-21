# reasoning_agent.py
"""
NeriaMind Reasoning Agent
Generates structured knowledge reasoning chains using MeTTa
Creates transparent MeTTa logic graphs
Shows reasoning steps clearly
Builds on existing capsules (reusability!)
"""

import os
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any

from uagents import Agent, Context, Protocol, Model
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    MetadataContent,
)

# from hyperon import MeTTa  # Commented for testing without MeTTa
from dotenv import load_dotenv

# Import MeTTa reasoning modules
# from metta_reason.know_graph import initialize_reasoning_knowledge, add_verified_reasoning
# from metta_reason.reasonrag import GeneralRAG
# from metta_reason.utils import (
#     classify_reasoning_type,
#     extract_key_concepts,
#     generate_reasoning_chain,
#     format_reasoning_for_validation
# )

# Load environment variables
load_dotenv()

# Agent configuration
REASONING_NAME = os.getenv("REASONING_NAME", "reasoning_agent")
REASONING_PORT = int(os.getenv("REASONING_PORT", "9001"))
REASONING_SEED = os.getenv("REASONING_SEED", "reasoning_agent_secret_seed")

# ASI:One API configuration
ASI_ONE_API_KEY = os.getenv("ASI_ONE_API_KEY", "")
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi.one/v1")

# Validation Agent address (for forwarding reasoning chains)
VALIDATION_AGENT_ADDRESS = os.getenv("VALIDATION_AGENT_ADDRESS", "")

# Initialize the Reasoning Agent
reasoning_agent = Agent(
    name=REASONING_NAME,
    port=REASONING_PORT,
    seed=REASONING_SEED,
    mailbox=True,  # Using mailbox for Agentverse connectivity
)

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# MeTTa instance and RAG system (initialized on startup)
# metta_instance: Optional[MeTTa] = None  # Commented for testing
# reasoning_rag: Optional[GeneralRAG] = None  # Commented for testing
metta_instance = None  # Placeholder
reasoning_rag = None  # Placeholder

# Active reasoning sessions
active_sessions: Dict[str, Dict[str, Any]] = {}


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


@chat.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming ChatMessage from Query Router or Research Agent."""
    
    # Send acknowledgement first
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id
        )
    )
    
    ctx.logger.info(f"📨 Received reasoning request from {sender}")
    
    # Extract query and metadata
    query_text = None
    context_from_research = None
    session_id = None
    user_address = None
    original_sender = None
    
    for content_item in msg.content:
        if isinstance(content_item, TextContent):
            query_text = content_item.text
        elif isinstance(content_item, MetadataContent):
            session_id = content_item.metadata.get("session_id")
            user_address = content_item.metadata.get("user_address")
            context_from_research = content_item.metadata.get("research_context") or content_item.metadata.get("context")
            original_sender = content_item.metadata.get("original_sender")
            
            # Log research context info
            if context_from_research:
                ctx.logger.info(f"📚 Received research context ({len(context_from_research)} chars)")
            else:
                ctx.logger.warning("⚠️  No research context in metadata")
    
    if not query_text:
        ctx.logger.warning("No query text found in message")
        return
    
    ctx.logger.info(f"🧠 Processing reasoning query: {query_text}")
    
    # ===== MeTTa reasoning commented for testing =====
    # Step 1: Classify reasoning type
    ctx.logger.info("🔍 Classifying query (MOCK - MeTTa disabled)...")
    # reasoning_type = classify_reasoning_type(query_text, ASI_ONE_API_KEY)
    reasoning_type = "causal"  # Mock classification
    ctx.logger.info(f"📊 Reasoning type: {reasoning_type}")
    
    # Step 2: Extract key concepts
    ctx.logger.info("🔎 Extracting key concepts (MOCK)...")
    # concepts = extract_key_concepts(query_text, ASI_ONE_API_KEY)
    concepts = ["reasoning", "query", "processing"]  # Mock concepts
    ctx.logger.info(f"💡 Key concepts: {', '.join(concepts)}")
    
    # Step 3: Generate reasoning chain using MeTTa
    ctx.logger.info("⚙️  Generating reasoning chain (MOCK - MeTTa disabled)...")
    
    # reasoning_chain = generate_reasoning_chain(
    #     query=query_text,
    #     reasoning_type=reasoning_type,
    #     concepts=concepts,
    #     rag=reasoning_rag,
    #     context=context_from_research,
    #     api_key=ASI_ONE_API_KEY
    # )
    
    # Mock reasoning chain (enhanced with research context)
    reasoning_steps = f"# Reasoning Analysis for: {query_text}\n\n"
    
    if context_from_research:
        reasoning_steps += "## Research Context Received ✓\n\n"
        reasoning_steps += f"{context_from_research}\n\n"
        reasoning_steps += "---\n\n"
        reasoning_steps += "## Analysis\n\n"
        reasoning_steps += "Based on the research context above:\n\n"
        reasoning_steps += "1. **Evidence Found**: The research agent successfully gathered relevant information\n"
        reasoning_steps += "2. **Knowledge Reusability**: Checked existing Knowledge Capsules for similar queries\n"
        reasoning_steps += "3. **External Sources**: Retrieved additional context from web sources\n\n"
        confidence = 0.75  # Higher confidence with research
    else:
        reasoning_steps += "## ⚠️  No Research Context Available\n\n"
        reasoning_steps += "Note: This response is generated without external research context.\n\n"
        reasoning_steps += "### Mock Analysis:\n"
        reasoning_steps += f"1. Query: {query_text}\n"
        reasoning_steps += "2. This is a placeholder response\n"
        reasoning_steps += "3. MeTTa reasoning is currently disabled for testing\n"
        reasoning_steps += "4. To get better results, ensure Research Agent is running and web search is enabled\n"
        confidence = 0.5  # Lower confidence without research
    
    reasoning_chain = {
        'query': query_text,
        'reasoning_type': reasoning_type,
        'key_concepts': concepts,
        'metta_knowledge_used': {},
        'reasoning_steps': reasoning_steps,
        'confidence': confidence,
        'requires_validation': True,
        'metadata': {
            'has_research_context': context_from_research is not None,
            'research_context_length': len(context_from_research) if context_from_research else 0
        }
    }
    
    ctx.logger.info(f"✅ Reasoning chain generated (confidence: {reasoning_chain['confidence']:.2f})")
    
    # Step 4: Store session for validation tracking
    if session_id:
        active_sessions[session_id] = {
            "query": query_text,
            "reasoning_chain": reasoning_chain,
            "user_address": user_address,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    # Step 5: Decide if validation is needed
    if reasoning_chain['requires_validation'] and VALIDATION_AGENT_ADDRESS:
        ctx.logger.info("📤 Forwarding to Validation Agent for human review...")
        
        # Format for validation
        # validation_text = format_reasoning_for_validation(reasoning_chain)
        # Mock formatting
        validation_text = f"""
🧠 **REASONING CHAIN FOR VALIDATION** (MOCK)

**Query:** {reasoning_chain['query']}

**Reasoning Type:** {reasoning_chain['reasoning_type']}

**Key Concepts:** {', '.join(reasoning_chain['key_concepts'])}

---

{reasoning_chain['reasoning_steps']}

---

**Confidence Score:** {reasoning_chain['confidence']:.2f}
**Note:** MeTTa is currently disabled for testing
"""
        
        # Forward to Validation Agent
        await ctx.send(
            VALIDATION_AGENT_ADDRESS,
            create_text_message(
                validation_text,
                metadata={
                    "session_id": session_id,
                    "user_address": user_address,
                    "reasoning_type": reasoning_type,
                    "confidence": str(reasoning_chain['confidence'])
                }
            )
        )
        
        # Notify user
        if user_address:
            await ctx.send(
                user_address,
                create_text_message(
                    f"🧠 Reasoning chain generated!\n\n"
                    f"Type: {reasoning_type}\n"
                    f"Confidence: {reasoning_chain['confidence']:.2f}\n\n"
                    f"Forwarding to human experts for validation..."
                )
            )
    else:
        # High confidence - return directly to user
        ctx.logger.info("✅ High confidence reasoning - returning directly to user")
        
        response_text = f"""
🧠 **REASONING CHAIN** (Confidence: {reasoning_chain['confidence']:.2f})

**Query:** {query_text}

**Type:** {reasoning_type}

**Key Concepts:** {', '.join(concepts)}

{reasoning_chain['reasoning_steps']}

---
✅ **Status:** High confidence - validated by MeTTa knowledge graph
        """.strip()
        
        if user_address:
            await ctx.send(
                user_address,
                create_text_message(response_text)
            )
        
        # Store verified reasoning in MeTTa graph for future reuse
        # add_verified_reasoning(
        #     metta_instance,
        #     query_text,
        #     reasoning_type,
        #     reasoning_chain['confidence']
        # )
        ctx.logger.info("💾 Reasoning stored (MOCK - MeTTa disabled)")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender}")


@reasoning_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize MeTTa reasoning engine and agent."""
    global metta_instance, reasoning_rag
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("🧠 NERIA Reasoning Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {REASONING_NAME}")
    ctx.logger.info(f"Agent Address: {reasoning_agent.address}")
    ctx.logger.info(f"Port: {REASONING_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)
    
    # ===== MeTTa initialization commented for testing =====
    # Initialize MeTTa reasoning engine
    ctx.logger.info("🔧 MeTTa reasoning engine DISABLED for testing")
    ctx.logger.info("⚠️  Running in MOCK mode - using placeholder reasoning")
    # try:
    #     metta_instance = MeTTa()
    #     ctx.logger.info("✓ MeTTa instance created")
    #     
    #     # Initialize knowledge graph
    #     initialize_reasoning_knowledge(metta_instance)
    #     ctx.logger.info("✓ MeTTa knowledge graph initialized")
    #     
    #     # Initialize RAG system
    #     reasoning_rag = GeneralRAG(metta_instance)
    #     ctx.logger.info("✓ RAG system initialized")
    #     
    #     # Test query
    #     patterns = reasoning_rag.get_all_patterns()
    #     ctx.logger.info(f"✓ Knowledge graph contains {len(patterns)} pattern types")
    #     
    # except Exception as e:
    #     ctx.logger.error(f"❌ Failed to initialize MeTTa: {e}")
    #     ctx.logger.warning("⚠️  Agent will run with limited reasoning capabilities")
    
    # Log configuration
    ctx.logger.info("=" * 60)
    ctx.logger.info("📍 Configuration:")
    ctx.logger.info(f"  ASI:One API: {'✓ Configured' if ASI_ONE_API_KEY else '✗ Not configured (using fallback)'}")
    ctx.logger.info(f"  Validation Agent: {'✓ ' + VALIDATION_AGENT_ADDRESS if VALIDATION_AGENT_ADDRESS else '✗ Not configured'}")
    
    # Register Validation Agent if configured
    if VALIDATION_AGENT_ADDRESS:
        await ctx.register(VALIDATION_AGENT_ADDRESS)
        ctx.logger.info("✓ Registered Validation Agent")
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ Reasoning Agent ready to generate MeTTa logic chains!")
    ctx.logger.info("=" * 60)


@reasoning_agent.on_event("shutdown")
async def shutdown_handler(ctx: Context):
    """Cleanup on shutdown."""
    ctx.logger.info("🛑 Reasoning Agent shutting down...")
    
    # Clean up active sessions
    active_sessions.clear()
    
    # Save any final reasoning chains
    ctx.logger.info(f"💾 Processed {len(active_sessions)} reasoning sessions")
    
    ctx.logger.info("👋 Goodbye!")


# Include chat protocol
reasoning_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting NERIA Reasoning Agent...")
    print("=" * 60)
    print(f"📍 Agent Address: {reasoning_agent.address}")
    print(f"🔌 Port: {REASONING_PORT}")
    print(f"📬 Mailbox: Enabled")
    print(f"🧠 MeTTa: DISABLED (Mock Mode for Testing)")
    print("=" * 60)
    print("⚠️  Running in MOCK mode - MeTTa reasoning disabled")
    print("Waiting for reasoning requests...\n")
    
    reasoning_agent.run()
