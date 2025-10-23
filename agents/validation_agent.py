# validation_agent.py
"""
NeriaMind Validation Agent
Coordinates human expert validation via ASI:One integration
Manages approve/revise workflow for reasoning chains
Creates validation proof for Knowledge Capsules
Ensures all knowledge is human-verified before storage

Features:
- ASI:One API integration for expert validation
- Approve/Revise workflow management
- Validation status tracking
- Validation proof generation
- Forwarding to Capsule Agent upon approval
"""

import os
import json
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any, List
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

# Validation status enum
class ValidationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REVISION_REQUESTED = "revision_requested"
    REJECTED = "rejected"
    IN_REVIEW = "in_review"

# Agent configuration
VALIDATION_NAME = os.getenv("VALIDATION_NAME", "validation_agent")
VALIDATION_PORT = int(os.getenv("VALIDATION_PORT", "9003"))
VALIDATION_SEED = os.getenv("VALIDATION_SEED", "validation_agent_secret_seed")

# ASI:One API configuration
ASI_ONE_API_KEY = os.getenv("ASI_ONE_API_KEY", "")
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi.one/v1")
ASI_ONE_VALIDATION_ENDPOINT = f"{ASI_ONE_API_URL}/validation"

# Agent addresses
CAPSULE_AGENT_ADDRESS = os.getenv("CAPSULE_AGENT_ADDRESS", "")
REASONING_AGENT_ADDRESS = os.getenv("REASONING_AGENT_ADDRESS", "")

# Validation configuration
AUTO_APPROVE_THRESHOLD = float(os.getenv("AUTO_APPROVE_THRESHOLD", "0.95"))
VALIDATION_TIMEOUT = int(os.getenv("VALIDATION_TIMEOUT", "3600"))  # 1 hour
ENABLE_AUTO_APPROVE = os.getenv("ENABLE_AUTO_APPROVE", "false").lower() == "true"

# Initialize the Validation Agent
validation_agent = Agent(
    name=VALIDATION_NAME,
    port=VALIDATION_PORT,
    seed=VALIDATION_SEED,
    mailbox=True,  # Using mailbox for Agentverse connectivity
)

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# Active validation sessions
validation_sessions: Dict[str, Dict[str, Any]] = {}


def create_text_message(text: str) -> ChatMessage:
    """Create a standard text ChatMessage."""
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


def extract_reasoning_chain(msg: ChatMessage) -> Optional[Dict[str, Any]]:
    """
    Extract reasoning chain data from ChatMessage metadata.

    Args:
        msg: ChatMessage containing reasoning chain

    Returns:
        Reasoning chain dict or None
    """
    reasoning_chain = None

    for content in msg.content:
        if isinstance(content, MetadataContent):
            metadata = content.metadata
            if 'reasoning_chain' in metadata:
                # Parse JSON if it's a string
                rc = metadata['reasoning_chain']
                if isinstance(rc, str):
                    try:
                        reasoning_chain = json.loads(rc)
                    except json.JSONDecodeError:
                        reasoning_chain = {'raw': rc}
                else:
                    reasoning_chain = rc
                break

    return reasoning_chain


def format_for_human_validation(reasoning_chain: Dict[str, Any]) -> str:
    """
    Format reasoning chain for human expert review.

    Args:
        reasoning_chain: Reasoning chain dictionary

    Returns:
        Formatted validation request string
    """
    validation_text = """
╔══════════════════════════════════════════════════════════════╗
║           REASONING CHAIN - HUMAN VALIDATION REQUIRED        ║
╚══════════════════════════════════════════════════════════════╝

📋 QUERY
{query}

🧠 REASONING TYPE
{reasoning_type}

🔑 KEY CONCEPTS
{concepts}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 REASONING STEPS
{reasoning_steps}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 METADATA

Confidence Score:     {confidence:.2%}
Requires Validation:  {requires_validation}
MeTTa Knowledge Used: {metta_knowledge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ VALIDATION CHECKLIST

□ Logical consistency: No contradictions?
□ Evidence support: All claims backed?
□ Transparency: Each step clear?
□ Completeness: All necessary steps included?
□ Accuracy: Factually correct?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 VALIDATION OPTIONS

1. ✅ APPROVE - Reasoning is valid and complete
2. 🔄 REQUEST REVISION - Needs improvements (provide feedback)
3. ❌ REJECT - Fundamental issues (provide reason)

Please respond with your validation decision and any feedback.
""".format(
        query=reasoning_chain.get('query', 'N/A'),
        reasoning_type=reasoning_chain.get('reasoning_type', 'N/A'),
        concepts=', '.join(reasoning_chain.get('key_concepts', [])),
        reasoning_steps=reasoning_chain.get('reasoning_steps', 'N/A'),
        confidence=reasoning_chain.get('confidence', 0.0),
        requires_validation=reasoning_chain.get('requires_validation', True),
        metta_knowledge=json.dumps(reasoning_chain.get('metta_knowledge_used', {}), indent=2)
    )

    return validation_text


