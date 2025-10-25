# NeriaAI Smart Contracts

This project contains the smart contracts for NeriaAI's Knowledge Capsule NFT system, built with Hardhat 3 and deployed on Base L2.

## Project Overview

This project includes:

-   **KnowledgeCapsuleNFT.sol** - ERC-721 NFT contract for verified AI reasoning capsules
-   **ReputationRegistry.sol** - ERC-4973 attestation contract for validator reputation
-   **Hardhat 3** - Modern development environment with TypeScript and Viem
-   **Base L2 Deployment** - Optimized for Base Sepolia and Base Mainnet
-   **Comprehensive Testing** - Unit tests using Hardhat's native test runner

## Usage

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test files
npx hardhat test test/KnowledgeCapsuleNFT.test.ts
```

### Deploy to Base Sepolia

```bash
# Set your private key
npx hardhat keystore set BASE_SEPOLIA_PRIVATE_KEY

# Deploy the contract
npx hardhat ignition deploy --network base-sepolia ignition/modules/DeployNeria.ts
```

### Deploy to Base Mainnet

```bash
# Set your private key
npx hardhat keystore set BASE_MAINNET_PRIVATE_KEY

# Deploy the contract
npx hardhat ignition deploy --network base-mainnet ignition/modules/DeployNeria.ts
```

### Contract Functions

-   `mintCapsule(ipfsHash)` - Mint a new Knowledge Capsule NFT
-   `getCapsuleData(tokenId)` - Get capsule data from blockchain
-   `verifyCapsule(tokenId, validators)` - Verify a capsule (owner only)
-   `totalSupply()` - Get total number of minted capsules

### Deployed Contract

**Address:** `0x7fb9aB53bFA8E923C0A1aEacbDEAd3d1bD8A0357`
**Network:** Base Sepolia (Chain ID: 84532)
**Explorer:** https://sepolia.basescan.org/address/0x7fb9aB53bFA8E923C0A1aEacbDEAd3d1bD8A0357
