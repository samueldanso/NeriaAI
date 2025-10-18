# research_agent.py
"""
NeriaMind Research Agent
Gathers relevant context and sources for reasoning
Searches existing Knowledge Capsules for reusability
Falls back to web search if needed
Provides structured context to Reasoning Agent

Features:
- FAISS vector similarity search for Knowledge Capsules
- Sentence-transformers embeddings
- Web search fallback (DuckDuckGo)
- Low-latency pre-loaded indices
- Comprehensive verified reasoning chain database
"""

import os
import json
import pickle
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

import requests
from dotenv import load_dotenv

# FAISS and embeddings (with fallback)
try:
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer
    FAISS_AVAILABLE = True
except ImportError:
    print("⚠️  FAISS/sentence-transformers not installed. Using mock search.")
    FAISS_AVAILABLE = False
    faiss = None
    np = None
    SentenceTransformer = None

# Load environment variables
load_dotenv()

# Agent configuration
RESEARCH_NAME = os.getenv("RESEARCH_NAME", "research_agent")
RESEARCH_PORT = int(os.getenv("RESEARCH_PORT", "9002"))
RESEARCH_SEED = os.getenv("RESEARCH_SEED", "research_agent_secret_seed")

# Reasoning Agent address (for forwarding research results)
REASONING_AGENT_ADDRESS = os.getenv("REASONING_AGENT_ADDRESS", "")

# Knowledge Capsule storage
CAPSULE_DIR = Path("data/knowledge_capsules")
FAISS_INDEX_PATH = CAPSULE_DIR / "capsules.index"
CAPSULE_METADATA_PATH = CAPSULE_DIR / "capsules_metadata.json"

# Web search configuration
ENABLE_WEB_SEARCH = os.getenv("ENABLE_WEB_SEARCH", "true").lower() == "true"
MAX_WEB_RESULTS = int(os.getenv("MAX_WEB_RESULTS", "3"))

# Similarity search configuration
TOP_K_CAPSULES = int(os.getenv("TOP_K_CAPSULES", "5"))
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.6"))

# Initialize the Research Agent
research_agent = Agent(
    name=RESEARCH_NAME,
    port=RESEARCH_PORT,
    seed=RESEARCH_SEED,
    mailbox=True,  # Using mailbox for Agentverse connectivity
)

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# Global state for FAISS index and embeddings
embedding_model: Optional[Any] = None
faiss_index: Optional[Any] = None
capsule_metadata: List[Dict[str, Any]] = []


def create_text_message(text: str) -> ChatMessage:
    """Create a standard text ChatMessage."""
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


def initialize_capsule_storage():
    """Initialize Knowledge Capsule storage directory."""
    CAPSULE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create empty metadata if doesn't exist
    if not CAPSULE_METADATA_PATH.exists():
        with open(CAPSULE_METADATA_PATH, 'w') as f:
            json.dump([], f)
        print(f"✓ Created empty capsule metadata at {CAPSULE_METADATA_PATH}")


def load_embedding_model():
    """Load sentence-transformers model for embeddings."""
    if not FAISS_AVAILABLE:
        return None
    
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✓ Loaded sentence-transformers model: all-MiniLM-L6-v2")
        return model
    except Exception as e:
        print(f"❌ Failed to load embedding model: {e}")
        return None


def load_faiss_index():
    """Load pre-existing FAISS index and metadata."""
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
            print("⚠️  No existing FAISS index found, creating new one")
            # Create empty FAISS index (384 dimensions for all-MiniLM-L6-v2)
            index = faiss.IndexFlatL2(384)
            return index
    except Exception as e:
        print(f"❌ Failed to load FAISS index: {e}")
        return None


