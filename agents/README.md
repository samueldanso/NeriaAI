# NeriaAI Agent System Documentation

This system comprises a modular architecture where a central **Query Router Agent** delegates tasks to several **specialized agents** based on the nature of a user query. Each agent is built using the `uAgents` framework and communicates using a standardized **Chat Protocol**. The system uses **MeTTa** for structured reasoning and **autonomous multi-agent validation** (no human bottleneck) to create verified Knowledge Capsules.

**Key Innovation:** Agents focus purely on AI reasoning and validation — all storage operations (Supabase, IPFS, NFT minting) are handled by the frontend.

---


## 1️⃣ **Query Router Agent** (Coordinator)

**Role:** Intent classification and intelligent routing
**Address:** `agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu`
**Communication:** Direct with frontend via uagent-client

### **Functionality:**

The Query Router Agent serves as the central coordinator for all incoming queries. It receives user queries directly from the frontend (via uagent-client) using the `ChatMessage` structure from the Chat Protocol. Upon receiving a message, it uses **ASI:One API** to intelligently classify the query into categories:

-   `simple_factual` → Route to Research Agent only
-   `complex_reasoning` → Route to Research → Reasoning → Validation pipeline
-   `validation_request` → Route directly to Validation Agent
-   `capsule_lookup` → Route to Capsule Agent for retrieval

After classification, it forwards the query to appropriate specialized agents and coordinates the multi-agent workflow until a verified response is ready. The agent tracks the entire conversation flow and ensures proper handoffs between agents.

---

## 2️⃣ **Research Agent** (Context Gatherer)

**Role:** Gather relevant context from existing knowledge and external sources
**Address:** `agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm`
**Tech:** Supabase pgvector semantic search + Web search fallback

### **Functionality:**

The Research Agent gathers comprehensive context for reasoning by performing semantic similarity search against existing Knowledge Capsules stored in **Supabase pgvector**. This prioritizes reusability of already-verified knowledge.

**Search Strategy:**

1. Query Supabase pgvector for semantically similar capsules (embeddings-based)
2. Retrieve top N most relevant verified reasoning chains
3. If insufficient context, fall back to external sources (documentation, trusted APIs)
4. Structure context with relevance scores and source citations

The agent packages all findings into a structured context object and forwards it to the Reasoning Agent. This ensures reasoning builds on existing verified knowledge whenever possible.

**Note:** Currently uses JSON-based storage as placeholder. Migration to Supabase pgvector is handled by the frontend integration.

---

## 3️⃣ **Reasoning Agent** (MeTTa Logic Chain Generator)

**Role:** Generate structured, auditable reasoning using MeTTa knowledge representation
**Address:** `agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz`
**Tech:** ASI:One API + MeTTa logic formatting

### **Functionality:**

