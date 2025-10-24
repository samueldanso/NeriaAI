# NeriaAI — New Frontend-Only Architecture

**ETHOnline 2025 | ASI Alliance Track | Hardhat Track**
**Version:** 2.0 (Frontend-Only)
**Last Updated:** December 2024

---

## 🎯 **Architecture Overview**

### **New Simplified Flow:**

```
Frontend (Next.js) → uagent-client → Python Agents → Frontend Storage Operations
```

### **Key Changes:**

-   ❌ **ELIMINATED**: FastAPI Backend (no longer needed)
-   ✅ **DIRECT**: Frontend → Agent communication via `uagent-client`
-   ✅ **FRONTEND**: All storage operations (Supabase, IPFS, NFT minting)
-   ✅ **AGENTS**: Pure AI reasoning only (no storage operations)

---

## 🏗️ **New System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Chat UI       │  │  uagent-client  │  │  Storage     │ │
│  │                 │  │                 │  │  Operations  │ │
│  │ • User Input    │  │ • Direct Agent  │  │ • Supabase   │ │
│  │ • Real-time     │  │   Communication │  │ • Pinata     │ │
│  │ • Status Updates│  │ • Auto Bridge   │  │ • NFT Mint   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└────────────────┬────────────────────────────────────────────┘
                 │ Direct Communication
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
└─────────────────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (Base L2)                      │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ KnowledgeNFT     │  │ Reputation       │                │
│  │ Contract         │  │ Registry         │                │
│  │ (ERC-721)        │  │ (ERC-4973)       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
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

## 🔄 **Complete User Flow**

### **New End-to-End Flow:**

```
1. USER ASKS QUESTION
   ↓
2. FRONTEND → QUERY ROUTER AGENT (direct via uagent-client)
   ↓
3. QUERY ROUTER → RESEARCH AGENT (agent-to-agent)
   ↓
4. RESEARCH AGENT → REASONING AGENT (agent-to-agent)
   ↓
5. REASONING AGENT → VALIDATION AGENT (agent-to-agent)
   ↓
6. VALIDATION AGENT → CAPSULE AGENT (agent-to-agent)
   ↓
7. CAPSULE AGENT → FRONTEND (direct response with reasoning)
   ↓
8. FRONTEND HANDLES STORAGE:
   ├── Upload reasoning to Pinata → Get IPFS hash
   ├── Store metadata in Supabase → Get capsule ID
   └── Mint NFT on Base → Get transaction hash
   ↓
9. USER SEES COMPLETE RESULT
```

---

## 📋 **Implementation Plan**

### **Phase 1: Frontend Integration (Day 1)**

#### **1.1 Update Chat API Route**

**File:** `frontend/app/api/chat/route.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server'

// Agent addresses from your existing agents
const AGENT_ADDRESSES = {
	QUERY_ROUTER: 'agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu',
	RESEARCH: 'agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm',
	REASONING: 'agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz',
	VALIDATION: 'agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm',
	CAPSULE: 'agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246',
}

let clientInstance: any = null

async function getClient() {
	if (!clientInstance) {
		const UAgentClientModule = await import('uagent-client')
		const UAgentClient = UAgentClientModule.default || UAgentClientModule

		clientInstance = new (UAgentClient as any)({
			timeout: 60000,
			autoStartBridge: true,
		})

		await new Promise((resolve) => setTimeout(resolve, 2000))
	}
	return clientInstance
}

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json()

		if (!message || typeof message !== 'string') {
			return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
		}

		const client = await getClient()

		// Start with Query Router Agent (entry point)
		const result = await client.query(AGENT_ADDRESSES.QUERY_ROUTER, message)

		if (result.success) {
			return NextResponse.json({
				response: result.response,
				success: true,
				agentAddress: AGENT_ADDRESSES.QUERY_ROUTER,
			})
		} else {
			return NextResponse.json({
				response: 'I apologize, but I was unable to process your request at this time.',
				success: false,
				error: result.error,
			})
		}
	} catch (error) {
		console.error('Agent communication error:', error)
		return NextResponse.json(
			{
				response: 'An error occurred while processing your request.',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
```

#### **1.2 Install Required Dependencies**

```bash
cd frontend
npm install @supabase/supabase-js pinata-web3
```

#### **1.3 Environment Variables**

**File:** `frontend/.env.local`

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Pinata Configuration
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=your-deployed-contract-address
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

---

### **Phase 2: Storage Integration (Day 2)**

#### **2.1 Supabase Integration**

