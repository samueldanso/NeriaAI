// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KnowledgeCapsuleNFT
 * @dev ERC-721 NFT for verified AI reasoning knowledge capsules
 */
contract KnowledgeCapsuleNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct Capsule {
        string ipfsHash;           // IPFS hash of full reasoning data
        address creator;           // Original creator
        uint256 timestamp;         // Creation time
        bool verified;             // Validation status
        address[] validators;      // Addresses that verified
    }

    // Token ID => Capsule data
    mapping(uint256 => Capsule) public capsules;

    // Events
    event CapsuleCreated(uint256 indexed tokenId, address indexed creator, string ipfsHash);
    event CapsuleVerified(uint256 indexed tokenId, address[] validators);

    constructor() ERC721("NeriaKnowledgeCapsule", "NERIA") Ownable(msg.sender) {}

    /**
     * @dev Mint a new Knowledge Capsule NFT
     * @param ipfsHash IPFS hash containing full reasoning data
     * @return tokenId The ID of the newly minted token
     */
    function mintCapsule(string memory ipfsHash)
        public
        returns (uint256)
    {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);

        capsules[newTokenId] = Capsule({
            ipfsHash: ipfsHash,
            creator: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            validators: new address[](0)
        });

        emit CapsuleCreated(newTokenId, msg.sender, ipfsHash);

        return newTokenId;
    }

    /**
     * @dev Verify a capsule (only owner/validation system can call)
     * @param tokenId The token ID to verify
     * @param validatorAddresses Addresses of validators who approved
     */
    function verifyCapsule(uint256 tokenId, address[] memory validatorAddresses)
        public
        onlyOwner
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(!capsules[tokenId].verified, "Already verified");
        require(validatorAddresses.length > 0, "Must have at least one validator");

        capsules[tokenId].verified = true;
        capsules[tokenId].validators = validatorAddresses;

        emit CapsuleVerified(tokenId, validatorAddresses);
    }

    /**
     * @dev Get capsule data
     * @param tokenId The token ID
     * @return Capsule data
     */
    function getCapsuleData(uint256 tokenId)
        public
        view
        returns (Capsule memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return capsules[tokenId];
    }

    /**
     * @dev Get total supply of capsules
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
