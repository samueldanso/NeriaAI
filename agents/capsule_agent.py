# capsule_agent.py
"""
NeriaMind Capsule Agent
Knowledge storage and retrieval system for verified Knowledge Capsules
Creates, stores, and manages validated reasoning chains
Provides fast semantic search via FAISS indexing
Tracks usage statistics and maintains knowledge base integrity

Features:
- JSON-based capsule storage
- FAISS vector indexing for semantic search
- Capsule versioning and metadata
- Usage tracking and analytics
- Integration with Research Agent FAISS index
- Capsule retrieval and reusability
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

# FAISS and embeddings (with fallback)
try:
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    FAISS_AVAILABLE = True
except ImportError:
    print("⚠️  FAISS/sentence-transformers not installed. Using mock storage.")
    FAISS_AVAILABLE = False
    faiss = None
    np = None
    SentenceTransformer = None

# Load environment variables
load_dotenv()

# Agent configuration
CAPSULE_NAME = os.getenv("CAPSULE_NAME", "capsule_agent")
CAPSULE_PORT = int(os.getenv("CAPSULE_PORT", "9004"))
CAPSULE_SEED = os.getenv("CAPSULE_SEED", "capsule_agent_secret_seed")

# Storage paths (shared with Research Agent)
CAPSULE_DIR = Path("data/knowledge_capsules")
CAPSULE_STORAGE_DIR = CAPSULE_DIR / "capsules"
FAISS_INDEX_PATH = CAPSULE_DIR / "capsules.index"
CAPSULE_METADATA_PATH = CAPSULE_DIR / "capsules_metadata.json"
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
embedding_model: Optional[Any] = None
faiss_index: Optional[Any] = None
capsule_metadata: List[Dict[str, Any]] = []
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
    
    # Create empty metadata if doesn't exist
    if not CAPSULE_METADATA_PATH.exists():
        with open(CAPSULE_METADATA_PATH, 'w') as f:
            json.dump([], f)
        print(f"✓ Created capsule metadata file")
    
    # Create empty stats if doesn't exist
    if not CAPSULE_STATS_PATH.exists():
        with open(CAPSULE_STATS_PATH, 'w') as f:
            json.dump({
                'total_capsules': 0,
                'total_retrievals': 0,
                'created_at': datetime.now(timezone.utc).isoformat()
            }, f)
        print(f"✓ Created capsule statistics file")
    
    print(f"✓ Storage initialized at {CAPSULE_DIR}")


def load_embedding_model():
    """Load sentence-transformers model for embeddings."""
    if not FAISS_AVAILABLE:
        return None
    
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✓ Loaded embedding model: all-MiniLM-L6-v2")
        return model
    except Exception as e:
        print(f"❌ Failed to load embedding model: {e}")
        return None


def load_faiss_index():
    """Load or create FAISS index."""
    global capsule_metadata
    
    if not FAISS_AVAILABLE:
        return None
    
    try:
        if FAISS_INDEX_PATH.exists():
            index = faiss.read_index(str(FAISS_INDEX_PATH))
            print(f"✓ Loaded FAISS index: {index.ntotal} vectors")
            
            # Load metadata
            with open(CAPSULE_METADATA_PATH, 'r') as f:
                capsule_metadata = json.load(f)
            print(f"✓ Loaded {len(capsule_metadata)} capsule metadata entries")
            
            return index
        else:
            print("⚠️  No existing FAISS index, creating new one")
            # Create empty FAISS index (384 dimensions for all-MiniLM-L6-v2)
            index = faiss.IndexFlatL2(384)
            return index
    except Exception as e:
        print(f"❌ Failed to load FAISS index: {e}")
        return None


def load_stats():
    """Load capsule statistics."""
    global capsule_stats
    
    try:
        with open(CAPSULE_STATS_PATH, 'r') as f:
            capsule_stats = json.load(f)
        print(f"✓ Loaded statistics: {capsule_stats.get('total_capsules', 0)} capsules")
    except Exception as e:
        print(f"⚠️  Could not load stats: {e}")
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
    except Exception as e:
        print(f"❌ Failed to save stats: {e}")


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
    Save Knowledge Capsule to disk.
    
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
        
        print(f"✓ Saved capsule to {capsule_file}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to save capsule: {e}")
        return False


def index_capsule_in_faiss(capsule: Dict[str, Any]) -> bool:
    """
    Add capsule to FAISS index for semantic search.
    
    Args:
        capsule: Knowledge Capsule to index
        
    Returns:
        True if successful
    """
    if not FAISS_AVAILABLE or embedding_model is None or faiss_index is None:
        print("⚠️  FAISS not available, skipping indexing")
        return False
    
    try:
        # Create searchable content (combine query + reasoning steps)
        searchable_content = f"{capsule['query']} {capsule['reasoning_steps']}"
        
        # Encode and add to FAISS
        embedding = embedding_model.encode([searchable_content])
        faiss_index.add(embedding.astype('float32'))
        
        # Add to metadata list (for Research Agent)
        metadata_entry = {
            'capsule_id': capsule['capsule_id'],
            'query': capsule['query'],
            'reasoning_type': capsule['reasoning_type'],
            'content': capsule['reasoning_steps'],
            'confidence': capsule['confidence'],
            'timestamp': capsule['created_at']
        }
        capsule_metadata.append(metadata_entry)
        
        # Save updated index and metadata
        faiss.write_index(faiss_index, str(FAISS_INDEX_PATH))
        with open(CAPSULE_METADATA_PATH, 'w') as f:
            json.dump(capsule_metadata, f, indent=2)
        
        print(f"✓ Indexed capsule in FAISS (total: {faiss_index.ntotal})")
        return True
        
    except Exception as e:
        print(f"❌ Failed to index capsule: {e}")
        return False


def retrieve_capsule(capsule_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve a Knowledge Capsule by ID.
    
    Args:
        capsule_id: Capsule ID to retrieve
        
    Returns:
        Capsule dictionary or None
    """
    try:
        capsule_file = CAPSULE_STORAGE_DIR / f"{capsule_id}.json"
        
        if not capsule_file.exists():
            print(f"⚠️  Capsule {capsule_id} not found")
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
        
        print(f"✓ Retrieved capsule {capsule_id}")
        return capsule
        
    except Exception as e:
        print(f"❌ Failed to retrieve capsule: {e}")
        return None


