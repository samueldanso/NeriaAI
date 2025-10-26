# reasoning_agent.py
"""
NeriaAI Reasoning Agent
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

from dotenv import load_dotenv

# Import MeTTa reasoning modules
import platform
import sys

METTA_AVAILABLE = False
MeTTa = None

try:
    from hyperon import MeTTa
    from metta_reason.know_graph import initialize_reasoning_knowledge, add_verified_reasoning
    from metta_reason.reasonrag import GeneralRAG
    from metta_reason.utils import (
        classify_reasoning_type,
        extract_key_concepts,
        generate_reasoning_chain,
        format_reasoning_for_validation
    )
    METTA_AVAILABLE = True

except ImportError as e:
    error_msg = str(e)
    if "hyperon" in error_msg.lower() and platform.system() == "Windows":
        print("⚠️  Run on Ubuntu for MeTTa: cd /mnt/c/Users/PC/NERIA/NeriaAI/agents && python3 reasoning_agent.py")

    METTA_AVAILABLE = False
    MeTTa = None

# Load environment variables
load_dotenv()

# Agent configuration
REASONING_NAME = os.getenv("REASONING_NAME", "reasoning_agent")
REASONING_PORT = int(os.getenv("REASONING_PORT", "9001"))
REASONING_SEED = os.getenv("REASONING_SEED", "reasoning_agent_secret_seed")


# ASI:One API configuration
ASI_ONE_API_KEY = os.getenv("ASI_ONE_API_KEY", "")
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi1.ai/v1")

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
metta_instance: Optional[Any] = None
reasoning_rag: Optional[Any] = None

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

    # Ignore messages from validation agent (prevent loop)
    if sender == VALIDATION_AGENT_ADDRESS:
        return

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

    if not query_text:
        ctx.logger.warning("No query text")
        return

    ctx.logger.info(f"Processing: {query_text[:50]}...")

    # Check if MeTTa is available
    if METTA_AVAILABLE and reasoning_rag:
        # MeTTa reasoning enabled - classify, extract concepts, generate chain
        ctx.logger.info("🧠 Using MeTTa Knowledge Graph...")

        reasoning_type = classify_reasoning_type(query_text, ASI_ONE_API_KEY)
        ctx.logger.info(f"  • Reasoning Type: {reasoning_type}")

        concepts = extract_key_concepts(query_text, ASI_ONE_API_KEY)
        ctx.logger.info(f"  • Key Concepts: {', '.join(concepts)}")

        # Query MeTTa knowledge for relevant patterns
        ctx.logger.info("  • Querying MeTTa knowledge graph...")
        patterns = reasoning_rag.query_reasoning_pattern(reasoning_type)
        if patterns:
            ctx.logger.info(f"    ✓ Found {len(patterns)} reasoning pattern(s)")
            for i, pattern in enumerate(patterns[:3], 1):  # Show first 3
                ctx.logger.info(f"      [{i}] {pattern[:80]}...")

        # Query domain-specific knowledge
        domain_knowledge = []
        for concept in concepts[:3]:  # Show first 3 concepts
            rules = reasoning_rag.query_domain_rule(concept)
            if rules:
                domain_knowledge.extend(rules)
                ctx.logger.info(f"    ✓ Domain knowledge for '{concept}': {len(rules)} rule(s)")
                for rule in rules[:2]:  # Show first 2 rules
                    ctx.logger.info(f"      → {rule[:80]}...")

        reasoning_chain = generate_reasoning_chain(
            query=query_text,
            reasoning_type=reasoning_type,
            concepts=concepts,
            rag=reasoning_rag,
            context=context_from_research,
            api_key=ASI_ONE_API_KEY
        )

        ctx.logger.info(f"  ✓ MeTTa-enhanced reasoning generated (conf: {reasoning_chain.get('confidence', 0):.2f})")
    else:
        # Fallback mode (no MeTTa) - simple reasoning
        reasoning_type = "causal"
        query_lower = query_text.lower()
        if any(word in query_lower for word in ["compare", "difference", "versus", "vs"]):
            reasoning_type = "comparative"
        elif any(word in query_lower for word in ["explain", "how", "process"]):
            reasoning_type = "deductive"

        words = query_text.split()
        concepts = [w.strip(".,!?()[]{}\"'") for w in words if len(w) > 4][:5]
        if not concepts:
            concepts = ["reasoning", "query", "processing"]

        # Fallback reasoning chain (enhanced with research context)
        reasoning_steps = f"# Reasoning Analysis for: {query_text}\n\n"
        reasoning_steps += f"**⚠️ MeTTa Reasoning Engine Not Available**\n\n"

        if context_from_research:
            reasoning_steps += "## Research Context Received ✓\n\n"
            reasoning_steps += f"{context_from_research}\n\n"
            reasoning_steps += "---\n\n"
            reasoning_steps += "## Analysis (Fallback Mode)\n\n"
            reasoning_steps += "Based on the research context above:\n\n"
            reasoning_steps += "1. **Evidence Found**: The research agent successfully gathered relevant information\n"
            reasoning_steps += "2. **Knowledge Reusability**: Checked existing Knowledge Capsules for similar queries\n"
            reasoning_steps += "3. **External Sources**: Retrieved additional context from web sources\n\n"
            reasoning_steps += "**Note**: Full reasoning capabilities require MeTTa. Install with:\n"
            reasoning_steps += "```\npip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python\n```\n\n"
            confidence = 0.65  # Lower confidence without MeTTa but with research
        else:
            reasoning_steps += "## ⚠️  No Research Context Available\n\n"
            reasoning_steps += "Note: This response is generated without:\n"
            reasoning_steps += "- External research context\n"
            reasoning_steps += "- MeTTa knowledge graph\n\n"
            reasoning_steps += "### Basic Analysis:\n"
            reasoning_steps += f"1. Query: {query_text}\n"
            reasoning_steps += f"2. Reasoning Type: {reasoning_type}\n"
            reasoning_steps += f"3. Key Concepts: {', '.join(concepts)}\n\n"
            reasoning_steps += "To enable full reasoning:\n"
            reasoning_steps += "1. Install MeTTa: `pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python`\n"
            reasoning_steps += "2. Ensure Research Agent is running\n"
            reasoning_steps += "3. Enable web search in configuration\n"
            confidence = 0.4  # Lower confidence without both

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
                'research_context_length': len(context_from_research) if context_from_research else 0,
                'metta_available': False
            }
        }

    ctx.logger.info(f"Generated chain (conf: {reasoning_chain['confidence']:.2f})")

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
        ctx.logger.info("Forwarding to validation...")

        # Format for validation
        if METTA_AVAILABLE:
            validation_text = format_reasoning_for_validation(reasoning_chain)
        else:
            # Fallback formatting
            validation_text = f"""
