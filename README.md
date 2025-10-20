![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

# Neria AI — Turning AI outputs into trusted, expert-validated knowledge

**ETHOnline 2025 | ASI Alliance Track**

[Watch Video Demo ]()

[Final Pitch Deck]()

## 🎯 Overview

Neria is a decentralized, human-AI reasoning platform for knowledge work that transforms fragmented AI outputs into trusted, expert-validated, and reusable structured knowledge.
It leverages a multi-agent reasoning system powered by uAgents, ASI:One’s human validation network, and MeTTa’s structured logic to create verifiable Knowledge Capsules.

Experts and AI agents collaboratively reason, verify, and structure complex answers into high-quality knowledge assets. Each contribution is verifiable and reputation-backed, ensuring transparency and trust.

**Think Stack Overflow for the AI era** — where human expertise and autonomous AI agents co-create reliable, reusable knowledge for critical decision-making and research.

Built for researchers, analysts, developers, and professionals who rely on AI outputs but need accuracy, validation, and structured reasoning — not guesswork.

## 🌐 Key Features

-   🤖 **Multi-Agent Reasoning System** – 5 specialized uAgents work together to handle query routing, research, reasoning, validation, and capsule creation.

-   🧩 **Structured Reasoning Chains** – Transparent logic flow and reasoning visualization generated with MeTTa.

-   🧠**Human-in-the-Loop Validation** – Expert review and approval via ASI:One.

-   📦 **Reusable Knowledge Capsules** – Verified knowledge stored and searchable via FAISS vector search.

-   🔍 **Smart Query Routing** – Intent-based routing and discovery using Agentverse.

-   💬 **Realtime Human-Agent Interaction** – Chat protocol for expert review.

-   🏅 Reputation & Attestations – Expert validations generate on-chain reputation proofs for transparent, trustless credibility.

-   🔐 Web3 Identity – Wallet login for contributors, ensuring verifiable ownership of expertise.

## 🧭 Multi-Agent Workflow & Architecture

```
USER QUERY
    ↓
[1. QUERY ROUTER AGENT] → Classifies intent & routes
    ↓
[2. RESEARCH AGENT] → Gathers existing context
    ↓
[3. REASONING AGENT] → Generates logic chain via MeTTa
    ↓
[4. VALIDATION AGENT] → Coordinates human expert review via ASI:One
    ↓
[5. CAPSULE AGENT] → Stores verified knowledge
    ↓
VERIFIED KNOWLEDGE CAPSULE

```

### **1. Query Router Agent** (Coordinator)

**Role:** Classifies the user query and routes to the right agents.

-   Simple factual → Research Agent
-   Complex reasoning → Research + Reasoning Agents
-   Validation request → Validation Agent
-   Capsule lookup → Capsule Agent

**Tech:**

-   uAgents + chat protocol
-   ASI:One for intent classification
-   Mailbox connectivity

### **2. Research Agent** (Context Gatherer)

**Role:** Finds reliable context and sources for reasoning.

**Innovation:**

-   Searches existing Knowledge Capsules first
-   Falls back to web search when needed
-   Feeds structured context to the Reasoning Agent

**Tech:**

-   FAISS vector search + Knowledge Capsule DB

**Example:**

```
User asks: "How does React useMemo work?"
→ Finds related capsules → Gathers React docs → Returns structured context
```

### **3. Reasoning Agent** (Logic Builder)

**Role:** Builds step-by-step reasoning using MeTTa.

**Innovation:**

-   Generates transparent reasoning chains
-   Builds logic graphs
-   Reuses verified knowledge from past capsules

**Output Example:**

```
{
   "reasoning_chain": [
    {"step": 1, "logic": "useMemo is a React hook"},
    {"step": 2, "logic": "It memoizes expensive calculations"},
    {"step": 3, "logic": "Only recomputes when dependencies change"}
  ],
  "metta_graph": {...}
}
```

### **4. Validation Agent** (Human Expert Coordinator)

**Role:** Manages validation workflow through ASI:One.

**Innovation (Core):**

-   Sends reasoning chains for expert review
-   Manages approve/revise feedback
-   Tracks validation status
-   Generates validation proofs

**Tech:**

-   ASI:One API + Chat protocol + Validation state management

### **5. Capsule Agent** (Knowledge Capsule Manager)

**Role:** Stores and manages verified Knowledge Capsules.

**Innovation:**

-   Saves validated reasoning
-   Makes capsules discoverable and reusable
-   Tracks usage and provenance

**Tech:**

-   JSON + vector indexingJSON + vector indexing
-   Metadata + validation proof

## 🔄 End-to-End Flow Example

```
USER QUERY: "How do I optimize React re-renders?"
    ↓
Query Router → Research + Reasoning Agents
    ↓
Research Agent → Finds related capsules (React.memo, useMemo)
    ↓
Reasoning Agent → Generates logic chain
    ↓
Validation Agent → Expert review via ASI:One → Approved ✅
    ↓
Capsule Agent → Creates Knowledge Capsule
    ↓
USER RECEIVES:
    - Verified answer
    - Validation proof
    - Capsule ID

```

## 🤖 Agent Addresses (Innovation Lab)

```
-   QUERY ROUTER AGENT="agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu"
-   RESEARCH AGENT="agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm"
-   REASONING AGENT="agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz"
-   VALIDATION AGENT="agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm"
-   CAPSULE AGENT="agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246"
```

🧩 Use Cases

-   **Developers**: Reliable answers for debugging, performance, and architecture questions.
-   **Researchers**: Verified citations for AI-generated insights.
-   **Educators**: Trusted, explainable AI reasoning for learning environments.
-   **Organizations**: Internal knowledge systems built on verified AI logic.

## 💰 Business Case

-   **Short-Term**: Target developers, educators, and AI researchers who need accuracy and trust.
-   **Mid-Term**: Build an expert validation marketplace powered by ASI:One.
-   **Long-Term**: Evolve into a decentralized “Wikipedia of AI Reasoning” — a living, expert-verified knowledge layer.

## 🛠️ Technology Stack

-   **Language**: Python 3.8+
-   **Agent Framewoek**: uAgents (Fetch.ai)
-   **Reasoning Knowlege Graphs**: SingularityNET's MeTTa language.
-   **Human Validation**: ASI:One API
-   **Agent Communcation** Chat Protocol
-   **Vector Storage and Retrieval**: FAISS
-   **Backend API**: FastAPI
-   **Frontend**: Next.js, React, TypesScript, Tailwind,Shadcn UI
-   **Smart Contracts**: Solidity, Hardhat

-   ** Web3 Identity & Reputation Integration**: Privy, Viem, Wagmi

## 🚀 Getting Started

### Prerequisites

-   Python 3.8+
-   Node 18+
-   uAgents SDK
-   ASI:One API key

### 1. Clone the Repository

```bash
git clone https://github.com/samueldanso/NeriaAI.git
cd NeriaAI
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
cd frontend && npm install
```

### 3. Set Environment Variables

Create a `.env` file or export the following environment variable:

```bash
export ASI_ONE_API_KEY="your-ASI:ONE-api-key"
```

### 4. Run the Backend & (FastAPI server)

Launch each agent independently or as a managed process depending on your architecture. Example:

```bash
source venv/bin/activate
python backend/main.py
```

```bash
python agents/query_router_agent.py
python agents/research_agent.py
python agents/reasoning_agent.py
python agents/validation_agent.py
python agents/capsule_agent.py
```

### update the address of each of the above agents with their individual agent address from agentverse

```python
# Replace these with the actual addresses printed by each worker agent at startup
QUERY_ROUTER_AGENT_ADDR = "agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu"
RESEARCH_AGENT_ADDR = "agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm"
REASONING_AGENT_ADDR = "agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz"
VALIDATION_AGENT_ADDR = "agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm"
CAPSULE_AGENT_ADDR = " agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246"

```

### Start Frontend:

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:3000`

## 📦 Roadmap

**Next Steps:** - Decentralized Wikipedia of reasoning
Next Steps

-   [] Expert validation marketplace
-   [] Cross-domain knowledge graphs
-   [] Capsule graph visualization
-   [] Attestation-based Trust & Incentive System

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Use it, fork it, build something amazing on it.

## 🏆 Built at ETHGlobal ETHOnline 2025 Hackathon

**By NeriaAI Team**

-   **Samuel Danso - Product & Enginrering Lead** – `me.samueldanso@gmail.com`
-   **Emmanuel Ameyaw — Backend & AI Engineering** -`emmanuel97ameyaw@gmail.com`

## 🔗 Links

-   **Live Demo**: [NeriaAI](https://neria-ai.vercel.app)
