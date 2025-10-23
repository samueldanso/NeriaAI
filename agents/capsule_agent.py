# capsule_agent.py
"""
NeriaMind Capsule Agent
Knowledge storage and retrieval system for verified Knowledge Capsules
Creates, stores, and manages validated reasoning chains as JSON files

Current Storage: JSON files (simple, fast, portable)
Future: Supabase PostgreSQL with pgvector for semantic search

Features:
- JSON-based capsule storage
- Capsule versioning and metadata
- Usage tracking and analytics
- Capsule retrieval and reusability
- Ready for Supabase pgvector migration
"""


import os
import json
import hashlib
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any, List
from pathlib import Path

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

from dotenv import load_dotenv

# Future: Supabase pgvector will be used for semantic search

# Load environment variables
load_dotenv()

# Agent configuration
CAPSULE_NAME = os.getenv("CAPSULE_NAME", "capsule_agent")
CAPSULE_PORT = int(os.getenv("CAPSULE_PORT", "9004"))
CAPSULE_SEED = os.getenv("CAPSULE_SEED", "capsule_agent_secret_seed")

# Storage paths - JSON files only (Supabase pgvector will replace this later)
CAPSULE_DIR = Path("data/knowledge_capsules")
CAPSULE_STORAGE_DIR = CAPSULE_DIR / "capsules"
CAPSULE_STATS_PATH = CAPSULE_DIR / "capsule_stats.json"

# Initialize the Capsule Agent
capsule_agent = Agent(
    name=CAPSULE_NAME,
    port=CAPSULE_PORT,
    seed=CAPSULE_SEED,
    mailbox=True,  # Using mailbox for Agentverse connectivity
)

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# Global state
capsule_stats: Dict[str, Any] = {}


def create_text_message(text: str) -> ChatMessage:
    """Create a standard text ChatMessage."""
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


def initialize_storage():
    """Initialize Knowledge Capsule storage directories."""
    CAPSULE_DIR.mkdir(parents=True, exist_ok=True)
    CAPSULE_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create empty stats if doesn't exist
    if not CAPSULE_STATS_PATH.exists():
        with open(CAPSULE_STATS_PATH, 'w') as f:
            json.dump({
                'total_capsules': 0,
                'total_retrievals': 0,
                'created_at': datetime.now(timezone.utc).isoformat()
            }, f)


def load_stats():
    """Load capsule statistics."""
    global capsule_stats
    
    try:
        with open(CAPSULE_STATS_PATH, 'r') as f:
            capsule_stats = json.load(f)
    except Exception:
        capsule_stats = {
            'total_capsules': 0,
            'total_retrievals': 0,
            'created_at': datetime.now(timezone.utc).isoformat()
        }


def save_stats():
    """Save capsule statistics."""
    try:
        with open(CAPSULE_STATS_PATH, 'w') as f:
            json.dump(capsule_stats, f, indent=2)
    except Exception:
        pass  # Silent fail