🧠 **REASONING CHAIN FOR VALIDATION**

**Query:** {reasoning_chain['query']}

**Reasoning Type:** {reasoning_chain['reasoning_type']}

**Key Concepts:** {', '.join(reasoning_chain['key_concepts'])}

**MeTTa Status:** ⚠️ Not Available (Fallback Mode)

---

{reasoning_chain['reasoning_steps']}

---

**Confidence Score:** {reasoning_chain['confidence']:.2f}
**Note:** Install MeTTa for enhanced reasoning capabilities
"""

        # Forward to Validation Agent
        # Build metadata, filtering out None values
        validation_metadata = {
            "reasoning_type": reasoning_type,
            "confidence": str(reasoning_chain['confidence'])
        }
        if session_id:
            validation_metadata["session_id"] = session_id
        if user_address:
            validation_metadata["user_address"] = user_address

        await ctx.send(
            VALIDATION_AGENT_ADDRESS,
            create_text_message(validation_text, metadata=validation_metadata)
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
        ctx.logger.info("High confidence - validated")

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
        if METTA_AVAILABLE and metta_instance:
            try:
                add_verified_reasoning(
                    metta_instance,
                    query_text,
                    reasoning_type,
                    reasoning_chain['confidence']
                )
                ctx.logger.info("💾 Reasoning stored in MeTTa knowledge graph")
            except Exception as e:
                ctx.logger.error(f"❌ Failed to store reasoning in MeTTa: {e}")
        else:
            ctx.logger.info("💾 Reasoning not stored (MeTTa not available)")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    pass  # Silent ACK


@reasoning_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize MeTTa reasoning engine and agent."""
    global metta_instance, reasoning_rag

    # Initialize MeTTa reasoning engine
    if METTA_AVAILABLE:
        try:
            metta_instance = MeTTa()
            initialize_reasoning_knowledge(metta_instance)
            reasoning_rag = GeneralRAG(metta_instance)

            # Show MeTTa knowledge graph statistics
            ctx.logger.info("=" * 60)
            ctx.logger.info("🧠 MeTTa Knowledge Graph Initialized")
            ctx.logger.info("=" * 60)

            # Test queries to show available knowledge
            available_patterns = reasoning_rag.query_reasoning_pattern("causal")
            ctx.logger.info(f"  Reasoning Patterns: {len(available_patterns) if available_patterns else 0}")
            if available_patterns and len(available_patterns) > 0:
                ctx.logger.info(f"    Example: {available_patterns[0][:70]}...")

            validation_criteria = reasoning_rag.query_validation_criteria()
            ctx.logger.info(f"  Validation Criteria: {len(validation_criteria) if validation_criteria else 0}")
            if validation_criteria and len(validation_criteria) > 0:
                ctx.logger.info(f"    Example: {validation_criteria[0][:70]}...")

            # Test domain knowledge
            test_concept = "transformer"
            test_rules = reasoning_rag.query_domain_rule(test_concept)
            if test_rules:
                ctx.logger.info(f"  Domain Knowledge (test): {len(test_rules)} rules for '{test_concept}'")
                ctx.logger.info(f"    Example: {test_rules[0][:70]}...")

            ctx.logger.info("=" * 60)
            ctx.logger.info("✅ MeTTa-Enhanced Reasoning Ready")
            ctx.logger.info("=" * 60)
        except Exception as e:
            ctx.logger.error(f"❌ MeTTa init failed: {e}")
            metta_instance = None
            reasoning_rag = None
            ctx.logger.info("🧠 Reasoning Agent ready (fallback mode)")
    else:
        # Silent fallback - no warning
        ctx.logger.info("🧠 Reasoning Agent ready (fallback mode)")

    # Validation agent configured (will communicate directly via address)
    if VALIDATION_AGENT_ADDRESS:
        ctx.logger.info(f"  Validation Agent: {VALIDATION_AGENT_ADDRESS[:20]}... ✓")
    else:
        ctx.logger.warning("  Validation Agent: Not configured")


@reasoning_agent.on_event("shutdown")
async def shutdown_handler(ctx: Context):
    """Cleanup on shutdown."""
    active_sessions.clear()


# Include chat protocol
reasoning_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print(f"🧠 Reasoning Agent starting... (MeTTa: {'✓' if METTA_AVAILABLE else '✗'})")
    reasoning_agent.run()