The Reasoning Agent receives context from the Research Agent and generates transparent, step-by-step reasoning chains using **MeTTa** (SingularityNET's knowledge representation language).

**Reasoning Process:**

1. Analyze query and context from Research Agent
2. Call ASI:One API for intelligent answer generation
3. Structure response into MeTTa logic format (nodes, edges, relations)
4. Create transparent reasoning chain with confidence scores per step
5. Build knowledge graph showing concept dependencies

**Output Structure:**

```python
{
    "query": "original question",
    "reasoning_chain": [
        {"step": 1, "concept": "...", "confidence": 0.95, "dependencies": []},
        {"step": 2, "concept": "...", "confidence": 0.92, "dependencies": ["step_1"]},
    ],
    "metta_graph": {
        "nodes": ["concept_a", "concept_b"],
        "edges": [{"from": "A", "to": "B", "relation": "is_a"}]
    }
}
```

The structured reasoning is then forwarded to the Validation Agent for autonomous verification.

**Note:** MeTTa integration requires Ubuntu/Linux environment. Fallback to ASI:One-only mode on Windows.

---

## 4️⃣ **Validation Agent** (Multi-Agent Consensus Coordinator)

**Role:** Coordinate autonomous multi-agent validation without human bottleneck
**Address:** `agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm`
**Tech:** Chat Protocol + ASI:One API for sub-validator coordination

### **Functionality:**

The Validation Agent coordinates **three specialized sub-validator agents** that autonomously verify reasoning quality through consensus:

#### **🔍 Sub-Validator 1: Logic Validator**

-   **Checks:** Reasoning coherence and logical consistency
-   **Method:** Analyzes reasoning chain for contradictions, circular logic, missing steps
-   **Output:** Approve/Reject + detailed feedback on logical issues

#### **📚 Sub-Validator 2: Source Validator**

-   **Checks:** Factual accuracy against trusted documentation
-   **Method:** Matches claims against source context, detects hallucinations
-   **Output:** Approve/Reject + source verification report

#### **✅ Sub-Validator 3: Completeness Validator**

-   **Checks:** Whether query is fully addressed
-   **Method:** Ensures all aspects of user question are covered
-   **Output:** Approve/Reject + coverage analysis

### **Consensus Mechanism:**

**Rule:** **2/3 approval required** for verification

-   ✅ **3/3 Approved:** Reasoning immediately forwarded to Capsule Agent
-   ⚠️ **2/3 Approved:** Reasoning passes with notes
-   ❌ **1/3 or 0/3 Approved:** Reasoning rejected, sent back to Reasoning Agent with revision feedback

**Validation Proof Generated:**

```python
{
    "status": "approved" | "rejected",
    "logic_validator": {"vote": "approve", "confidence": 0.92, "notes": "..."},
    "source_validator": {"vote": "approve", "confidence": 0.88, "notes": "..."},
    "completeness_validator": {"vote": "approve", "confidence": 0.95, "notes": "..."},
    "consensus_score": 3,
    "timestamp": "2024-12-XX...",
    "revision_needed": false
}
```

This validation proof is cryptographically signed and becomes part of the Knowledge Capsule.

---

## 5️⃣ **Capsule Agent** (Response Packager)

**Role:** Package verified reasoning into structured response for frontend storage
**Address:** `agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246`
**Tech:** Chat Protocol (structured data responses only)

### **Functionality:**

**IMPORTANT:** In the new architecture, the Capsule Agent **DOES NOT** handle storage operations. It only returns structured data to the frontend.

**Responsibilities:**

1. Receive validated reasoning chain + validation proof from Validation Agent
2. Package data into clean, structured format
3. Return comprehensive response to frontend via Chat Protocol
4. Include metadata for frontend to handle storage operations

**Response Structure:**

```python
{
    "ready_for_storage": true,
    "query": "original question",
    "reasoning_chain": {...},  # Complete MeTTa reasoning
    "validation_proof": {...},  # Multi-agent validation result
    "confidence": 0.92,
    "validation_status": "approved",
    "capsule_metadata": {
        "created_at": "ISO timestamp",
        "agent_version": "2.0",
        "validation_method": "multi_agent_consensus"
    }
}
```

### **Frontend Storage Operations:**

After receiving this structured response, the **frontend** handles:

1. ☁️ **IPFS Upload (Pinata):** Upload full reasoning to IPFS → Get hash
2. 🗄️ **Supabase Insert:** Store metadata + generate embeddings → Get capsule ID
3. ⛓️ **NFT Minting (Base L2):** Mint NFT with IPFS hash → Get transaction hash
4. 🔍 **Vector Indexing:** Index in Supabase pgvector for future semantic search

---

## 🔗 **Agent Communication Flow**

```
User Query (Frontend)
    ↓ (uagent-client)
[Query Router Agent]
    ↓ (agent-to-agent)
[Research Agent] → Searches existing capsules (Supabase pgvector)
    ↓
[Reasoning Agent] → ASI:One + MeTTa structuring
    ↓
[Validation Agent] → 3 sub-validators (2/3 consensus)
    ├─ Logic Validator
    ├─ Source Validator
    └─ Completeness Validator
    ↓
[Capsule Agent] → Returns structured data
    ↓ (uagent-client response)
Frontend → IPFS, Supabase, NFT minting
```

---

## 📦 **Data Flow Summary**

| Stage         | Agent        | Input             | Output                | Storage?               |
| ------------- | ------------ | ----------------- | --------------------- | ---------------------- |
| 1. Routing    | Query Router | User query        | Route decision        | ❌ No                  |
| 2. Context    | Research     | Query             | Context + sources     | ❌ No (reads Supabase) |
| 3. Reasoning  | Reasoning    | Context           | MeTTa reasoning chain | ❌ No                  |
| 4. Validation | Validation   | Reasoning         | Validation proof      | ❌ No                  |
| 5. Response   | Capsule      | Reasoning + proof | Structured data       | ❌ No                  |
| 6. Storage    | **Frontend** | Structured data   | IPFS + Supabase + NFT | ✅ Yes                 |

**Key Change:** Agents are pure AI reasoning — frontend handles all persistence.

---

## 🚀 **Running the Agents**

### **Prerequisites:**

-   Python 3.10+
-   uAgents framework (`pip install uagents>=0.22.9`)
-   ASI:One API key

### **Start Agents (Separate Terminals):**

```bash
# Terminal 1: Query Router
cd agents
python query_router_agent.py

# Terminal 2: Research Agent
python research_agent.py

# Terminal 3: Reasoning Agent
python reasoning_agent.py

# Terminal 4: Validation Agent
python validation_agent.py

# Terminal 5: Capsule Agent
python capsule_agent.py
```

Each agent will log its address and status on startup. Frontend will communicate with Query Router Agent address directly via uagent-client.

---

## 🔧 **Agent Configuration**

Agents use environment variables for configuration:

```bash
# .env file in /agents directory
ASI_ONE_API_KEY=your-asi-api-key
ROUTER_PORT=9000
RESEARCH_PORT=9002
REASONING_PORT=9003
VALIDATION_PORT=9004
CAPSULE_PORT=9005

# Agent addresses for inter-agent communication
RESEARCH_AGENT_ADDRESS=agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm
REASONING_AGENT_ADDRESS=agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz
VALIDATION_AGENT_ADDRESS=agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm
CAPSULE_AGENT_ADDRESS=agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246
```