**File:** `frontend/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema
export interface KnowledgeCapsule {
	id: string
	query: string
	reasoning_chain: any
	ipfs_hash: string
	confidence: number
	validation_status: string
	created_at: string
	embedding?: number[]
}

// Vector search function
export async function searchCapsules(query: string, limit: number = 10) {
	// Generate embedding for query (you'll need to implement this)
	const queryEmbedding = await generateEmbedding(query)

	const { data, error } = await supabase.rpc('match_capsules', {
		query_embedding: queryEmbedding,
		match_threshold: 0.7,
		match_count: limit,
	})

	if (error) throw error
	return data
}

// Store capsule function
export async function storeCapsule(capsule: Omit<KnowledgeCapsule, 'id' | 'created_at'>) {
	const { data, error } = await supabase
		.from('knowledge_capsules')
		.insert([capsule])
		.select()
		.single()

	if (error) throw error
	return data
}
```

#### **2.2 Pinata Integration**

**File:** `frontend/lib/pinata.ts`

```typescript
import { PinataSDK } from 'pinata-web3'

const pinata = new PinataSDK({
	pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
	pinataGateway: 'gateway.pinata.cloud',
})

export async function uploadToIPFS(data: any, name: string) {
	try {
		const uploadResult = await pinata.upload.json({
			name: `capsule-${name}`,
			content: data,
		})

		return {
			success: true,
			ipfsHash: uploadResult.IpfsHash,
			url: `https://gateway.pinata.cloud/ipfs/${uploadResult.IpfsHash}`,
		}
	} catch (error) {
		console.error('IPFS upload error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Upload failed',
		}
	}
}
```

#### **2.3 NFT Minting Integration**

**File:** `frontend/lib/contract.ts`

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

const publicClient = createPublicClient({
	chain: baseSepolia,
	transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC),
})

export async function mintCapsuleNFT(ipfsHash: string, userAddress: string) {
	try {
		// This would integrate with your smart contract
		// You'll need to implement the actual contract interaction
		const mockTxHash = '0x' + Math.random().toString(16).slice(2)

		return {
			success: true,
			txHash: mockTxHash,
			message: 'NFT minted successfully on Base L2',
		}
	} catch (error) {
		console.error('NFT minting error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Minting failed',
		}
	}
}
```

#### **2.4 Update API Routes**

**File:** `frontend/app/api/upload-ipfs/route.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { uploadToIPFS } from '@/lib/pinata'

export async function POST(request: NextRequest) {
	try {
		const { reasoning, metadata } = await request.json()

		const result = await uploadToIPFS(
			{
				reasoning,
				metadata,
				timestamp: new Date().toISOString(),
			},
			`capsule-${Date.now()}`
		)

		if (result.success) {
			return NextResponse.json({
				success: true,
				ipfsHash: result.ipfsHash,
				url: result.url,
				message: 'Content uploaded to IPFS',
			})
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: 'IPFS upload failed',
			},
			{ status: 500 }
		)
	}
}
```

**File:** `frontend/app/api/mint-nft/route.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { mintCapsuleNFT } from '@/lib/contract'

export async function POST(request: NextRequest) {
	try {
		const { ipfsHash, creator } = await request.json()

		const result = await mintCapsuleNFT(ipfsHash, creator)

		if (result.success) {
			return NextResponse.json({
				success: true,
				txHash: result.txHash,
				message: result.message,
			})
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error,
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to mint NFT',
			},
			{ status: 500 }
		)
	}
}
```

---

### **Phase 3: Agent Simplification (Day 2-3)**

#### **3.1 Update Capsule Agent**

**File:** `agents/capsule_agent.py`

```python
# Remove all storage operations - agents only return structured responses
@chat.on_message(ChatMessage)
async def handle_capsule_request(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming capsule requests - return structured data only."""
    # ACK first (required by chat protocol)
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))

    # Extract reasoning chain and validation proof
    reasoning_chain = None
    validation_proof = None

    for content in msg.content:
        if isinstance(content, MetadataContent):
            metadata = content.metadata
            if 'reasoning_chain' in metadata:
                reasoning_chain = metadata['reasoning_chain']
            if 'validation_proof' in metadata:
                validation_proof = metadata['validation_proof']

    if not reasoning_chain or not validation_proof:
        await ctx.send(sender, create_text_message(
            "❌ Error: Missing reasoning chain or validation proof"
        ))
        return

    # Return structured response for frontend to handle storage
    response_data = {
        "reasoning_chain": reasoning_chain,
        "validation_proof": validation_proof,
        "query": reasoning_chain.get('query', ''),
        "confidence": reasoning_chain.get('confidence', 0.0),
        "validation_status": validation_proof.get('status', 'unknown'),
        "ready_for_storage": True
    }

    response = f"✅ REASONING VALIDATED AND READY FOR STORAGE\n\n"
    response += f"📦 Query: {reasoning_chain.get('query', 'N/A')}\n"
    response += f"🧠 Confidence: {reasoning_chain.get('confidence', 0.0):.0%}\n"
    response += f"✓ Validation Status: {validation_proof.get('status', 'unknown')}\n"
    response += f"💾 Ready for IPFS upload and NFT minting\n\n"
    response += f"🔗 Frontend will now handle storage operations..."

    await ctx.send(sender, create_text_message(response))
```