def search_knowledge_capsules(query: str, top_k: int = TOP_K_CAPSULES) -> List[Dict[str, Any]]:
    """
    Search Knowledge Capsules using FAISS similarity search.
    
    Args:
        query: Search query
        top_k: Number of top results to return
        
    Returns:
        List of relevant capsule passages with metadata
    """
    if not FAISS_AVAILABLE or embedding_model is None or faiss_index is None:
        return []
    
    try:
        # Check if index is empty
        if faiss_index.ntotal == 0:
            print("⚠️  FAISS index is empty, no capsules to search")
            return []
        
        # Encode query
        query_embedding = embedding_model.encode([query])
        
        # Search FAISS index
        distances, indices = faiss_index.search(query_embedding.astype('float32'), top_k)
        
        # Filter by similarity threshold and build results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx >= 0 and idx < len(capsule_metadata):
                similarity = 1.0 / (1.0 + dist)  # Convert L2 distance to similarity
                if similarity >= SIMILARITY_THRESHOLD:
                    capsule = capsule_metadata[idx].copy()
                    capsule['similarity'] = float(similarity)
                    results.append(capsule)
        
        print(f"✓ Found {len(results)} relevant capsules (threshold: {SIMILARITY_THRESHOLD})")
        return results
        
    except Exception as e:
        print(f"❌ FAISS search failed: {e}")
        return []


