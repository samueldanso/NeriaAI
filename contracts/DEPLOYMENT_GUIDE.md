# NeriaAI Contract Deployment Guide

## 🚀 Deploy KnowledgeCapsuleNFT to Base Sepolia

### Prerequisites

1. **Base Sepolia ETH for Gas Fees**

    - Get testnet ETH from: https://bridge.base.org/deposit
    - You need ~0.01 ETH for deployment

2. **Private Key Setup**
    - Export your private key as environment variable:
    ```bash
    export BASE_SEPOLIA_PRIVATE_KEY='your-private-key-here'
    ```

### Deployment Options

#### Option 1: Direct Ignition Deployment (Recommended)

```bash
cd contracts
npx hardhat ignition deploy --network base-sepolia ignition/modules/DeployNeria.ts
```

#### Option 2: Using Deployment Script

```bash
cd contracts
npx hardhat run scripts/deploy-neria.ts --network base-sepolia
```

### Expected Output

After successful deployment, you'll see:

```
✅ NeriaAIModule deployed
📦 KnowledgeCapsuleNFT deployed to: 0x[CONTRACT_ADDRESS]
```

### Post-Deployment Steps

1. **Copy the contract address** from the deployment output
2. **Update frontend environment**:
    ```bash
    # In frontend/.env.local
    NEXT_PUBLIC_CONTRACT_ADDRESS=0x[CONTRACT_ADDRESS]
    NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
    ```
3. **Verify on Base Sepolia Explorer**:
    - Visit: https://sepolia.basescan.org/address/0x[CONTRACT_ADDRESS]
    - Verify the contract is deployed and functions are accessible

### Testing the Deployed Contract

```bash
# Test the deployed contract
npx hardhat test --network base-sepolia
```

### Troubleshooting

-   **"Insufficient funds"**: Get more Base Sepolia ETH
-   **"Invalid private key"**: Check your BASE_SEPOLIA_PRIVATE_KEY format
-   **"Network error"**: Verify Base Sepolia RPC is accessible

### Contract Functions

Once deployed, the contract supports:

-   `mintCapsule(ipfsHash)` - Mint a new Knowledge Capsule NFT
-   `getCapsuleData(tokenId)` - Get capsule data
-   `verifyCapsule(tokenId, validators)` - Verify a capsule (owner only)
-   `totalSupply()` - Get total number of minted capsules