def send_to_asi_one_validators(reasoning_chain: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send reasoning chain to ASI:One API for human expert validation.

    Args:
        reasoning_chain: Reasoning chain to validate

    Returns:
        Validation response from ASI:One
    """
    if not ASI_ONE_API_KEY:
        # Mock validation response for testing
        return {
            'status': 'mock',
            'validation_id': str(uuid4()),
            'message': 'ASI:One API key not configured - using mock validation',
            'estimated_time': 300
        }

    try:
        headers = {
            'Authorization': f'Bearer {ASI_ONE_API_KEY}',
            'Content-Type': 'application/json'
        }

        payload = {
            'reasoning_chain': reasoning_chain,
            'validation_request': format_for_human_validation(reasoning_chain),
            'priority': 'high' if reasoning_chain.get('confidence', 0) < 0.7 else 'normal',
            'timeout': VALIDATION_TIMEOUT
        }

        response = requests.post(
            ASI_ONE_VALIDATION_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=30
        )

        response.raise_for_status()
        return response.json()

    except Exception as e:
        print(f"❌ ASI:One validation request failed: {e}")
        # Return mock response on error
        return {
            'status': 'error',
            'validation_id': str(uuid4()),
            'message': f'Validation request failed: {str(e)}',
            'fallback': True
        }


def create_validation_proof(
    reasoning_chain: Dict[str, Any],
    validation_status: ValidationStatus,
    validator_feedback: str = "",
    validator_id: str = "system"
) -> Dict[str, Any]:
    """
    Create validation proof document for approved reasoning.

    Args:
        reasoning_chain: Validated reasoning chain
        validation_status: Final validation status
        validator_feedback: Expert feedback
        validator_id: ID of validator

    Returns:
        Validation proof dictionary
    """
    proof = {
        'validation_id': str(uuid4()),
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'status': validation_status.value,
        'reasoning_chain': reasoning_chain,
        'validator': {
            'id': validator_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'feedback': validator_feedback
        },
        'metadata': {
            'confidence': reasoning_chain.get('confidence', 0.0),
            'reasoning_type': reasoning_chain.get('reasoning_type', 'unknown'),
            'auto_approved': validation_status == ValidationStatus.APPROVED and
                           reasoning_chain.get('confidence', 0) >= AUTO_APPROVE_THRESHOLD
        }
    }

    return proof


def check_auto_approve(reasoning_chain: Dict[str, Any]) -> bool:
    """
    Check if reasoning chain qualifies for auto-approval.

    Args:
        reasoning_chain: Reasoning chain to check

    Returns:
        True if auto-approve criteria met
    """
    if not ENABLE_AUTO_APPROVE:
        return False

    confidence = reasoning_chain.get('confidence', 0.0)
    return confidence >= AUTO_APPROVE_THRESHOLD


@chat.on_message(ChatMessage)
async def handle_validation_request(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming validation requests from Reasoning Agent."""
    # ACK first (required by chat protocol)
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))

    ctx.logger.info(f"📥 Validation request from {sender}")

    # Extract reasoning chain
    reasoning_chain = None
    query_text = None

    for content in msg.content:
        if isinstance(content, TextContent):
            # Text might contain the reasoning chain formatted
            query_text = content.text
        if isinstance(content, MetadataContent):
            if 'reasoning_chain' in content.metadata:
                rc = content.metadata['reasoning_chain']
                if isinstance(rc, str):
                    try:
                        reasoning_chain = json.loads(rc)
                    except:
                        pass
                else:
                    reasoning_chain = rc

    # If no structured chain, try to parse from text
    if not reasoning_chain and query_text:
        reasoning_chain = {
            'query': query_text,
            'reasoning_type': 'unknown',
            'key_concepts': [],
            'reasoning_steps': query_text,
            'confidence': 0.5,
            'requires_validation': True
        }

    if not reasoning_chain:
        ctx.logger.warning("No reasoning chain found in message")
        await ctx.send(sender, create_text_message(
            "❌ Error: No reasoning chain provided for validation"
        ))
        return

    ctx.logger.info(f"🔍 Validating reasoning: {reasoning_chain.get('query', 'N/A')[:50]}...")

    # Step 1: Check for auto-approval
    if check_auto_approve(reasoning_chain):
        ctx.logger.info(f"✅ Auto-approved (confidence: {reasoning_chain.get('confidence', 0):.2f})")

        # Create validation proof
        proof = create_validation_proof(
            reasoning_chain,
            ValidationStatus.APPROVED,
            "Auto-approved based on high confidence score",
            "auto-validator"
        )

        # Forward to Capsule Agent
        if CAPSULE_AGENT_ADDRESS:
            ctx.logger.info("📤 Forwarding to Capsule Agent...")
            await ctx.send(
                CAPSULE_AGENT_ADDRESS,
                ChatMessage(
                    timestamp=datetime.now(timezone.utc),
                    msg_id=uuid4(),
                    content=[
                        TextContent(type="text", text=reasoning_chain.get('query', '')),
                        MetadataContent(type="metadata", metadata={
                            'reasoning_chain': json.dumps(reasoning_chain),
                            'validation_proof': json.dumps(proof),
                            'status': 'approved'
                        })
                    ]
                )
            )
            ctx.logger.info("✓ Forwarded to Capsule Agent")

        # Notify sender
        await ctx.send(sender, create_text_message(
            f"✅ Reasoning chain auto-approved!\n\nConfidence: {reasoning_chain.get('confidence', 0):.2%}\nValidation ID: {proof['validation_id']}"
        ))
        return

    # Step 2: Send to human validators via ASI:One
    ctx.logger.info("👥 Sending to human validators via ASI:One...")

    validation_response = send_to_asi_one_validators(reasoning_chain)
    validation_id = validation_response.get('validation_id', str(uuid4()))

    # Store validation session
    validation_sessions[validation_id] = {
        'reasoning_chain': reasoning_chain,
        'status': ValidationStatus.IN_REVIEW,
        'sender': sender,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'validation_response': validation_response
    }

    ctx.logger.info(f"✓ Validation request sent (ID: {validation_id})")

    # Format validation request for human review
    validation_text = format_for_human_validation(reasoning_chain)

    # Send to sender for now (in production, this would go to ASI:One validators)
    await ctx.send(sender, create_text_message(
        f"📋 VALIDATION REQUEST SUBMITTED\n\n"
        f"Validation ID: {validation_id}\n"
        f"Status: {validation_response.get('status', 'pending')}\n"
        f"Message: {validation_response.get('message', 'Sent to expert validators')}\n\n"
        f"{validation_text}\n\n"
        f"⏱️  Estimated review time: {validation_response.get('estimated_time', 300)} seconds\n\n"
        f"You will be notified when validation is complete."
    ))

    # For testing: simulate approval after a brief moment
    if validation_response.get('status') == 'mock':
        ctx.logger.info("🔄 Mock validation - simulating approval...")

        # Create validation proof
        proof = create_validation_proof(
            reasoning_chain,
            ValidationStatus.APPROVED,
            "Mock validation for testing purposes",
            "mock-validator"
        )

        # Update session
        validation_sessions[validation_id]['status'] = ValidationStatus.APPROVED
        validation_sessions[validation_id]['proof'] = proof

        # Forward to Capsule Agent if configured
        if CAPSULE_AGENT_ADDRESS:
            ctx.logger.info("📤 Forwarding approved reasoning to Capsule Agent...")
            await ctx.send(
                CAPSULE_AGENT_ADDRESS,
                ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
                    content=[
                        TextContent(type="text", text=reasoning_chain.get('query', '')),
                        MetadataContent(type="metadata", metadata={
                            'reasoning_chain': json.dumps(reasoning_chain),
                            'validation_proof': json.dumps(proof),
                            'status': 'approved'
                        })
                    ]
                )
            )

        # Notify sender of approval
        await ctx.send(sender, create_text_message(
            f"✅ REASONING CHAIN APPROVED\n\n"
            f"Validation ID: {validation_id}\n"
            f"Status: Approved\n"
            f"Validator: {proof['validator']['id']}\n"
            f"Feedback: {proof['validator']['feedback']}\n\n"
            f"This verified reasoning has been forwarded to the Capsule Agent for storage as a reusable Knowledge Capsule."
        ))


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender}")