def list_all_capsules() -> List[Dict[str, Any]]:
    """
    List all available Knowledge Capsules.
    
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
    except Exception as e:
        print(f"❌ Failed to list capsules: {e}")
    
    return capsules


@chat.on_message(ChatMessage)
async def handle_capsule_request(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming capsule storage/retrieval requests."""
    # ACK first (required by chat protocol)
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))
    
    ctx.logger.info(f"📥 Capsule request from {sender}")
    
    # Extract content and metadata
    query_text = None
    reasoning_chain = None
    validation_proof = None
    action = "store"  # Default action
    
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
    
    # Handle different actions
    if action == "retrieve":
        # Retrieve capsule by ID
        capsule_id = query_text
        ctx.logger.info(f"🔍 Retrieving capsule: {capsule_id}")
        
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
        ctx.logger.info("📋 Listing all capsules...")
        
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
        
        ctx.logger.info(f"💾 Creating Knowledge Capsule for: {reasoning_chain.get('query', 'N/A')[:50]}...")
        
        # Create capsule
        capsule = create_knowledge_capsule(reasoning_chain, validation_proof)
        
        # Save to disk
        saved = save_capsule(capsule)
        
        if not saved:
            await ctx.send(sender, create_text_message(
                "❌ Error: Failed to save Knowledge Capsule"
            ))
            return
        
        # Index in FAISS
        indexed = index_capsule_in_faiss(capsule)
        
        # Update statistics
        capsule_stats['total_capsules'] = capsule_stats.get('total_capsules', 0) + 1
        capsule_stats['last_capsule_created'] = capsule['created_at']
        save_stats()
        
        ctx.logger.info(f"✅ Knowledge Capsule created: {capsule['capsule_id']}")
        
        # Send confirmation
        response = f"✅ KNOWLEDGE CAPSULE CREATED\n\n"
        response += f"Capsule ID: {capsule['capsule_id']}\n"
        response += f"Query: {capsule['query']}\n"
        response += f"Type: {capsule['reasoning_type']}\n"
        response += f"Confidence: {capsule['confidence']:.2%}\n"
        response += f"Validated By: {capsule['validator_id']}\n"
        response += f"FAISS Indexed: {'✓' if indexed else '✗'}\n\n"
        response += f"📊 Knowledge Base Statistics:\n"
        response += f"- Total Capsules: {capsule_stats['total_capsules']}\n"
        response += f"- Total Retrievals: {capsule_stats.get('total_retrievals', 0)}\n\n"
        response += f"This verified knowledge is now available for reuse in future queries!"
        
        await ctx.send(sender, create_text_message(response))


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender}")


@capsule_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Capsule Agent and storage systems."""
    global embedding_model, faiss_index
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("📚 NERIA Capsule Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {CAPSULE_NAME}")
    ctx.logger.info(f"Agent Address: {capsule_agent.address}")
    ctx.logger.info(f"Port: {CAPSULE_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)
    
    # Initialize storage
    ctx.logger.info("📁 Initializing storage systems...")
    initialize_storage()
    
    # Load statistics
    ctx.logger.info("📊 Loading statistics...")
    load_stats()
    
    # Load embedding model
    if FAISS_AVAILABLE:
        ctx.logger.info("🧠 Loading embedding model...")
        embedding_model = load_embedding_model()
        
        if embedding_model:
            # Load FAISS index
            ctx.logger.info("📊 Loading FAISS index...")
            faiss_index = load_faiss_index()
            
            if faiss_index:
                ctx.logger.info(f"✓ FAISS ready: {faiss_index.ntotal} vectors indexed")
            else:
                ctx.logger.warning("⚠️  FAISS index initialization failed")
        else:
            ctx.logger.warning("⚠️  Embedding model not available")
    else:
        ctx.logger.warning("⚠️  FAISS not installed - semantic search disabled")
    
    # Log configuration
    ctx.logger.info("=" * 60)
    ctx.logger.info("📍 Configuration:")
    ctx.logger.info(f"  Storage Path: {CAPSULE_DIR}")
    ctx.logger.info(f"  Total Capsules: {capsule_stats.get('total_capsules', 0)}")
    ctx.logger.info(f"  Total Retrievals: {capsule_stats.get('total_retrievals', 0)}")
    ctx.logger.info(f"  FAISS Available: {'✓ Yes' if FAISS_AVAILABLE else '✗ No'}")
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ Capsule Agent ready!")
    ctx.logger.info("   Knowledge base integrity maintained")
    ctx.logger.info("=" * 60)


# Include chat protocol
capsule_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting NERIA Capsule Agent...")
    print("=" * 60)
    print(f"📍 Agent Address: {capsule_agent.address}")
    print(f"🔌 Port: {CAPSULE_PORT}")
    print(f"📬 Mailbox: Enabled")
    print(f"📚 Storage: {CAPSULE_DIR}")
    print(f"🔍 FAISS Indexing: {'Enabled' if FAISS_AVAILABLE else 'DISABLED (Mock Mode)'}")
    print("=" * 60)
    print("Waiting for capsule storage/retrieval requests...\n")
    
    capsule_agent.run()
