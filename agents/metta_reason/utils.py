"""
Utility functions for reasoning agent
Includes LLM integration, query processing, and reasoning chain generation
"""

import os
import json
import requests
from typing import Dict, List, Tuple, Optional
from .reasonrag import GeneralRAG


def get_asi_one_response(prompt: str, api_key: str, api_url: str = "https://api.asi1.ai/v1") -> Optional[str]:
    """
    Get response from ASI:One API.

    Args:
        prompt: The prompt to send
        api_key: ASI:One API key
        api_url: API endpoint URL

    Returns:
        Response text or None if error
    """
    if not api_key:
        print("⚠️  ASI:One API key not configured")
        return None

    try:
        response = requests.post(
            f"{api_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 1000
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
        else:
            print(f"⚠️  ASI:One API error: {response.status_code}")
            return None

    except Exception as e:
        print(f"❌ Error calling ASI:One API: {e}")
        return None


def classify_reasoning_type(query: str, api_key: str) -> str:
    """
    Classify the type of reasoning required for the query.

    Args:
        query: User query
        api_key: ASI:One API key

    Returns:
        Reasoning type (deductive, inductive, abductive, comparative, causal)
    """
    classification_prompt = f"""
Classify the following query into ONE reasoning type:
- deductive: Logical deduction from premises to conclusion
- inductive: Pattern recognition from examples to general rule
- abductive: Best explanation for observed phenomenon
- comparative: Comparing multiple options or concepts
- causal: Explaining cause-and-effect relationships

Query: {query}

Respond with ONLY the reasoning type (one word).
"""

    result = get_asi_one_response(classification_prompt, api_key)

    if result:
        reasoning_type = result.strip().lower()
        valid_types = ["deductive", "inductive", "abductive", "comparative", "causal"]
        if reasoning_type in valid_types:
            return reasoning_type

    # Default fallback
    query_lower = query.lower()
    if any(word in query_lower for word in ["why", "cause", "because", "reason"]):
        return "causal"
    elif any(word in query_lower for word in ["compare", "difference", "versus", "vs"]):
        return "comparative"
    elif any(word in query_lower for word in ["explain", "how", "process"]):
        return "deductive"
    else:
        return "deductive"


def extract_key_concepts(query: str, api_key: str) -> List[str]:
    """
    Extract key concepts from the query.

    Args:
        query: User query
        api_key: ASI:One API key

    Returns:
        List of key concepts
    """
    extraction_prompt = f"""
Extract the key technical concepts from this query as a comma-separated list.
Focus on main topics, not common words.

Query: {query}

Respond with ONLY the comma-separated concepts.
"""

    result = get_asi_one_response(extraction_prompt, api_key)

    if result:
        concepts = [c.strip() for c in result.split(",")]
        return [c for c in concepts if c]

    # Fallback: extract capitalized words and technical terms
    words = query.split()
    concepts = []
    for word in words:
        word_clean = word.strip(".,!?()[]{}\"'")
        if (word_clean and len(word_clean) > 3 and
            (word_clean[0].isupper() or "_" in word_clean or word_clean.lower() in
             ["neural", "network", "learning", "training", "model", "algorithm", "data"])):
            concepts.append(word_clean)

    return concepts[:5]  # Limit to top 5


def generate_reasoning_chain(
    query: str,
    reasoning_type: str,
    concepts: List[str],
    rag: GeneralRAG,
    context: Optional[str],
    api_key: str
) -> Dict[str, any]:
    """
    Generate a structured reasoning chain using MeTTa knowledge and LLM.

    Args:
        query: User query
        reasoning_type: Type of reasoning required
        concepts: Key concepts extracted from query
        rag: ReasoningRAG instance
        context: Optional context from Research Agent
        api_key: ASI:One API key

    Returns:
        Dictionary containing reasoning chain and metadata
    """
    # Query MeTTa knowledge graph for relevant information
    patterns = rag.query_reasoning_pattern(reasoning_type)
    template = rag.query_template(f"{reasoning_type}_explanation") or rag.query_template("why_explanation")
    validation_criteria = rag.query_validation_criteria()

    # Gather domain-specific knowledge
    domain_knowledge = []
    for concept in concepts:
        rules = rag.query_domain_rule(concept)
        domain_knowledge.extend(rules)

        # Query causal relationships
        causes = rag.query_causes(concept)
        if causes:
            domain_knowledge.append(f"{concept} causes: {', '.join(causes)}")

    # Search for related knowledge
    related_knowledge = []
    for concept in concepts:
        matches = rag.search_knowledge(concept)
        related_knowledge.extend(matches)

    # Build reasoning prompt with MeTTa knowledge
    reasoning_prompt = f"""
Generate a transparent, step-by-step reasoning chain to answer this query.

Query: {query}

Reasoning Type: {reasoning_type}
Key Concepts: {', '.join(concepts)}

Relevant Knowledge from MeTTa Graph:
{chr(10).join(f"- {p}" for p in patterns) if patterns else "- Using general reasoning principles"}

Domain-Specific Rules:
{chr(10).join(f"- {k}" for k in domain_knowledge) if domain_knowledge else "- No specific rules found"}

Template to Follow:
{template if template else "1. Identify core question 2. Break down into steps 3. Apply logic 4. Synthesize conclusion"}

Context from Research:
{context if context else "No additional context provided"}

Validation Criteria (ensure your reasoning meets these):
{chr(10).join(f"- {c}" for c in validation_criteria)}

Please provide:
1. **Reasoning Steps**: Clear, numbered steps showing the logical progression
2. **Supporting Evidence**: Facts or principles supporting each step
3. **Conclusion**: Final answer synthesizing the reasoning
4. **Confidence**: Your confidence level (0.0-1.0) with justification

Format your response as clear, auditable reasoning that a human expert can validate.
"""

    # Get LLM response
    reasoning_response = get_asi_one_response(reasoning_prompt, api_key)

    if not reasoning_response:
        # Fallback response
        reasoning_response = f"""
**Reasoning Steps:**
1. Analyzed query about: {', '.join(concepts)}
2. Applied {reasoning_type} reasoning pattern
3. Considered domain knowledge: {domain_knowledge[0] if domain_knowledge else 'general principles'}

**Supporting Evidence:**
- Pattern: {patterns[0] if patterns else 'standard logical inference'}
- Domain knowledge from MeTTa graph

**Conclusion:**
Unable to generate full reasoning due to API limitations. Query requires {reasoning_type} analysis of {', '.join(concepts)}.

**Confidence:** 0.5 (Limited by API availability)
"""

    # Parse confidence from response (look for pattern)
    confidence = 0.7  # Default
    if "confidence:" in reasoning_response.lower():
        try:
            conf_line = [l for l in reasoning_response.lower().split("\n") if "confidence:" in l][0]
            conf_value = conf_line.split("confidence:")[1].strip().split()[0]
            confidence = float(conf_value.strip("()"))
        except:
            pass

    # Build reasoning chain structure
    chain = {
        "query": query,
        "reasoning_type": reasoning_type,
        "key_concepts": concepts,
        "metta_knowledge_used": {
            "patterns": patterns,
            "domain_rules": domain_knowledge,
            "template": template,
            "validation_criteria": validation_criteria
        },
        "reasoning_steps": reasoning_response,
        "confidence": confidence,
        "requires_validation": confidence < 0.9,  # High confidence might skip human validation
        "metadata": {
            "context_provided": bool(context),
            "domain_knowledge_found": len(domain_knowledge) > 0,
            "patterns_found": len(patterns) > 0
        }
    }

    return chain


def format_reasoning_for_validation(chain: Dict[str, any]) -> str:
    """
    Format reasoning chain for human expert validation.

    Args:
        chain: Reasoning chain dictionary

    Returns:
        Formatted text for validation
    """
    formatted = f"""
🧠 **REASONING CHAIN FOR VALIDATION**

**Query:** {chain['query']}

**Reasoning Type:** {chain['reasoning_type']}

**Key Concepts:** {', '.join(chain['key_concepts'])}

**MeTTa Knowledge Applied:**
- Patterns: {len(chain['metta_knowledge_used']['patterns'])} found
- Domain Rules: {len(chain['metta_knowledge_used']['domain_rules'])} applied
- Validation Criteria: {len(chain['metta_knowledge_used']['validation_criteria'])} checked

---

{chain['reasoning_steps']}

---

**Confidence Score:** {chain['confidence']:.2f}
**Requires Human Validation:** {'Yes' if chain['requires_validation'] else 'No (High Confidence)'}

Please review this reasoning chain and provide feedback:
1. Is the logic sound?
2. Are all steps necessary and sufficient?
3. Is the conclusion well-supported?
4. Any corrections or improvements needed?
"""

    return formatted