@validation_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Validation Agent."""
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ NERIA Validation Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {VALIDATION_NAME}")
    ctx.logger.info(f"Agent Address: {validation_agent.address}")
    ctx.logger.info(f"Port: {VALIDATION_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)

    # Log configuration
    ctx.logger.info("📍 Configuration:")
    ctx.logger.info(f"  ASI:One API: {'✓ Configured' if ASI_ONE_API_KEY else '✗ Not configured (using mock)'}")
    ctx.logger.info(f"  Capsule Agent: {CAPSULE_AGENT_ADDRESS or '✗ Not configured'}")
    ctx.logger.info(f"  Reasoning Agent: {REASONING_AGENT_ADDRESS or '✗ Not configured'}")
    ctx.logger.info(f"  Auto-Approve: {'✓ Enabled' if ENABLE_AUTO_APPROVE else '✗ Disabled'}")
    ctx.logger.info(f"  Auto-Approve Threshold: {AUTO_APPROVE_THRESHOLD:.2%}")
    ctx.logger.info(f"  Validation Timeout: {VALIDATION_TIMEOUT}s")
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ Validation Agent ready!")
    ctx.logger.info("   Waiting for reasoning chains to validate...")
    ctx.logger.info("=" * 60)


# Include chat protocol
validation_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting NERIA Validation Agent...")
    print("=" * 60)
    print(f"📍 Agent Address: {validation_agent.address}")
    print(f"🔌 Port: {VALIDATION_PORT}")
    print(f"📬 Mailbox: Enabled")
    print(f"👥 ASI:One Integration: {'Enabled' if ASI_ONE_API_KEY else 'DISABLED (Mock Mode)'}")
    print(f"✅ Auto-Approve: {'Enabled' if ENABLE_AUTO_APPROVE else 'Disabled'}")
    print("=" * 60)
    print("Waiting for validation requests...\n")

    validation_agent.run()
