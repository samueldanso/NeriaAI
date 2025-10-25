# research_agent.py
"""
NeriaAI Research Agent
Gathers relevant context and sources for reasoning
Searches existing Knowledge Capsules for reusability
Falls back to web search if needed
Provides structured context to Reasoning Agent
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

# Load environment variables
load_dotenv()

# Agent configuration
RESEARCH_NAME = os.getenv("RESEARCH_NAME", "research_agent")
RESEARCH_PORT = int(os.getenv("RESEARCH_PORT", "9002"))
RESEARCH_SEED = os.getenv("RESEARCH_SEED", "research_agent_secret_seed")

# ASI:One API configuration (for intelligent summarization)
ASI_ONE_API_KEY = os.getenv("ASI_ONE_API_KEY", "")
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi1.ai/v1")  # Correct ASI:One endpoint
ASI_ONE_MODEL = os.getenv("ASI_ONE_MODEL", "asi1-mini")  # ASI:One model (asi1-mini, asi1-fast, asi1-extended, asi1-agentic, asi1-graph)
ASI_ONE_TIMEOUT = int(os.getenv("ASI_ONE_TIMEOUT", "30"))  # API timeout in seconds
ENABLE_ASI_ONE_SUMMARY = os.getenv("ENABLE_ASI_ONE_SUMMARY", "true").lower() == "true"

# Reasoning Agent address (for forwarding research results)
REASONING_AGENT_ADDRESS = os.getenv("REASONING_AGENT_ADDRESS", "")

# Knowledge Capsule storage (JSON files only - Supabase pgvector coming later)
CAPSULE_DIR = Path("data/knowledge_capsules")
CAPSULE_STORAGE_DIR = CAPSULE_DIR / "capsules"

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


def create_text_message(text: str) -> ChatMessage:
    """Create a standard text ChatMessage."""
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)]
    )


# Storage initialization is now handled by capsule_agent


def search_knowledge_capsules(query: str, top_k: int = TOP_K_CAPSULES) -> List[Dict[str, Any]]:
    """
    Search Knowledge Capsules using simple JSON keyword matching.
    Future: Will be replaced with Supabase pgvector semantic search

    Args:
        query: Search query
        top_k: Number of top results to return

    Returns:
        List of relevant capsule passages with metadata
    """
    try:
        # Check if capsule directory exists
        if not CAPSULE_STORAGE_DIR.exists():
            return []

        # Get all capsule JSON files
        capsule_files = list(CAPSULE_STORAGE_DIR.glob("*.json"))
        if not capsule_files:
            return []

        # Simple keyword matching (will be replaced with pgvector)
        query_lower = query.lower()
        results = []

        for capsule_file in capsule_files:
            try:
                with open(capsule_file, 'r') as f:
                    capsule = json.load(f)

                # Check if query keywords match capsule content
                searchable_text = f"{capsule.get('query', '')} {capsule.get('reasoning_steps', '')} {capsule.get('reasoning_type', '')}".lower()

                # Simple scoring based on keyword matches
                query_words = query_lower.split()
                matches = sum(1 for word in query_words if word in searchable_text)

                if matches > 0:
                    similarity = matches / len(query_words)
                    if similarity >= SIMILARITY_THRESHOLD:
                        results.append({
                            'capsule_id': capsule.get('capsule_id'),
                            'query': capsule.get('query'),
                            'reasoning_type': capsule.get('reasoning_type'),
                            'content': capsule.get('reasoning_steps', ''),
                            'confidence': capsule.get('confidence', 0.0),
                            'similarity': similarity,
                            'timestamp': capsule.get('created_at', '')
                        })
            except Exception:
                continue

        # Sort by similarity and return top_k
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]

    except Exception:
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

    # Proper headers to avoid 403 errors
    headers = {
        'User-Agent': 'NeriaAI Research Agent/1.0 (Educational Purpose; https://github.com/neria-ai)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
    }

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

        response = requests.get(url, params=params, headers=headers, timeout=10)
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

            response = requests.get(wiki_url, params=wiki_params, headers=headers, timeout=10)
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


def summarize_with_asi_one(query: str, web_results: List[Dict[str, str]]) -> Optional[str]:
    """
    Use ASI:One API to intelligently summarize research results.

    Args:
        query: Original query
        web_results: Web search results

    Returns:
        AI-generated summary or None if API fails
    """
    if not ASI_ONE_API_KEY or not ENABLE_ASI_ONE_SUMMARY:
        return None

    try:
        # Prepare context from web results
        results_text = "\n\n".join([
            f"Source {i+1}: {r.get('title', 'Untitled')}\n{r.get('snippet', '')}"
            for i, r in enumerate(web_results[:3])
        ])

        prompt = f"""You are a research assistant. Based on the following search results, provide a clear, concise answer to the user's question.