def web_search_fallback(query: str, max_results: int = MAX_WEB_RESULTS) -> List[Dict[str, str]]:
    """
    Fallback to web search if Knowledge Capsules are insufficient.
    Uses multiple search strategies for better results.
    
    Args:
        query: Search query
        max_results: Maximum number of results
        
    Returns:
        List of web search results with title and snippet
    """
    if not ENABLE_WEB_SEARCH:
        print("⚠️  Web search disabled. Set ENABLE_WEB_SEARCH=true in .env")
        return []
    
    results = []
    
    # Strategy 1: Try DuckDuckGo Instant Answer API
    try:
        print(f"🔍 Searching DuckDuckGo for: {query}")
        url = "https://api.duckduckgo.com/"
        params = {
            'q': query,
            'format': 'json',
            'no_html': 1,
            'skip_disambig': 1
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Extract abstract
        if data.get('Abstract'):
            results.append({
                'source': 'DuckDuckGo',
                'title': data.get('Heading', 'Overview'),
                'snippet': data.get('Abstract', ''),
                'url': data.get('AbstractURL', '')
            })
            print(f"  ✓ Found abstract: {data.get('Heading', 'Overview')}")
        
        # Extract related topics
        for topic in data.get('RelatedTopics', [])[:max_results]:
            if isinstance(topic, dict) and 'Text' in topic:
                results.append({
                    'source': 'DuckDuckGo Related',
                    'title': topic.get('Text', '')[:100],
                    'snippet': topic.get('Text', ''),
                    'url': topic.get('FirstURL', '')
                })
        
        if results:
            print(f"  ✓ DuckDuckGo found {len(results)} results")
            
    except Exception as e:
        print(f"  ⚠️  DuckDuckGo search failed: {e}")
    
    # Strategy 2: Try Wikipedia API if still no results
    if len(results) < 2:
        try:
            print(f"🔍 Searching Wikipedia for: {query}")
            wiki_url = "https://en.wikipedia.org/w/api.php"
            wiki_params = {
                'action': 'query',
                'list': 'search',
                'srsearch': query,
                'format': 'json',
                'srlimit': 3
            }
            
            response = requests.get(wiki_url, params=wiki_params, timeout=10)
            response.raise_for_status()
            wiki_data = response.json()
            
            for item in wiki_data.get('query', {}).get('search', []):
                results.append({
                    'source': 'Wikipedia',
                    'title': item.get('title', ''),
                    'snippet': item.get('snippet', '').replace('<span class="searchmatch">', '').replace('</span>', ''),
                    'url': f"https://en.wikipedia.org/wiki/{item.get('title', '').replace(' ', '_')}"
                })
            
            if wiki_data.get('query', {}).get('search'):
                print(f"  ✓ Wikipedia found {len(wiki_data['query']['search'])} results")
                
        except Exception as e:
            print(f"  ⚠️  Wikipedia search failed: {e}")
    
    print(f"✓ Total web search results: {len(results)}")
    return results[:max_results]


def format_research_context(
    query: str,
    capsules: List[Dict[str, Any]],
    web_results: List[Dict[str, str]]
) -> str:
    """
    Format research results into structured context for Reasoning Agent.
    
    Args:
        query: Original query
        capsules: Relevant Knowledge Capsules
        web_results: Web search results
        
    Returns:
        Formatted context string
    """
    context = f"# Research Context for Query: {query}\n\n"
    
    # Knowledge Capsules section
    if capsules:
        context += "## 📚 Verified Knowledge Capsules (Reusable)\n\n"
        for i, capsule in enumerate(capsules, 1):
            context += f"### Capsule {i} (Similarity: {capsule.get('similarity', 0):.2f})\n"
            context += f"**Query:** {capsule.get('query', 'N/A')}\n"
            context += f"**Type:** {capsule.get('reasoning_type', 'N/A')}\n"
            context += f"**Content:** {capsule.get('content', 'N/A')}\n"
            context += f"**Confidence:** {capsule.get('confidence', 0):.2f}\n"
            context += f"**Created:** {capsule.get('timestamp', 'N/A')}\n\n"
    else:
        context += "## 📚 Verified Knowledge Capsules\n\n"
        context += "_No relevant verified capsules found._\n\n"
    
    # Web search section
    if web_results:
        context += "## 🌐 External Sources\n\n"
        for i, result in enumerate(web_results, 1):
            context += f"### Source {i}: {result.get('title', 'Untitled')}\n"
            context += f"**Snippet:** {result.get('snippet', 'N/A')}\n"
            context += f"**URL:** {result.get('url', 'N/A')}\n\n"
    else:
        context += "## 🌐 External Sources\n\n"
        context += "_Web search disabled or no results found._\n\n"
    
    # Summary
    context += "## 📊 Research Summary\n\n"
    context += f"- **Capsules Found:** {len(capsules)}\n"
    context += f"- **External Sources:** {len(web_results)}\n"
    context += f"- **Recommendation:** {'Use verified capsules as foundation' if capsules else 'Generate new reasoning from external sources'}\n"
    
    return context


def add_knowledge_capsule(
    query: str,
    reasoning_type: str,
    content: str,
    confidence: float,
    metadata: Dict[str, Any] = None
):
    """
    Add a new verified Knowledge Capsule to the FAISS index.
    
    Args:
        query: Original query
        reasoning_type: Type of reasoning
        content: Reasoning content
        confidence: Confidence score
        metadata: Additional metadata
    """
    if not FAISS_AVAILABLE or embedding_model is None or faiss_index is None:
        print("⚠️  FAISS not available, cannot add capsule")
        return
    
    try:
        # Create capsule entry
        capsule = {
            'query': query,
            'reasoning_type': reasoning_type,
            'content': content,
            'confidence': confidence,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'metadata': metadata or {}
        }
        
        # Encode and add to FAISS
        embedding = embedding_model.encode([content])
        faiss_index.add(embedding.astype('float32'))
        
        # Add to metadata
        capsule_metadata.append(capsule)
        
        # Save index and metadata
        faiss.write_index(faiss_index, str(FAISS_INDEX_PATH))
        with open(CAPSULE_METADATA_PATH, 'w') as f:
            json.dump(capsule_metadata, f, indent=2)
        
        print(f"✓ Added Knowledge Capsule (total: {len(capsule_metadata)})")
        
    except Exception as e:
        print(f"❌ Failed to add capsule: {e}")


@chat.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming research requests."""
    # ACK first (required by chat protocol)
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))
    
    ctx.logger.info(f"📥 Research request from {sender}")
    
    # Extract query text
    query_text = None
    for content in msg.content:
        if isinstance(content, TextContent):
            query_text = content.text
            break
    
    if not query_text:
        ctx.logger.warning("No query text found in message")
        await ctx.send(sender, create_text_message(
            "❌ Error: No query text provided"
        ))
        return
    
    ctx.logger.info(f"🔍 Researching: {query_text}")
    
    # Step 1: Search Knowledge Capsules
    ctx.logger.info("📚 Searching Knowledge Capsules...")
    capsules = search_knowledge_capsules(query_text)
    ctx.logger.info(f"✓ Found {len(capsules)} relevant capsules")
    
    # Step 2: Web search fallback if needed
    web_results = []
    if len(capsules) < 2 and ENABLE_WEB_SEARCH:
        ctx.logger.info("🌐 Performing web search fallback...")
        web_results = web_search_fallback(query_text)
        ctx.logger.info(f"✓ Found {len(web_results)} web results")
    
    # Step 3: Format research context
    ctx.logger.info("📝 Formatting research context...")
    research_context = format_research_context(query_text, capsules, web_results)
    
    # Step 4: Decide next step
    if REASONING_AGENT_ADDRESS:
        # Forward to Reasoning Agent with context
        ctx.logger.info("📤 Forwarding to Reasoning Agent with context...")
        
        await ctx.send(
            REASONING_AGENT_ADDRESS,
            ChatMessage(
                timestamp=datetime.now(timezone.utc),
                msg_id=uuid4(),
                content=[
                    TextContent(type="text", text=query_text),
                    MetadataContent(type="metadata", metadata={
                        "research_context": research_context,
                        "capsules_found": str(len(capsules)),
                        "web_results_found": str(len(web_results)),
                        "original_sender": sender
                    })
                ]
            )
        )
        ctx.logger.info("✓ Research context forwarded to Reasoning Agent")
        
    else:
        # Send research context back to sender
        ctx.logger.info("📤 Sending research context to sender...")
        await ctx.send(sender, create_text_message(research_context))
        ctx.logger.info("✓ Research context sent")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender}")


@research_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Research Agent and FAISS index."""
    global embedding_model, faiss_index
    
    ctx.logger.info("=" * 60)
    ctx.logger.info("🔬 NERIA Research Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {RESEARCH_NAME}")
    ctx.logger.info(f"Agent Address: {research_agent.address}")
    ctx.logger.info(f"Port: {RESEARCH_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)
    
    # Initialize storage
    ctx.logger.info("📁 Initializing Knowledge Capsule storage...")
    initialize_capsule_storage()
    
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
        ctx.logger.warning("⚠️  FAISS not installed - using mock search")
    
    # Log configuration
    ctx.logger.info("=" * 60)
    ctx.logger.info("📍 Configuration:")
    ctx.logger.info(f"  Reasoning Agent: {REASONING_AGENT_ADDRESS or '✗ Not configured'}")
    ctx.logger.info(f"  Web Search: {'✓ Enabled' if ENABLE_WEB_SEARCH else '✗ Disabled'}")
    ctx.logger.info(f"  Top-K Capsules: {TOP_K_CAPSULES}")
    ctx.logger.info(f"  Similarity Threshold: {SIMILARITY_THRESHOLD}")
    ctx.logger.info(f"  FAISS Available: {'✓ Yes' if FAISS_AVAILABLE else '✗ No (Mock Mode)'}")
    ctx.logger.info("=" * 60)
    ctx.logger.info("✅ Research Agent ready!")
    ctx.logger.info("=" * 60)


# Include chat protocol
research_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 Starting NERIA Research Agent...")
    print("=" * 60)
    print(f"📍 Agent Address: {research_agent.address}")
    print(f"🔌 Port: {RESEARCH_PORT}")
    print(f"📬 Mailbox: Enabled")
    print(f"🔍 FAISS Search: {'Enabled' if FAISS_AVAILABLE else 'DISABLED (Mock Mode)'}")
    print(f"🌐 Web Search: {'Enabled' if ENABLE_WEB_SEARCH else 'Disabled'}")
    print("=" * 60)
    print("Waiting for research requests...\n")
    
    research_agent.run()
