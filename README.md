![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

# Neria AI — Turning AI Answers into Trusted, Expert-Validated Knowledge

**ETHOnline 2025 | ASI Alliance Track**

[![Watch Video Demo ]()]()

[Final Pitch Deck]()

## 🎯 Overview

Neria is an AI-powered reasoning engine that transforms complex questions into expert-validated answers you can actually trust and reuse — think “StackOverflow for AI.”

It’s built for developers, researchers, and professionals who rely on AI but need accuracy, validation, and structured reasoning — not guesswork.

Neria uses a multi-agent system powered by uAgents and MeTTa, with human validation via ASI:One, to turn fragmented AI responses into structured, reusable Knowledge Capsules that you can cite or build upon.

## 🌪️ The Problem

Today, when you search or ask AI a technical or complex question:

❌ AI gives confident but unverified answers

❌ Forums like StackOverflow or Quora have outdated or conflicting responses

❌ Hard to cite or trust for real work

❌ Valuable knowledge gets lost instead of being reusable

**Result**: Professionals waste time verifying AI outputs manually — the opposite of AI’s promise

## 💡 The Solution — Expert-Validated Answers

Neria introduces an agentic validation layer that combines specialized autonomous reasoning agents with real human experts via ASI:One, ensuring every AI-generated insight is validated, structured, and reusable.

Using uAgents, MeTTa, and ASI:One, Neria AI creates verified “Knowledge Capsules” — a modular, searchable, and citable reasoning units.

**Think StackOverflow meets AI — verified, reusable, and decentralized.**

## 🌐 Key Features

-   🤖 **Multi-Agent Reasoning System** – 5 specialized uAgents work together to handle query routing, research, reasoning, validation, and capsule creation.

-   🧩 **Structured Reasoning Chains** – Transparent logic flow and reasoning visualization generated with MeTTa.

-   🧠**Human-in-the-Loop Validation** – Expert review and approval via ASI:One.

-   📦 **Reusable Knowledge Capsules** – Verified knowledge stored and searchable via FAISS vector search.

-   🔍 **Smart Query Routing** – Intent-based routing and discovery using Agentverse.

-   💬 **Realtime Human-Agent Interaction** – Chat protocol for expert review.

-   ✅ Trust Layer for AI – Every answer carries validation metadata and history.

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
-   QUERY ROUTER AGENT=""
-   RESEARCH AGENT=""
-   REASONING AGENT=""
-   VALIDATION AGENT=""
-   CAPSULE AGENT=""
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

### update the address of each of the above agents in the intent_classifier.py file

```python
# Replace these with the actual addresses printed by each worker agent at startup
QUERY_ROUTER_AGENT_ADDR = ""
RESEARCH_AGENT_ADDR = ""
REASONING_AGENT_ADDR = ""
VALIDATION_AGENT_ADDR = ""
CAPSULE_AGENT_ADDR = ""

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
-   [] Decentralized reputation layer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Use it, fork it, build something amazing on it.

## 🏆 Built at ETHGlobal ETHOnline 2025 Hackathon

**By NeriaAI Team**

-   **Samuel Danso - Product & Enginrering Lead** – `me.samueldanso@gmail.com`
-   **Emmanuel Ameyaw — Backend & AI Engineering** -`emmanuelameyaw57@gmail.com`

## 🔗 Links

-   **Live Demo**: [NeriaAI](https://neria-ai.vercel.app)