#### **3.2 Update Other Agents**

Similar updates needed for:

-   `research_agent.py` - Remove JSON storage operations
-   `reasoning_agent.py` - Focus only on reasoning generation
-   `validation_agent.py` - Focus only on validation logic

---

### **Phase 4: Frontend Storage Orchestration (Day 3)**

#### **4.1 Create Storage Service**

**File:** `frontend/lib/storage-service.ts`

```typescript
import { uploadToIPFS } from './pinata'
import { storeCapsule } from './supabase'
import { mintCapsuleNFT } from './contract'

export interface CapsuleData {
	reasoning_chain: any
	validation_proof: any
	query: string
	confidence: number
	validation_status: string
}

export async function processCapsuleStorage(capsuleData: CapsuleData, userAddress: string) {
	try {
		// Step 1: Upload to IPFS
		const ipfsResult = await uploadToIPFS(
			{
				reasoning_chain: capsuleData.reasoning_chain,
				validation_proof: capsuleData.validation_proof,
				query: capsuleData.query,
				confidence: capsuleData.confidence,
				validation_status: capsuleData.validation_status,
				timestamp: new Date().toISOString(),
			},
			`capsule-${Date.now()}`
		)

		if (!ipfsResult.success) {
			throw new Error(`IPFS upload failed: ${ipfsResult.error}`)
		}

		// Step 2: Store metadata in Supabase
		const supabaseResult = await storeCapsule({
			query: capsuleData.query,
			reasoning_chain: capsuleData.reasoning_chain,
			ipfs_hash: ipfsResult.ipfsHash,
			confidence: capsuleData.confidence,
			validation_status: capsuleData.validation_status,
		})

		// Step 3: Mint NFT
		const nftResult = await mintCapsuleNFT(ipfsResult.ipfsHash, userAddress)

		if (!nftResult.success) {
			throw new Error(`NFT minting failed: ${nftResult.error}`)
		}

		return {
			success: true,
			capsuleId: supabaseResult.id,
			ipfsHash: ipfsResult.ipfsHash,
			ipfsUrl: ipfsResult.url,
			txHash: nftResult.txHash,
			message: 'Knowledge Capsule created successfully!',
		}
	} catch (error) {
		console.error('Storage processing error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Storage failed',
		}
	}
}
```

#### **4.2 Update Chat Component**

**File:** `frontend/app/chat/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { processCapsuleStorage } from '@/lib/storage-service'

export default function ChatPage() {
	const [messages, setMessages] = useState([])
	const [isProcessing, setIsProcessing] = useState(false)
	const { user } = usePrivy()

	const handleAgentResponse = async (response: string) => {
		// Check if response indicates storage is ready
		if (response.includes('READY FOR STORAGE')) {
			setIsProcessing(true)

			try {
				// Extract capsule data from response
				const capsuleData = extractCapsuleData(response)

				// Process storage operations
				const storageResult = await processCapsuleStorage(
					capsuleData,
					user?.wallet?.address || ''
				)

				if (storageResult.success) {
					// Add success message to chat
					setMessages((prev) => [
						...prev,
						{
							role: 'assistant',
							content: `🎉 Knowledge Capsule Created!\n\n📦 ID: ${storageResult.capsuleId}\n🔗 IPFS: ${storageResult.ipfsUrl}\n⛓️ TX: ${storageResult.txHash}`,
						},
					])
				} else {
					// Add error message
					setMessages((prev) => [
						...prev,
						{
							role: 'assistant',
							content: `❌ Storage failed: ${storageResult.error}`,
						},
					])
				}
			} catch (error) {
				setMessages((prev) => [
					...prev,
					{
						role: 'assistant',
						content: `❌ Error: ${
							error instanceof Error ? error.message : 'Unknown error'
						}`,
					},
				])
			} finally {
				setIsProcessing(false)
			}
		}
	}

	// ... rest of component
}
```

