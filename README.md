# NeriaAI — Decentralized AI Reasoning Platform for Knowledge Work

A decentralized human-AI reasoning platform that transforms AI outputs into permanent, verifiable, and reusable knowledge assets you can trust. It leverages a multi-agent reasoning and validation system powered by Fetch.ai, the ASI Alliance stack, and IPFS — deployed on Base.

**ETHOnline 2025 | ASI Alliance Track | Hardhat Track**

[🎥 **Watch Video Demo**]() | [📊 **View Pitch Deck**]() | [🌐 **Live Demo**](https://neria-ai.vercel.app)

---

## 🔥 The Problem

Today developers, researchers, and professionals constantly seek clear, reliable AI answers — millions use ChatGPT and Claude for critical decisions, but:

-   ❌ **AI provides fluent but unverified outputs** (73% of developers don't fully trust AI code)
-   ❌ **Stack Overflow and forums have conflicting or outdated answers**
-   ❌ **Professionals waste hours manually cross-checking AI results**
-   ❌ **Most answers are disposable** — same questions asked thousands of times

**Result:** We generate billions of AI answers daily, but build **zero collective knowledge**.

---

## 💡 The Solution

Neria introduces an **autonomous multi-agent validation layer** that turns AI conversations into permanent, verified knowledge assets.

**Think:** Perplexity meets Stack Overflow — where autonomous AI agents verify every answer and blockchain makes knowledge permanent.

Built for researchers, developers, and professionals who need **verified AI reasoning**, not guesswork.

### **How It Works:**

1. 🗣️ **User asks question** via chat interface
2. 🤖 **5 AI agents collaborate** to research, reason, and validate
3. 🧩 **MeTTa structures reasoning** into formal logic graphs
4. ✅ **3 validator agents approve** (2/3 consensus required)
5. 📦 **Knowledge Capsule NFT minted** on Base L2
6. 🔍 **Indexed for future discovery** via vector search
7. 💰 **Creator receives attribution** for all future citations

**Key Innovation:** Autonomous AI agents validate each other's reasoning — no centralized authority, no human bottleneck.

---

## 🌟 Key Features

-   🤖 **Multi-Agent System** – 5 specialized uAgents collaborate to route, research, reason, validate, and store knowledge
-   🧩 **Reasoning Chains** – Transparent, structured logic graphs generated with MeTTa knowledge representation
-   ✅ **Autonomous Validation** – Multi-agent consensus (2/3 approval) verifies reasoning quality without human bottleneck
-   📦 **Knowledge Capsule NFTs** — Each verified answer becomes an ownable, permanent ERC-721 asset on Base L2
-   🔍 **Vector Semantic Search** — Discover related capsules via Supabase pgvector, even without exact keywords
-   🔗 **Agent Orchestration** — Agentverse registry + Chat Protocol enable seamless agent discovery and communication
-   🏅 **On-Chain Attribution** — Creator reputation and validation proofs permanently recorded on blockchain

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │   Chat UI       │  │  uagent-client  │  │  Storage     ││
│  │                 │  │                 │  │  Operations  ││
│  │ • User Input    │  │ • Direct Agent  │  │ • Supabase   ││
│  │ • Real-time     │  │   Communication │  │ • Pinata     ││
│  │ • Status Updates│  │ • Auto Bridge   │  │ • NFT Mint   ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
└────────────────┬────────────────────────────────────────────┘
                 │ Direct Communication (uagent-client)
┌────────────────▼────────────────────────────────────────────┐
│              AGENT ORCHESTRATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Query Router  │→ │Research Agent│→ │Reasoning     │      │
│  │   Agent      │  │  (Context)   │  │Agent (MeTTa) │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
│                                              │               │
│  ┌──────────────┐                           ▼               │
│  │Capsule Agent │ ←─────────────── ┌──────────────┐        │
│  │  (Response)  │                  │ Validation   │        │
│  └──────────────┘                  │Agent(3 types)│        │
│                                     └──────────────┘        │
│                                                              │
│  Powered by: Fetch.ai uAgents + Agentverse + Chat Protocol │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (Base L2)                      │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ KnowledgeNFT     │  │ Reputation       │                │
│  │ Contract         │  │ Registry         │                │
│  │ (ERC-721)        │  │ (ERC-4973)       │                │
│  └──────────────────┘  └──────────────────┘                │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    STORAGE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │Supabase      │  │IPFS (Pinata) │                        │
│  │(DB+Vector)   │  │(Full Data)   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 UserFlow (End-to-End Flow)

### **User Journey Example:**

```
USER: "How does React useMemo work?"
    ↓
[1. NERIA ROUTER AGENT]
    → Classifies as "technical question"
    → Routes to Research + Reasoning agents
    ↓
[2. NERIA RESEARCH AGENT]
    → Searches existing Knowledge Capsules (vector search)
    → Searches React documentation
    → Returns: "Found 3 related capsules + official docs"
    ↓
[3. NERIA REASONING AGENT]
    → Calls ASI:One API for answer generation
    → Structures response using MeTTa logic format
    → Output: Step-by-step reasoning chain
    ↓
[4. NERIA VALIDATION AGENT] (coordinates 3 sub-agents)
    │
    ├─ LOGIC VALIDATOR: Checks reasoning coherence ✅
    ├─ SOURCE VALIDATOR: Verifies facts vs docs ✅
    └─ COMPLETENESS VALIDATOR: Ensures full answer ✅
    ↓
    Consensus: 3/3 approved → VERIFIED ✅
    (If 1/2 rejects → Reasoning revised and resubmitted)
    ↓
[5. NERIA CAPSULE AGENT]
    → Packages verified reasoning into structured response
    → Returns data to frontend for storage operations
    ↓
[6. FRONTEND STORAGE OPERATIONS]
    → Uploads full reasoning to IPFS (Pinata) → Gets hash: QmX4z...
    → Stores metadata + embeddings in Supabase
    → Mints NFT on Base L2 with IPFS hash
    → Indexes for semantic search via pgvector
    ↓
USER RECEIVES:
    ✅ Verified answer with reasoning chain
    📦 Knowledge Capsule #42 created
    🔗 NFT minted at 0x7a3c...
    🌐 Share link + OpenSea listing
```

---

## 🤖 Multi-Agent System

### **1. Neria Router Agent**

**Role:** Intent classification and routing
**Tech:** uAgents + Chat Protocol
**Address:** `agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu`

**Logic:**

```
Simple factual query → Research Agent
Complex reasoning → Research + Reasoning
Validation request → Validation Agent
Capsule lookup → Capsule Agent
```

---

### **2. Neria Research Agent**

**Role:** Context gathering from existing knowledge and web
**Tech:** Vector search + web scraping
**Address:** `agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm`

**Innovation:**

-   Searches Knowledge Capsules first (avoid redundancy)
-   Falls back to trusted documentation (React docs, MDN, etc.)
-   Structures context for reasoning agent

---

### **3. Neria Reasoning Agent**

**Role:** Generate structured reasoning using MeTTa
**Tech:** ASI:One API + MeTTa logic formatting
**Address:** `agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz`

**Output Example:**

```json
{
	"reasoning_chain": [
		{
			"step": 1,
			"concept": "useMemo is a React Hook",
			"confidence": 0.95
		},
		{
			"step": 2,
			"concept": "It memoizes expensive calculations",
			"dependencies": ["step_1"],
			"confidence": 0.92
		},
		{
			"step": 3,
			"concept": "Recomputes only when dependencies change",
			"dependencies": ["step_2"],
			"confidence": 0.9
		}
	],
	"metta_graph": {
		"nodes": ["useMemo", "React Hooks", "memoization"],
		"edges": [{ "from": "useMemo", "to": "React Hooks", "relation": "is_a" }]
	}
}
```

---

### **4. Neria Validation Agent**

**Role:** Coordinate multi-agent validation consensus
**Tech:** Chat Protocol + ASI:One
**Address:** `agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm`

**Sub-Validators:**

| Validator                  | Checks              | Method                               |
| -------------------------- | ------------------- | ------------------------------------ |
| **Logic Validator**        | Reasoning coherence | Detects contradictions between steps |
| **Source Validator**       | Factual accuracy    | Matches claims against documentation |
| **Completeness Validator** | Full answer         | Ensures all query aspects addressed  |

**Consensus Rule:** 2/3 approval required for verification

---

### **5. Neria Capsule Agent**

**Role:** Package verified reasoning into structured responses (no storage)
**Tech:** Chat Protocol (structured data only)
**Address:** `agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246`

**Process:**

1. Receive validated reasoning + validation proof
2. Package into structured format
3. Return data to frontend via Chat Protocol
4. Frontend handles: IPFS upload, Supabase insert, NFT minting, vector indexing

**Note:** Agents no longer handle storage — frontend orchestrates all persistence operations.

---

# Agent Addresses (from your running agents)

Neria Router Agent=agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu
Neria Research Agent=agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm
Neria Reasoning Agent=agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz
Neria Validation Agent=agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm
Neria Capsule Agent=agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246

## 🛠️ Tech Stack

| Category                | Technology                                            |
| ----------------------- | ----------------------------------------------------- |
| **Agent Framework**     | Fetch.ai uAgents                                      |
| **LLM API**             | ASI:One                                               |
| **Logical Reasoning**   | SingularityNET's MeTTa                                |
| **Agent Discovery**     | Agentverse                                            |
| **Agent Communication** | Chat Protocol + uagent-client                         |
| **Offchain Database**   | Supabase (PostgreSQL)                                 |
| **Vector Search**       | Supabase pgvector                                     |
| **Onchain Storage**     | IPFS (via Pinata)                                     |
| **Smart Contracts**     | Solidity, Hardhat, ERC-721, ERC-4973                  |
| **Frontend**            | Next.js 15, TypeScript, React 19, Tailwind, Shadcn UI |
| **Web3 Integration**    | Privy, Viem, Wagmi                                    |
| **State Management**    | Zustand, React Query                                  |

---

## 🚀 Getting Started

### **Try Live Demo**

👉 **[https://neria-ai.vercel.app](https://neria-ai.vercel.app)**

1. Connect wallet (Base Sepolia testnet)
2. Ask a question
3. Watch agents validate in real-time
4. Mint your Knowledge Capsule NFT

---

### **Setup**

#### **Prerequisites**

-   Python 3.10+
-   Node.js 18+

#### **Installation**

```bash
# 1. Clone repository
git clone https://github.com/samueldanso/neria-ai-ethonline-2025.git
cd neria-ai-ethonline-2025

# 2. Install Dependencies
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Frontend
cd frontend
npm install

# 4. Environment variables
# Create .env file in root:
echo "ASI_ONE_API_KEY=your-api-key" > .env
echo
"QUERY_ROUTER_AGENT_ADDRESS=agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm" >> .env
"RESEARCH_AGENT_ADDRESS=agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm" >> .env
echo "REASONING_AGENT_ADDRESS=agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz" >> .env
echo "VALIDATION_AGENT_ADDRESS=agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm" >> .env
echo "CAPSULE_AGENT_ADDRESS=agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246" >> .env



# 5. Run agents (in separate terminals)
python agents/query_router_agent.py
python agents/research_agent.py
python agents/reasoning_agent.py
python agents/validation_agent.py
python agents/capsule_agent.py

# 6. Run frontend
cd frontend
npm run dev
```

**Visit:** `http://localhost:3000` 🎉

**Note:** Backend is no longer required. Frontend communicates directly with agents via `uagent-client`.

---

### **Deploy Smart Contracts**

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network base-sepolia
```

**Deployed Contracts (Base Sepolia):**

-   KnowledgeCapsuleNFT: `0x...` (to be added)
-   ReputationRegistry: `0x...` (to be added)

---

## 📦 Roadmap

### **✅ Hackathon MVP**

-   [x] 5-agent system with uAgents
-   [x] ASI:One + MeTTa integration
-   [x] Knowledge Capsule NFTs
-   [x] Vector search + IPFS storage

### **🚧 Post-Hackathon**

-   [ ] Mainnet deployment (Base)
-   [ ] Advanced agent validation models (fine-tuned validators)
-   [ ] Mobile app
-   [ ] Cross-domain knowledge graphs
-   [ ] Community governance for validation rules

---

## 🏆 Built at ETHGlobal ETHOnline 2025 Hackathon

**By NeriaAI Team**

-   **Samuel Danso - Product & Engineering Lead** – `me.samueldanso@gmail.com`
-   **Emmanuel Ameyaw — Backend & AI Engineering** – `emmanuel97ameyaw@gmail.com`

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**Use it. Fork it. Build something amazing on it.** 🚀
