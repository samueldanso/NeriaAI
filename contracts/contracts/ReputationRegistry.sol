// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationRegistry
 * @dev Soulbound attestation tokens for validator reputation (ERC-4973 style)
 */
contract ReputationRegistry is Ownable {

    struct Validator {
        uint256 validationCount;    // Total validations performed
        uint256 successfulCount;    // Successful validations
        uint256 reputationScore;    // Calculated reputation (0-100)
        bool isActive;              // Active validator status
    }

    // Validator address => Validator data
    mapping(address => Validator) public validators;

    // Capsule ID => Validator => has attested
    mapping(uint256 => mapping(address => bool)) public attestations;

    // Events
    event AttestationIssued(address indexed validator, uint256 indexed capsuleId);
    event ReputationUpdated(address indexed validator, uint256 newScore);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Issue an attestation for a capsule validation
     * @param validator Address of the validator
     * @param capsuleId ID of the capsule validated
     */
    function issueAttestation(address validator, uint256 capsuleId)
        public
        onlyOwner
    {
        require(validator != address(0), "Invalid validator address");
        require(!attestations[capsuleId][validator], "Already attested");

        attestations[capsuleId][validator] = true;

        // Update validator stats
        if (!validators[validator].isActive) {
            validators[validator].isActive = true;
        }

        validators[validator].validationCount++;
        validators[validator].successfulCount++; // Assume successful for MVP

        // Recalculate reputation (simple formula for MVP)
        _updateReputation(validator);

        emit AttestationIssued(validator, capsuleId);
    }

    /**
     * @dev Get validator reputation score
     * @param validator Address of the validator
     * @return Reputation score (0-100)
     */
    function getReputation(address validator)
        public
        view
        returns (uint256)
    {
        return validators[validator].reputationScore;
    }

    /**
     * @dev Get full validator data
     * @param validator Address of the validator
     */
    function getValidatorData(address validator)
        public
        view
        returns (Validator memory)
    {
        return validators[validator];
    }

    /**
     * @dev Check if validator has attested to a capsule
     */
    function hasAttested(uint256 capsuleId, address validator)
        public
        view
        returns (bool)
    {
        return attestations[capsuleId][validator];
    }

    /**
     * @dev Internal function to update reputation score
     * Simple formula: (successfulCount / validationCount) * 100
     */
    function _updateReputation(address validator) private {
        Validator storage v = validators[validator];

        if (v.validationCount == 0) {
            v.reputationScore = 0;
            return;
        }

        // Calculate success rate as percentage
        uint256 successRate = (v.successfulCount * 100) / v.validationCount;

        // Add bonus for high volume (cap at 100)
        uint256 volumeBonus = v.validationCount > 10 ? 10 : v.validationCount;
        uint256 newScore = successRate + volumeBonus;

        v.reputationScore = newScore > 100 ? 100 : newScore;

        emit ReputationUpdated(validator, v.reputationScore);
    }
}