def generate_capsule_id(query: str, reasoning_type: str) -> str:
    """
    Generate unique capsule ID based on query and reasoning type.
    
    Args:
        query: Original query
        reasoning_type: Type of reasoning
        
    Returns:
        Unique capsule ID
    """
    content = f"{query}_{reasoning_type}_{datetime.now(timezone.utc).isoformat()}"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def create_knowledge_capsule(
    reasoning_chain: Dict[str, Any],
    validation_proof: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Create a comprehensive Knowledge Capsule from validated reasoning.
    
    Args:
        reasoning_chain: Validated reasoning chain
        validation_proof: Validation proof document
        
    Returns:
        Knowledge Capsule dictionary
    """
    capsule_id = generate_capsule_id(
        reasoning_chain.get('query', ''),
        reasoning_chain.get('reasoning_type', 'unknown')
    )
    
    capsule = {
        # Core Identity
        'capsule_id': capsule_id,
        'version': '1.0',
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat(),
        
        # Query Information
        'query': reasoning_chain.get('query', ''),
        'reasoning_type': reasoning_chain.get('reasoning_type', 'unknown'),
        'key_concepts': reasoning_chain.get('key_concepts', []),
        
        # Reasoning Content
        'reasoning_chain': reasoning_chain,
        'reasoning_steps': reasoning_chain.get('reasoning_steps', ''),
        'confidence': reasoning_chain.get('confidence', 0.0),
        
        # Validation
        'validation_proof': validation_proof,
        'validation_status': validation_proof.get('status', 'unknown'),
        'validator_id': validation_proof.get('validator', {}).get('id', 'unknown'),
        'validation_timestamp': validation_proof.get('timestamp', ''),
        
        # MeTTa Knowledge (if available)
        'metta_knowledge_used': reasoning_chain.get('metta_knowledge_used', {}),
        
        # Usage Statistics
        'usage_stats': {
            'retrieval_count': 0,
            'last_retrieved': None,
            'referenced_by': []
        },
        
        # Metadata
        'metadata': {
            'auto_approved': validation_proof.get('metadata', {}).get('auto_approved', False),
            'requires_validation': reasoning_chain.get('requires_validation', True),
            'tags': [],
            'category': reasoning_chain.get('reasoning_type', 'general')
        }
    }
    
    return capsule


def save_capsule(capsule: Dict[str, Any]) -> bool:
    """
    Save Knowledge Capsule to disk as JSON.
    
    Args:
        capsule: Knowledge Capsule to save
        
    Returns:
        True if successful
    """
    try:
        capsule_id = capsule['capsule_id']
        capsule_file = CAPSULE_STORAGE_DIR / f"{capsule_id}.json"
        
        with open(capsule_file, 'w') as f:
            json.dump(capsule, f, indent=2)
        
        return True
        
    except Exception:
        return False


def retrieve_capsule(capsule_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve a Knowledge Capsule by ID from JSON storage.
    
    Args:
        capsule_id: Capsule ID to retrieve
        
    Returns:
        Capsule dictionary or None
    """
    try:
        capsule_file = CAPSULE_STORAGE_DIR / f"{capsule_id}.json"
        
        if not capsule_file.exists():
            return None
        
        with open(capsule_file, 'r') as f:
            capsule = json.load(f)
        
        # Update usage statistics
        capsule['usage_stats']['retrieval_count'] += 1
        capsule['usage_stats']['last_retrieved'] = datetime.now(timezone.utc).isoformat()
        
        # Save updated capsule
        with open(capsule_file, 'w') as f:
            json.dump(capsule, f, indent=2)
        
        # Update global stats
        capsule_stats['total_retrievals'] = capsule_stats.get('total_retrievals', 0) + 1
        save_stats()
        
        return capsule
        
    except Exception:
        return None


def list_all_capsules() -> List[Dict[str, Any]]:
    """
    List all available Knowledge Capsules from JSON storage.
    
    Returns:
        List of capsule summaries
    """
    capsules = []
    
    try:
        for capsule_file in CAPSULE_STORAGE_DIR.glob("*.json"):
            with open(capsule_file, 'r') as f:
                capsule = json.load(f)
                capsules.append({
                    'capsule_id': capsule['capsule_id'],
                    'query': capsule['query'],
                    'reasoning_type': capsule['reasoning_type'],
                    'confidence': capsule['confidence'],
                    'created_at': capsule['created_at'],
                    'retrieval_count': capsule['usage_stats']['retrieval_count']
                })
    except Exception:
        pass  # Return empty list on error
    
    return capsules


@chat.on_message(ChatMessage)
async def handle_capsule_request(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming capsule storage/retrieval requests."""
    # ACK first (required by chat protocol)
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))
    
    ctx.logger.info(f"Capsule request from {sender[:20]}...")
    
    # Extract content and metadata
    query_text = None
    reasoning_chain = None
    validation_proof = None
    action = "store"  # Default action
    original_sender = None  # For feedback routing (from validation agent)
    
    for content in msg.content:
        if isinstance(content, TextContent):
            query_text = content.text
        
        if isinstance(content, MetadataContent):
            metadata = content.metadata
            
            # Extract reasoning chain
            if 'reasoning_chain' in metadata:
                rc = metadata['reasoning_chain']
                if isinstance(rc, str):
                    try:
                        reasoning_chain = json.loads(rc)
                    except:
                        pass
                else:
                    reasoning_chain = rc
            
            # Extract validation proof
            if 'validation_proof' in metadata:
                vp = metadata['validation_proof']
                if isinstance(vp, str):
                    try:
                        validation_proof = json.loads(vp)
                    except:
                        pass
                else:
                    validation_proof = vp
            
            # Check for action type
            if 'action' in metadata:
                action = metadata['action']
            
            # Get original sender for feedback routing
            if 'original_sender' in metadata:
                original_sender = metadata['original_sender']
    
    # Handle different actions
    if action == "retrieve":
        # Retrieve capsule by ID
        capsule_id = query_text
        ctx.logger.info(f"Retrieving: {capsule_id}")
        
        capsule = retrieve_capsule(capsule_id)
        
        if capsule:
            response = f"✅ KNOWLEDGE CAPSULE RETRIEVED\n\n"
            response += f"ID: {capsule['capsule_id']}\n"
            response += f"Query: {capsule['query']}\n"
            response += f"Type: {capsule['reasoning_type']}\n"
            response += f"Confidence: {capsule['confidence']:.2%}\n"
            response += f"Retrieved: {capsule['usage_stats']['retrieval_count']} times\n\n"
            response += f"Reasoning:\n{capsule['reasoning_steps']}"
        else:
            response = f"❌ Capsule not found: {capsule_id}"
        
        await ctx.send(sender, create_text_message(response))
        
    elif action == "list":
        # List all capsules
        ctx.logger.info("Listing capsules...")
        
        capsules = list_all_capsules()
        
        response = f"📚 KNOWLEDGE CAPSULE LIBRARY\n\n"
        response += f"Total Capsules: {len(capsules)}\n\n"
        
        for i, cap in enumerate(capsules[:20], 1):  # Limit to 20
            response += f"{i}. {cap['capsule_id']}\n"
            response += f"   Query: {cap['query'][:60]}...\n"
            response += f"   Type: {cap['reasoning_type']} | Confidence: {cap['confidence']:.2%}\n"
            response += f"   Retrieved: {cap['retrieval_count']} times\n\n"
        
        if len(capsules) > 20:
            response += f"... and {len(capsules) - 20} more capsules\n"
        
        await ctx.send(sender, create_text_message(response))
        
    else:
        # Default: Store new capsule
        if not reasoning_chain or not validation_proof:
            ctx.logger.warning("Missing reasoning chain or validation proof")
            await ctx.send(sender, create_text_message(
                "❌ Error: Missing reasoning chain or validation proof for capsule creation"
            ))
            return
        
        ctx.logger.info(f"Creating capsule for: {reasoning_chain.get('query', 'N/A')[:50]}...")
        
        # Create capsule
        capsule = create_knowledge_capsule(reasoning_chain, validation_proof)
        
        # Save to disk
        saved = save_capsule(capsule)
        
        if not saved:
            await ctx.send(sender, create_text_message(
                "❌ Error: Failed to save Knowledge Capsule"
            ))
            return
        
        # Update statistics
        capsule_stats['total_capsules'] = capsule_stats.get('total_capsules', 0) + 1
        capsule_stats['last_capsule_created'] = capsule['created_at']
        save_stats()
        
        ctx.logger.info(f"✅ Created: {capsule['capsule_id']}")
        
        # Build confirmation message
        response = f"✅ KNOWLEDGE CAPSULE SAVED!\n\n"
        response += f"📦 Capsule ID: `{capsule['capsule_id']}`\n"
        response += f"❓ Query: {capsule['query']}\n"
        response += f"🧠 Reasoning Type: {capsule['reasoning_type']}\n"
        response += f"📊 Confidence: {capsule['confidence']:.0%}\n"
        response += f"✓ Validated By: Multi-Agent System\n"
        response += f"💾 Storage: JSON File (Supabase pgvector coming soon)\n\n"
        response += f"📈 **Knowledge Base Statistics:**\n"
        response += f"   • Total Capsules: {capsule_stats['total_capsules']}\n"
        response += f"   • Total Retrievals: {capsule_stats.get('total_retrievals', 0)}\n\n"
        response += f"🎯 This verified knowledge is now available for reuse in future queries!"
        
        # Send feedback to original requester (user/query router)
        feedback_recipient = original_sender if original_sender else sender
        await ctx.send(feedback_recipient, create_text_message(response))
        
        # Log where feedback was sent
        if original_sender:
            ctx.logger.info(f"📤 Feedback sent to original requester: {original_sender[:20]}...")
        else:
            ctx.logger.info(f"📤 Feedback sent to sender: {sender[:20]}...")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    pass  # Silent ACK


@capsule_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Capsule Agent and JSON storage."""
    ctx.logger.info("=" * 60)
    ctx.logger.info("📚 Initializing Capsule Agent...")
    ctx.logger.info("=" * 60)
    
    # Initialize storage
    try:
        initialize_storage()
        ctx.logger.info(f"  ✓ Storage initialized: {CAPSULE_DIR}")
    except Exception as e:
        ctx.logger.error(f"  ✗ Storage initialization failed: {e}")
        return
    
    # Load statistics
    try:
        load_stats()
        ctx.logger.info(f"  ✓ Statistics loaded: {capsule_stats.get('total_capsules', 0)} capsules")
    except Exception as e:
        ctx.logger.error(f"  ✗ Failed to load stats: {e}")
    
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"✅ Capsule Agent Ready!")
    ctx.logger.info(f"   Address: {capsule_agent.address}")
    ctx.logger.info(f"   Port: {CAPSULE_PORT}")
    ctx.logger.info(f"   Storage: {CAPSULE_STORAGE_DIR}")
    ctx.logger.info(f"   Total Capsules: {capsule_stats.get('total_capsules', 0)}")
    ctx.logger.info("=" * 60)
    ctx.logger.info("⏳ Waiting for validated reasoning chains...")


# Include chat protocol
capsule_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print(f"📚 Capsule Agent starting... (JSON storage)")
    capsule_agent.run()
