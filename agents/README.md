# Agent Documentation

This system comprises a modular architecture where a central **Query Router Agent** delegates tasks to several **specialized agents** based on the nature of a user query. Each agent is built using the `uAgents` framework and communicates using a standardized **Chat Protocol**. The system uses **MeTTa** for structured reasoning and **ASI:One** for human expert validation to create verified Knowledge Capsules.

---

## Query Router Agent (Main Agent)

The **Query Router Agent** serves as the central coordinator for processing incoming queries. It continuously monitors user inputs through the FastAPI backend and forwards those inputs using the `ChatMessage` structure defined by the chat protocol. When it receives a message, it uses **ASI:One API** to classify the query into one of four categories: `simple_factual`, `complex_reasoning`, `validation_request`, or `capsule_lookup`. Based on the classification, it forwards the original query to the appropriate specialized agent (Research Agent, Reasoning Agent, Validation Agent, or Capsule Agent). After the specialized agent processes the query and replies, the Query Router coordinates the multi-agent workflow to create a verified Knowledge Capsule. This agent registers all specialized agents locally via `ctx.register()` to ensure seamless communication within the validation pipeline.

---

## Research Agent (Specialized Agent)

The **Research Agent** is responsible for gathering relevant context and sources for reasoning. Upon receiving a message, it performs a similarity search against a locally stored FAISS vector index of existing Knowledge Capsules, prioritizing reusability of verified knowledge. The top relevant capsule passages retrieved from this search are then combined with external sources (if needed) and passed to the Reasoning Agent for structured analysis. The response is packaged into a `ChatMessage` and sent back to the Query Router Agent. This agent operates with pre-loaded FAISS indices to ensure low-latency knowledge retrieval and maintains a comprehensive database of verified reasoning chains for future reuse.

---

## Reasoning Agent (Specialized Agent)

The **Reasoning Agent** handles all queries that require structured reasoning using MeTTa logic chains. When it receives a query message with context from the Research Agent, it uses **MeTTa** to generate transparent, step-by-step reasoning chains that can be audited and validated. The reasoning process creates structured logic graphs that show the thought process clearly, building on existing Knowledge Capsules when possible. The resulting reasoning chain is then passed to the Validation Agent for human expert review. This agent ensures that all reasoning is transparent, reusable, and follows logical consistency principles.

---

## Validation Agent (Specialized Agent)

The **Validation Agent** is designed for coordinating human expert validation via ASI:One integration. Upon receiving a reasoning chain from the Reasoning Agent, it formats the structured logic for human review and sends it to expert validators through the ASI:One API. The agent manages the approve/revise workflow, tracking validation status and creating validation proof for each Knowledge Capsule. Once approved by human experts, the validated reasoning chain is forwarded to the Capsule Agent for storage. This agent ensures that all knowledge is human-verified before being stored as a reusable Knowledge Capsule.

---

## Capsule Agent (Specialized Agent)

The **Capsule Agent** serves as the knowledge storage and retrieval system for verified Knowledge Capsules. When it receives a validated reasoning chain from the Validation Agent, it creates a comprehensive Knowledge Capsule with metadata including the original query, reasoning chain, validation proof, and usage statistics. The capsule is stored in JSON format in `/data/capsules/` and indexed using FAISS for semantic search. The agent also handles capsule retrieval for future queries, ensuring that verified knowledge can be reused and built upon. This agent maintains the integrity of the knowledge base and provides fast access to previously validated reasoning chains.

---
