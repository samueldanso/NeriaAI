"""
MeTTa Reasoning Engine for NERIA AI
Provides structured knowledge graph reasoning capabilities
"""

__version__ = "1.0.0"

from .know_graph import initialize_reasoning_knowledge, add_verified_reasoning
from .reasonrag import GeneralRAG
from .utils import (
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain,
    format_reasoning_for_validation,
    get_asi_one_response
)

__all__ = [
    "initialize_reasoning_knowledge",
    "add_verified_reasoning",
    "GeneralRAG",
    "classify_reasoning_type",
    "extract_key_concepts",
    "generate_reasoning_chain",
    "format_reasoning_for_validation",
    "get_asi_one_response"
]

