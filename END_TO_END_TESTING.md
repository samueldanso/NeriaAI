# 🧪 End-to-End Testing Guide

## 🎯 **Complete NeriaAI Platform Testing**

This guide will help you test the complete knowledge capsule workflow from query to NFT minting.

## 📋 **Prerequisites**

### 1. **Environment Setup**

```bash
# Frontend environment variables
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7fb9aB53bFA8E923C0A1aEacbDEAd3d1bD8A0357
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GATEWAY_URL=your-pinata-gateway-url
PINATA_JWT=your-pinata-jwt
```

### 2. **Required Services Running**

-   ✅ **Agents**: All 5 agents running locally with mailbox
-   ✅ **Frontend**: Next.js development server
-   ✅ **Supabase**: Database with schema applied
-   ✅ **Pinata**: IPFS service configured
-   ✅ **Base Sepolia**: Contract deployed and accessible

## 🚀 **Step-by-Step Testing Process**

### **Step 1: Start All Services**

#### Terminal 1: Start Agents

```bash
cd agents
python query_router_agent.py
```

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

### **Step 2: Connect Wallet**

1. **Open browser** → `http://localhost:3000`
2. **Click "Sign In"** → Connect wallet (MetaMask/Privy)
3. **Switch to Base Sepolia** network
4. **Verify connection** in sidebar

### **Step 3: Test Complete Workflow**

#### **Test Query**: "What is the future of decentralized AI?"

**Expected Flow:**

1. **🔀 Query Router** → Classifies query type
2. **🔍 Research Agent** → Searches knowledge base
3. **🧠 Reasoning Agent** → Generates reasoning chain
4. **✅ Validation Agent** → Validates with 2/3 consensus
5. **📦 Capsule Agent** → Creates knowledge capsule
6. **💾 Storage** → Supabase + IPFS + NFT minting
7. **🎉 Results** → Complete capsule with NFT details

### **Step 4: Verify Each Component**

#### **✅ Agent Processing**

-   Watch console logs for agent communication
-   Verify each agent receives and processes data
-   Check validation consensus (2/3 approval)

#### **✅ Supabase Storage**

-   Check database for new capsule record
-   Verify metadata and embeddings stored
-   Confirm IPFS hash updated

#### **✅ IPFS Storage**

-   Verify file uploaded to Pinata
-   Check gateway URL accessible
-   Confirm JSON data integrity

#### **✅ NFT Minting**

-   Verify transaction on Base Sepolia
-   Check token ID generated
-   Confirm gas fees paid
-   View on Base Sepolia explorer

#### **✅ Frontend Display**

-   See complete results in chat
-   Verify all links work
-   Check transaction details
-   Confirm NFT ownership

## 🔍 **Expected Results**

### **Console Output**

```
🔄 Starting capsule storage workflow...
📊 Step 1: Creating capsule in Supabase...
✅ Step 1: Capsule created with ID: [UUID]
📦 Step 2: Uploading to IPFS...
✅ Step 2: Uploaded to IPFS: [IPFS_HASH]
🔗 Step 3: Updating Supabase with IPFS hash...
✅ Step 3: Supabase updated with IPFS hash
⛓️ Step 4: Minting NFT on Base L2...
⏳ Transaction submitted: [TX_HASH]
✅ Transaction confirmed in block: [BLOCK_NUMBER]
🆔 Token ID: [TOKEN_ID]
✅ Step 4: NFT minted successfully!
🎉 Storage workflow complete!
```

### **Chat UI Results**

```
🎉 Knowledge Capsule Stored & NFT Minted Successfully!

📦 Capsule ID: [UUID]
🔗 IPFS Hash: [IPFS_HASH]
🌐 Gateway URL: [IPFS_GATEWAY_URL]

🎨 NFT Details:
🆔 Token ID: [TOKEN_ID]
⛓️ Transaction Hash: [TX_HASH]
🔗 Base Sepolia Explorer: [EXPLORER_URL]

✅ Your knowledge is now permanently stored on IPFS and minted as an NFT on Base L2!
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Agent Communication Failed**

-   **Check**: All agents running with correct addresses
-   **Fix**: Restart agents and verify .env file

#### **2. Supabase Connection Failed**

-   **Check**: Database URL and anon key
-   **Fix**: Verify schema applied and RLS policies

#### **3. IPFS Upload Failed**

-   **Check**: Pinata JWT token and gateway URL
-   **Fix**: Verify Pinata account and API limits

#### **4. NFT Minting Failed**

-   **Check**: Wallet connected to Base Sepolia
-   **Fix**: Ensure sufficient ETH for gas fees

#### **5. Contract Interaction Failed**

-   **Check**: Contract address and ABI
-   **Fix**: Verify contract deployed and accessible

### **Debug Commands**

```bash
# Check agent status
cd agents && python -c "import os; print('Agents configured:', bool(os.getenv('AGENT_ADDRESSES')))"

# Test Supabase connection
cd frontend && npm run test:supabase

# Test IPFS connection
cd frontend && npm run test:pinata

# Test contract interaction
cd frontend && npm run test:contract
```

## ✅ **Success Criteria**

### **Complete Workflow Verified**

-   [ ] Query processed by all 5 agents
-   [ ] Validation achieved 2/3 consensus
-   [ ] Capsule created in Supabase
-   [ ] Data uploaded to IPFS
-   [ ] NFT minted on Base Sepolia
-   [ ] Transaction visible on explorer
-   [ ] Results displayed in UI
-   [ ] All links functional

### **Performance Benchmarks**

-   **Total Time**: < 2 minutes for complete workflow
-   **Agent Processing**: < 30 seconds
-   **Storage Operations**: < 30 seconds
-   **NFT Minting**: < 60 seconds

## 🎉 **Demo Ready!**

Once all tests pass, your NeriaAI platform is ready for the hackathon demo! The complete knowledge capsule workflow demonstrates:

-   ✅ **Multi-Agent AI Reasoning**
-   ✅ **Decentralized Storage (IPFS)**
-   ✅ **Database Storage (Supabase)**
-   ✅ **Blockchain Integration (Base L2)**
-   ✅ **NFT Minting (ERC-721)**
-   ✅ **Complete Frontend Integration**

**Your platform showcases the future of decentralized AI knowledge management!** 🚀