Question: {query}

Search Results:
{results_text}

Provide a comprehensive answer synthesizing the information above. Be factual and cite sources when relevant."""

        headers = {
            "Authorization": f"Bearer {ASI_ONE_API_KEY}",
            "Content-Type": "application/json"
        }

        # ASI:One API format (based on official documentation)
        # Available models: asi1-mini, asi1-fast, asi1-extended, asi1-agentic, asi1-graph
        endpoints_to_try = [
            # Primary: asi1-mini (128K context, fast, everyday workflows)
            ("chat/completions", {
                "model": ASI_ONE_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 500
            }),
            # Fallback: Try other ASI:One models
            ("chat/completions", {
                "model": "asi1-fast",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 500
            }),
            ("chat/completions", {
                "model": "asi1-extended",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 500
            }),
        ]

        last_error = None
        for endpoint_path, payload in endpoints_to_try:
            try:
                # Construct full URL
                if ASI_ONE_API_URL.endswith('/v1'):
                    url = f"{ASI_ONE_API_URL}/{endpoint_path}"
                else:
                    url = f"{ASI_ONE_API_URL}/v1/{endpoint_path}"

                model_name = payload.get("model", "unknown")
                print(f"🔗 Trying ASI:One: {url}")
                print(f"   Model: {model_name}, Timeout: {ASI_ONE_TIMEOUT}s")

                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=ASI_ONE_TIMEOUT
                )

                # Success!
                if response.status_code == 200:
                    data = response.json()

                    # Try different response formats
                    summary = None
                    if "choices" in data and len(data["choices"]) > 0:
                        summary = data["choices"][0].get("message", {}).get("content") or data["choices"][0].get("text")
                    elif "response" in data:
                        summary = data["response"]
                    elif "text" in data:
                        summary = data["text"]
                    elif "output" in data:
                        summary = data["output"]

                    if summary:
                        print(f"✓ ASI:One generated intelligent summary ({len(summary)} chars)")
                        print(f"   Working endpoint: {endpoint_path}")
                        return summary
                    else:
                        print(f"   ⚠️  Unexpected response format. Keys: {list(data.keys())}")

                # 404 - try next endpoint
                elif response.status_code == 404:
                    print(f"   ✗ 404 Not Found, trying next...")
                    continue

                # Other errors - show details and try next
                else:
                    print(f"   ✗ Status {response.status_code}")
                    print(f"   Response: {response.text[:200]}")
                    last_error = f"Status {response.status_code}: {response.text[:200]}"
                    continue

            except requests.exceptions.ConnectionError as e:
                print(f"   ✗ Connection error: {str(e)[:100]}")
                last_error = str(e)
                continue
            except Exception as e:
                print(f"   ✗ Error: {str(e)[:100]}")
                last_error = str(e)
                continue

        # All endpoints failed
        print(f"⚠️  All ASI:One endpoints failed. Last error: {last_error}")
        print(f"   Please check ASI:One documentation for correct API endpoint")
        return None

    except Exception as e:
        print(f"⚠️  ASI:One summarization failed: {e}")
        return None


def format_research_context(
    query: str,
    capsules: List[Dict[str, Any]],
    web_results: List[Dict[str, str]],
    asi_one_summary: Optional[str] = None
) -> str:
    """
    Format research results into structured context for Reasoning Agent.

    Args:
        query: Original query
        capsules: Relevant Knowledge Capsules
        web_results: Web search results
        asi_one_summary: Optional AI-generated summary from ASI:One

    Returns:
        Formatted context string
    """
    context = f"# Research Context for Query: {query}\n\n"

    # Add ASI:One summary if available
    if asi_one_summary:
        context += "## 🤖 AI-Generated Summary (ASI:One)\n\n"
        context += f"{asi_one_summary}\n\n"
        context += "---\n\n"

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


# Capsule creation is now handled by capsule_agent


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

    # Step 3: Generate AI summary if ASI:One is enabled
    asi_one_summary = None
    if web_results and ENABLE_ASI_ONE_SUMMARY and ASI_ONE_API_KEY:
        ctx.logger.info("🤖 Generating intelligent summary with ASI:One...")
        asi_one_summary = summarize_with_asi_one(query_text, web_results)
        if asi_one_summary:
            ctx.logger.info("✓ ASI:One summary generated successfully")
        else:
            ctx.logger.warning("⚠️  ASI:One summary failed, using standard format")

    # Step 4: Format research context
    ctx.logger.info("📝 Formatting research context...")
    research_context = format_research_context(query_text, capsules, web_results, asi_one_summary)

    # Step 5: Always send results back to the original sender (user/agent who asked)
    ctx.logger.info("📤 Sending research results to sender...")
    await ctx.send(sender, create_text_message(research_context))
    ctx.logger.info("✓ Research results sent to sender")

    # Step 6: Optionally also notify Reasoning Agent (if configured and sender is not the reasoning agent)
    if REASONING_AGENT_ADDRESS and sender != REASONING_AGENT_ADDRESS:
        ctx.logger.info("📤 Also notifying Reasoning Agent for knowledge tracking...")

        try:
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
                            "original_sender": sender,
                            "notification_only": "true"
                        })
                    ]
                )
            )
            ctx.logger.info("✓ Reasoning Agent notified")
        except Exception as e:
            ctx.logger.warning(f"⚠️  Failed to notify reasoning agent: {e}")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✓ ACK from {sender}")


@research_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Research Agent with JSON-based capsule search."""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🔬 NERIA Research Agent Starting...")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Name: {RESEARCH_NAME}")
    ctx.logger.info(f"Agent Address: {research_agent.address}")
    ctx.logger.info(f"Port: {RESEARCH_PORT}")
    ctx.logger.info(f"Mailbox: Enabled")
    ctx.logger.info("=" * 60)

    # Log configuration
    ctx.logger.info("=" * 60)
    ctx.logger.info("📍 Configuration:")
    ctx.logger.info(f"  Reasoning Agent: {REASONING_AGENT_ADDRESS or '✗ Not configured'}")
    ctx.logger.info(f"  Web Search: {'✓ Enabled' if ENABLE_WEB_SEARCH else '✗ Disabled'}")
    ctx.logger.info(f"  ASI:One Summary: {'✓ Enabled' if (ENABLE_ASI_ONE_SUMMARY and ASI_ONE_API_KEY) else '✗ Disabled'}")
    if ASI_ONE_API_KEY:
        ctx.logger.info(f"  ASI:One Model: {ASI_ONE_MODEL}")
        ctx.logger.info(f"  ASI:One Timeout: {ASI_ONE_TIMEOUT}s")
    else:
        ctx.logger.info(f"  ASI:One API: ✗ Not configured")
    ctx.logger.info(f"  Top-K Capsules: {TOP_K_CAPSULES}")
    ctx.logger.info(f"  Similarity Threshold: {SIMILARITY_THRESHOLD}")
    ctx.logger.info(f"  Storage: JSON (Supabase pgvector coming soon)")
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
    print(f"🔍 Capsule Search: JSON-based (Supabase pgvector coming soon)")
    print(f"🌐 Web Search: {'Enabled' if ENABLE_WEB_SEARCH else 'Disabled'}")
    print(f"🤖 ASI:One Summary: {'Enabled' if (ENABLE_ASI_ONE_SUMMARY and ASI_ONE_API_KEY) else 'Disabled'}")
    print("=" * 60)
    print("Waiting for research requests...\n")

    research_agent.run()