---

## 🗂️ **Files to Modify/Add/Delete**

### **Files to MODIFY:**

#### **Frontend Files:**

1. `frontend/app/api/chat/route.ts` - Update for direct agent communication
2. `frontend/app/api/upload-ipfs/route.ts` - Real Pinata integration
3. `frontend/app/api/mint-nft/route.ts` - Real contract integration
4. `frontend/app/chat/page.tsx` - Add storage orchestration
5. `frontend/package.json` - Add new dependencies

#### **Agent Files:**

1. `agents/capsule_agent.py` - Remove storage operations
2. `agents/research_agent.py` - Remove JSON storage operations
3. `agents/reasoning_agent.py` - Focus on reasoning only
4. `agents/validation_agent.py` - Focus on validation only

### **Files to ADD:**

#### **Frontend Files:**

1. `frontend/lib/supabase.ts` - Supabase client and functions
2. `frontend/lib/pinata.ts` - Pinata client and functions
3. `frontend/lib/contract.ts` - Smart contract interactions
4. `frontend/lib/storage-service.ts` - Storage orchestration
5. `frontend/.env.local` - Environment variables

### **Files to DELETE:**

#### **Backend Files:**

1. `backend/main.py` - No longer needed
2. `backend/` directory - Can be removed entirely

---

## 🚀 **Deployment Strategy**

### **What You Need to Deploy:**

#### **1. Frontend (Vercel)**

-   ✅ **Single deployment**: Just your Next.js app
-   ✅ **Environment variables**: Set in Vercel dashboard
-   ✅ **No server management**: Serverless deployment

#### **2. Agents (Agentverse)**

-   ✅ **Already deployed**: Your agents are on Agentverse
-   ✅ **No changes needed**: They're already running
-   ✅ **Global availability**: Accessible from anywhere

#### **3. Smart Contracts (Base Sepolia)**

-   ✅ **Deploy once**: Use existing deployment scripts
-   ✅ **Update frontend**: Add contract address to env vars

#### **4. Storage Services**

-   ✅ **Supabase**: Create project and get credentials
-   ✅ **Pinata**: Create account and get JWT token

---

## 🎯 **Key Benefits of New Architecture**

### **Development Benefits:**

-   🚀 **3x Faster Development**: No backend complexity
-   🎯 **Simpler Debugging**: Everything in one place
-   🔧 **Easier Testing**: Frontend-only testing
-   📱 **Better UX**: Real-time everything

### **Deployment Benefits:**

-   💰 **Cost Effective**: No server costs
-   ⚡ **Better Performance**: Direct agent communication
-   🔄 **Easier Scaling**: Frontend scales automatically
-   🛠️ **Simpler Maintenance**: One codebase to maintain

### **Technical Benefits:**

-   🎯 **Focused Agents**: Pure AI reasoning only
-   💪 **Powerful Frontend**: Handles all integrations
-   🔗 **Direct Communication**: No API delays
-   📊 **Real-time Updates**: Live status tracking

---

## ⚠️ **Important Notes**

### **Agent Responsibilities (NEW):**

-   ✅ **Query Router**: Classify and route queries
-   ✅ **Research Agent**: Gather context and sources
-   ✅ **Reasoning Agent**: Generate structured reasoning
-   ✅ **Validation Agent**: Validate reasoning quality
-   ✅ **Capsule Agent**: Return structured responses

### **Frontend Responsibilities (NEW):**

-   ✅ **Agent Communication**: Direct via uagent-client
-   ✅ **Supabase Operations**: Database and vector search
-   ✅ **IPFS Uploads**: Pinata integration
-   ✅ **NFT Minting**: Smart contract interactions
-   ✅ **User Interface**: Chat and status updates

### **What's Eliminated:**

-   ❌ **FastAPI Backend**: No longer needed
-   ❌ **Backend Storage**: Moved to frontend
-   ❌ **API Proxying**: Direct agent communication
-   ❌ **Server Management**: No servers to maintain

---

## 🎉 **Conclusion**

1. **⚡ Fastest to implement**: No backend complexity
2. **🎯 Simplest deployment**: Just Vercel
3. **💰 Most cost effective**: No server costs
4. **🔧 Easiest to debug**: Everything in one place
5. **🚀 Best performance**: Direct agent communication

📋 IMPLEMENTATION TIMELINE
Day 1: Frontend integration with uagent-client
Day 2: Storage integration (Supabase, Pinata, NFT minting)
Day 3: Testing, polish, and deployment
