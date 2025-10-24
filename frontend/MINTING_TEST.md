# 🧪 NFT Minting Test Guide

## 🎯 **Testing the Hybrid Minting Approach**

This guide helps you test both automatic and manual NFT minting in the NeriaAI platform.

## 📋 **Test Scenarios**

### **Scenario 1: Automatic Minting (High Confidence)**

1. **Ask a question** with high confidence expected
2. **Expected behavior**: NFT minted automatically
3. **Look for**: Success message with token ID and transaction hash

### **Scenario 2: Manual Minting (Low Confidence)**

1. **Ask a question** that might have lower confidence
2. **Expected behavior**: Storage completed, manual minting button appears
3. **Look for**: "Ready for NFT Minting" message with "Mint NFT" button

### **Scenario 3: Manual Minting Button**

1. **Click "Mint NFT" button** when it appears
2. **Expected behavior**: Modal opens with capsule details
3. **Look for**: Gas fee estimate, network info, confirmation dialog

## 🔧 **Configuration Options**

### **Minting Modes Available:**

#### **Automatic Mode**

-   ✅ **Always mints** if confidence > 70%
-   ❌ **No user control**
-   ✅ **Seamless experience**

#### **Manual Mode**

-   ✅ **User decides** when to mint
-   ✅ **Full control** over gas fees
-   ❌ **Extra step required**

#### **Hybrid Mode (Default)**

-   ✅ **Auto-mints** if confidence > 80%
-   ✅ **Manual button** for lower confidence
-   ✅ **Best of both worlds**

## 🎮 **How to Test**

### **Step 1: Start the System**

```bash
# Terminal 1: Start agents
cd agents
python query_router_agent.py

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### **Step 2: Connect Wallet**

1. Open `http://localhost:3000`
2. Click "Sign In" → Connect wallet
3. Switch to Base Sepolia network

### **Step 3: Test Questions**

#### **High Confidence Question (Auto-mint expected):**

```
"What is the capital of France?"
```

#### **Low Confidence Question (Manual mint expected):**

```
"Explain quantum computing in simple terms"
```

### **Step 4: Observe Behavior**

#### **Automatic Minting:**

-   ✅ Storage completed
-   ✅ NFT minted automatically
-   ✅ Success message with token ID
-   ✅ Explorer link provided

#### **Manual Minting:**

-   ✅ Storage completed
-   ✅ "Ready for NFT Minting" message
-   ✅ "Mint NFT" button appears
-   ✅ Click button → Modal opens
-   ✅ Confirm → NFT minted
-   ✅ Success message updates

## 🔍 **What to Look For**

### **Success Indicators:**

-   ✅ **Capsule ID** generated
-   ✅ **IPFS Hash** created
-   ✅ **Gateway URL** accessible
-   ✅ **Token ID** assigned
-   ✅ **Transaction Hash** confirmed
-   ✅ **Explorer link** working

### **Error Indicators:**

-   ❌ **Storage failed** message
-   ❌ **Minting failed** error
-   ❌ **Button not appearing** when expected
-   ❌ **Modal not opening** when clicked

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. Manual Button Not Appearing**

-   **Check**: Confidence threshold in `minting-options.ts`
-   **Fix**: Lower the `autoMintThreshold` value

#### **2. Modal Not Opening**

-   **Check**: Console for JavaScript errors
-   **Fix**: Verify component imports

#### **3. Minting Fails**

-   **Check**: Wallet connected to Base Sepolia
-   **Check**: Sufficient ETH for gas fees
-   **Check**: Contract address configured

#### **4. Auto-minting Not Working**

-   **Check**: Confidence score in response
-   **Check**: Minting mode configuration
-   **Fix**: Verify threshold settings

## ✅ **Success Criteria**

### **Complete Workflow Verified:**

-   [ ] Query processed by agents
-   [ ] Capsule stored in Supabase
-   [ ] Data uploaded to IPFS
-   [ ] NFT minting (auto or manual)
-   [ ] Transaction confirmed
-   [ ] Results displayed in UI
-   [ ] All links functional

### **User Experience:**

-   [ ] **Smooth flow** for high-confidence queries
-   [ ] **Clear options** for manual minting
-   [ ] **Transparent costs** shown
-   [ ] **Success feedback** provided
-   [ ] **Error handling** graceful

## 🎉 **Demo Ready!**

Once all tests pass, your NeriaAI platform demonstrates:

-   ✅ **Intelligent minting decisions** based on confidence
-   ✅ **User control** when needed
-   ✅ **Seamless experience** for verified content
-   ✅ **Complete blockchain integration**
-   ✅ **Professional UX** with clear feedback

**Your platform showcases the future of AI-powered NFT creation!** 🚀
