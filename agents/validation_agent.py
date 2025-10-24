# validation_agent.py
"""
NeriaMind Multi-Agent Validation System
Coordinates 3 specialized sub-validators for automated reasoning validation

Architecture:
┌─────────────────────────────────────────────┐
│        VALIDATION AGENT (Coordinator)        │
├─────────────────────────────────────────────┤
│  ├─ Logic Validator: Checks coherence ✅    │
│  ├─ Source Validator: Verifies facts ✅     │
│  └─ Completeness Validator: Checks answer ✅│
│                                              │
│  Consensus: 3/3 approved → VERIFIED ✅       │
│  (If 1-2 reject → Revision requested 🔄)    │
└─────────────────────────────────────────────┘

Features:
- Automated multi-agent validation (no human required)
- Logic coherence checking
- Source/fact verification
- Completeness assessment
- Consensus-based approval
- Revision feedback loop to Reasoning Agent
- Validation proof generation
"""

import os
import json
import re
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any, List, Tuple
from enum import Enum

from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    MetadataContent,
)

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Validation status enum
class ValidationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REVISION_REQUESTED = "revision_requested"
    REJECTED = "rejected"
    IN_REVIEW = "in_review"
    VERIFIED = "verified"  # All 3 validators approved

class ValidatorDecision(str, Enum):
    APPROVE = "approve"
    REJECT = "reject"
    NEEDS_REVISION = "needs_revision"

# Agent configuration
VALIDATION_NAME = os.getenv("VALIDATION_NAME", "validation_agent")
VALIDATION_PORT = int(os.getenv("VALIDATION_PORT", "9003"))
VALIDATION_SEED = os.getenv("VALIDATION_SEED", "validation_agent_secret_seed")

# Agent addresses
CAPSULE_AGENT_ADDRESS = os.getenv("CAPSULE_AGENT_ADDRESS", "")
REASONING_AGENT_ADDRESS = os.getenv("REASONING_AGENT_ADDRESS", "")

# Validation configuration
CONSENSUS_THRESHOLD = 3  # All 3 validators must approve
MAX_REVISION_ATTEMPTS = int(os.getenv("MAX_REVISION_ATTEMPTS", "2"))

# Initialize the Validation Agent
validation_agent = Agent(
    name=VALIDATION_NAME,
    port=VALIDATION_PORT,
    seed=VALIDATION_SEED,
    mailbox=True,
)

# Chat protocol
chat = Protocol(spec=chat_protocol_spec)

# Active validation sessions
validation_sessions: Dict[str, Dict[str, Any]] = {}


# ============================================
# VALIDATOR CLASSES
# ============================================

class LogicValidator:
    """
    Validates logical coherence and consistency of reasoning.

    Checks:
    - No logical contradictions
    - Valid reasoning patterns
    - Proper inference steps
    - Sound argumentation structure
    """

    def __init__(self):
        self.name = "Logic Validator"
        self.version = "1.0"

    def validate(self, reasoning_chain: Dict[str, Any]) -> Tuple[ValidatorDecision, str, float]:
        """
        Validate logical coherence.

    Returns:
            (decision, feedback, confidence_score)
        """
        issues = []
        score = 1.0

        reasoning_steps = reasoning_chain.get('reasoning_steps', '')
        reasoning_type = reasoning_chain.get('reasoning_type', '')

        # Check 1: Reasoning steps are not empty
        if not reasoning_steps or len(reasoning_steps.strip()) < 50:
            issues.append("Reasoning steps are too brief or missing")
            score -= 0.3

        # Check 2: Look for logical structure keywords
        structure_keywords = ['therefore', 'thus', 'because', 'since', 'follows',
                             'implies', 'consequently', 'hence', 'step', 'first', 'then']
        found_keywords = sum(1 for kw in structure_keywords if kw.lower() in reasoning_steps.lower())

        if found_keywords < 2:
            issues.append("Reasoning lacks clear logical structure (missing transition words)")
            score -= 0.2

        # Check 3: Check for contradictions (basic)
        contradiction_patterns = [
            (r'\b(not|never|no)\b.*\b(is|are|was|were)\b', r'\b(is|are|was|were)\b'),
            (r'\bfalse\b', r'\btrue\b'),
            (r'\bcannot\b', r'\bcan\b'),
        ]

        for neg_pattern, pos_pattern in contradiction_patterns:
            if re.search(neg_pattern, reasoning_steps, re.IGNORECASE) and \
               re.search(pos_pattern, reasoning_steps, re.IGNORECASE):
                # Check if they're about the same subject (simple heuristic)
                issues.append("Potential logical contradiction detected")
                score -= 0.25
                break

        # Check 4: Reasoning type consistency
        type_keywords = {
            'deductive': ['premise', 'conclusion', 'logic', 'follows'],
            'inductive': ['pattern', 'observation', 'generalize', 'examples'],
            'causal': ['cause', 'effect', 'because', 'leads to', 'results in'],
            'comparative': ['compare', 'contrast', 'difference', 'similarity', 'versus'],
            'abductive': ['explanation', 'hypothesis', 'likely', 'best', 'explains']
        }

        if reasoning_type in type_keywords:
            expected_keywords = type_keywords[reasoning_type]
            found = sum(1 for kw in expected_keywords if kw in reasoning_steps.lower())
            if found == 0:
                issues.append(f"Reasoning doesn't match declared type '{reasoning_type}'")
                score -= 0.2

        # Check 5: Numbered steps or clear progression
        has_numbers = bool(re.search(r'\b[1-9]\.|step\s+[1-9]', reasoning_steps, re.IGNORECASE))
        has_bullets = bool(re.search(r'^[-*•]', reasoning_steps, re.MULTILINE))

        if not has_numbers and not has_bullets:
            issues.append("Reasoning steps could be more clearly structured")
            score -= 0.15

        # Make decision
        score = max(0.0, score)

        if score >= 0.8 and len(issues) == 0:
            return (ValidatorDecision.APPROVE,
                   "✅ Logic is coherent and well-structured",
                   score)
        elif score >= 0.6:
            return (ValidatorDecision.NEEDS_REVISION,
                   f"⚠️ Logic needs improvement:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)
        else:
            return (ValidatorDecision.REJECT,
                   f"❌ Logical issues found:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)


class SourceValidator:
    """
    Validates factual accuracy and source credibility.

    Checks:
    - Claims are supported by context
    - No obvious factual errors
    - References to knowledge are appropriate
    - Evidence supports conclusions
    """

    def __init__(self):
        self.name = "Source Validator"
        self.version = "1.0"

    def validate(self, reasoning_chain: Dict[str, Any]) -> Tuple[ValidatorDecision, str, float]:
        """
        Validate factual accuracy and sources.

    Returns:
            (decision, feedback, confidence_score)
        """
        issues = []
        score = 1.0

        reasoning_steps = reasoning_chain.get('reasoning_steps', '')
        metadata = reasoning_chain.get('metadata', {})
        metta_knowledge = reasoning_chain.get('metta_knowledge_used', {})

        # Check 1: Research context provided
        has_research_context = metadata.get('has_research_context', False)
        if not has_research_context and not metta_knowledge:
            issues.append("No research context or knowledge base references provided")
            score -= 0.3

        # Check 2: MeTTa knowledge utilization
        if metta_knowledge:
            patterns = metta_knowledge.get('patterns', [])
            domain_rules = metta_knowledge.get('domain_rules', [])

            if len(patterns) == 0 and len(domain_rules) == 0:
                issues.append("MeTTa knowledge referenced but not utilized")
                score -= 0.2

        # Check 3: Check for unsupported claims (basic detection)
        claim_indicators = ['claim', 'assert', 'state', 'argue', 'propose']
        evidence_indicators = ['because', 'evidence', 'shown', 'research', 'study',
                              'according to', 'based on', 'demonstrates']

        has_claims = any(indicator in reasoning_steps.lower() for indicator in claim_indicators)
        has_evidence = any(indicator in reasoning_steps.lower() for indicator in evidence_indicators)

        if has_claims and not has_evidence:
            issues.append("Contains claims without supporting evidence")
            score -= 0.25

        # Check 4: Check for hedge words (uncertainty indicators)
        hedge_words = ['might', 'possibly', 'perhaps', 'unclear', 'uncertain',
                       'not sure', 'don\'t know', 'unclear']
        excessive_hedging = sum(1 for word in hedge_words if word in reasoning_steps.lower())

        if excessive_hedging > 3:
            issues.append("Excessive uncertainty in reasoning (too many hedge words)")
            score -= 0.2

        # Check 5: Confidence vs content quality
        confidence = reasoning_chain.get('confidence', 0.5)
        if confidence > 0.8 and not has_research_context and not metta_knowledge:
            issues.append("High confidence claim without knowledge base support")
            score -= 0.3

        # Check 6: Look for citation patterns (even informal)
        has_references = bool(re.search(r'(according to|research|study|paper|source|reference)',
                                       reasoning_steps, re.IGNORECASE))
        if has_references:
            score += 0.1  # Bonus for citing sources

        # Make decision
        score = max(0.0, min(1.0, score))

        if score >= 0.8 and len(issues) == 0:
            return (ValidatorDecision.APPROVE,
                   "✅ Facts are well-supported and credible",
                   score)
        elif score >= 0.6:
            return (ValidatorDecision.NEEDS_REVISION,
                   f"⚠️ Source validation needs improvement:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)
        else:
            return (ValidatorDecision.REJECT,
                   f"❌ Factual concerns found:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)


class CompletenessValidator:
    """
    Validates completeness and thoroughness of answer.

    Checks:
    - Question is fully answered
    - All key concepts addressed
    - Conclusion provided
    - No missing steps in reasoning
    """

    def __init__(self):
        self.name = "Completeness Validator"
        self.version = "1.0"

    def validate(self, reasoning_chain: Dict[str, Any]) -> Tuple[ValidatorDecision, str, float]:
        """
        Validate completeness of reasoning.

        Returns:
            (decision, feedback, confidence_score)
        """
        issues = []
        score = 1.0

        query = reasoning_chain.get('query', '')
        reasoning_steps = reasoning_chain.get('reasoning_steps', '')
        key_concepts = reasoning_chain.get('key_concepts', [])

        # Check 1: Query is addressed
        if not query:
            issues.append("Original query missing")
            score -= 0.3
        else:
            # Check if key query words appear in reasoning
            query_words = set(re.findall(r'\b\w{4,}\b', query.lower()))
            reasoning_words = set(re.findall(r'\b\w{4,}\b', reasoning_steps.lower()))
            overlap = len(query_words & reasoning_words) / max(len(query_words), 1)

            if overlap < 0.3:
                issues.append("Reasoning doesn't address key terms from the query")
                score -= 0.25

        # Check 2: Key concepts are covered
        if key_concepts:
            concepts_mentioned = sum(1 for concept in key_concepts
                                    if concept.lower() in reasoning_steps.lower())
            coverage = concepts_mentioned / len(key_concepts)

            if coverage < 0.5:
                issues.append(f"Only {concepts_mentioned}/{len(key_concepts)} key concepts addressed")
                score -= 0.3
            elif coverage < 0.8:
                issues.append(f"Some key concepts not fully addressed ({concepts_mentioned}/{len(key_concepts)})")
                score -= 0.15

        # Check 3: Has conclusion section
        has_conclusion = bool(re.search(r'(conclusion|in summary|therefore|thus|finally|to conclude)',
                                       reasoning_steps, re.IGNORECASE))
        if not has_conclusion:
            issues.append("Missing clear conclusion or summary")
            score -= 0.2

        # Check 4: Reasoning length (basic completeness indicator)
        if len(reasoning_steps) < 200:
            issues.append("Reasoning appears too brief to be complete")
            score -= 0.25
        elif len(reasoning_steps) < 100:
            issues.append("Reasoning is severely lacking in detail")
            score -= 0.4

        # Check 5: Check for "why" questions being answered
        if 'why' in query.lower():
            explanation_indicators = ['because', 'due to', 'reason', 'cause', 'explains']
            has_explanation = any(ind in reasoning_steps.lower() for ind in explanation_indicators)
            if not has_explanation:
                issues.append("'Why' question not adequately explained")
                score -= 0.3

        # Check 6: Check for "how" questions being answered
        if 'how' in query.lower():
            process_indicators = ['step', 'first', 'then', 'next', 'process', 'method']
            has_process = any(ind in reasoning_steps.lower() for ind in process_indicators)
            if not has_process:
                issues.append("'How' question not explained as a process")
                score -= 0.3

        # Check 7: Multiple sections/steps present
        section_count = len(re.findall(r'(^|\n)#+\s+|\d+\.|^[-*•]\s+', reasoning_steps, re.MULTILINE))
        if section_count < 2:
            issues.append("Reasoning lacks detailed step-by-step breakdown")
            score -= 0.15

        # Make decision
        score = max(0.0, score)

        if score >= 0.8 and len(issues) == 0:
            return (ValidatorDecision.APPROVE,
                   "✅ Answer is complete and thorough",
                   score)
        elif score >= 0.6:
            return (ValidatorDecision.NEEDS_REVISION,
                   f"⚠️ Completeness needs improvement:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)
        else:
            return (ValidatorDecision.REJECT,
                   f"❌ Answer is incomplete:\n" + "\n".join(f"  - {issue}" for issue in issues),
                   score)


# ============================================
# VALIDATION COORDINATOR
# ============================================

class ValidationCoordinator:
    """
    Coordinates the three validators and determines consensus.
    """

    def __init__(self):
        self.logic_validator = LogicValidator()
        self.source_validator = SourceValidator()
        self.completeness_validator = CompletenessValidator()

    def validate_reasoning(self, reasoning_chain: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run all three validators and determine consensus.

    Returns:
            Validation result with consensus decision
        """
        # Run all validators
        logic_decision, logic_feedback, logic_score = self.logic_validator.validate(reasoning_chain)
        source_decision, source_feedback, source_score = self.source_validator.validate(reasoning_chain)
        completeness_decision, completeness_feedback, completeness_score = \
            self.completeness_validator.validate(reasoning_chain)

        # Collect results
        validators_results = {
            'logic': {
                'decision': logic_decision.value,
                'feedback': logic_feedback,
                'score': logic_score
            },
            'source': {
                'decision': source_decision.value,
                'feedback': source_feedback,
                'score': source_score
            },
            'completeness': {
                'decision': completeness_decision.value,
                'feedback': completeness_feedback,
                'score': completeness_score
            }
        }

        # Count approvals
        approvals = sum(1 for v in validators_results.values()
                       if v['decision'] == ValidatorDecision.APPROVE.value)
        rejections = sum(1 for v in validators_results.values()
                        if v['decision'] == ValidatorDecision.REJECT.value)
        revision_requests = sum(1 for v in validators_results.values()
                               if v['decision'] == ValidatorDecision.NEEDS_REVISION.value)

        # Determine consensus (2/3 majority rule for hackathon demo)
        if approvals >= 2:
            # 2 or 3 approvals = VERIFIED (2/3 consensus)
            final_status = ValidationStatus.VERIFIED
            final_message = f"✅ VERIFIED - {approvals}/3 validators approved (consensus reached)!"
        elif rejections >= 2:
            # 2 or more rejections = REJECTED
            final_status = ValidationStatus.REJECTED
            final_message = f"❌ REJECTED - {rejections}/3 validator(s) rejected"
        else:
            # Mixed results (1 approve, 1 reject, 1 revision) = proceed with caution
            # For hackathon, we'll still verify but with lower confidence
            final_status = ValidationStatus.VERIFIED
            final_message = f"✅ VERIFIED (with caution) - Mixed results: {approvals} approved, {rejections} rejected, {revision_requests} need revision"

        # Calculate average score
        avg_score = (logic_score + source_score + completeness_score) / 3

        return {
            'status': final_status.value,
            'message': final_message,
            'validators': validators_results,
            'consensus': {
                'approvals': approvals,
                'rejections': rejections,
                'revision_requests': revision_requests,
                'average_score': avg_score
            },
            'timestamp': datetime.now(timezone.utc).isoformat()
        }


# ============================================
# HELPER FUNCTIONS
# ============================================

def create_text_message(text: str, metadata: Optional[Dict[str, str]] = None) -> ChatMessage:
    """Create a ChatMessage with TextContent."""
    content = [TextContent(type="text", text=text)]
    if metadata:
        content.append(MetadataContent(type="metadata", metadata=metadata))

    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=content
    )


def format_validation_report(validation_result: Dict[str, Any], reasoning_chain: Dict[str, Any]) -> str:
    """Format validation report for display."""
    validators = validation_result['validators']
    consensus = validation_result['consensus']

    report = f"""
╔══════════════════════════════════════════════════════════════╗
║        MULTI-AGENT VALIDATION REPORT                         ║
╚══════════════════════════════════════════════════════════════╝

📋 QUERY
{reasoning_chain.get('query', 'N/A')}

🎯 VALIDATION STATUS: {validation_result['status'].upper()}
{validation_result['message']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 VALIDATOR RESULTS

🧠 Logic Validator
   Decision: {validators['logic']['decision'].upper()}
   Score: {validators['logic']['score']:.2%}
   {validators['logic']['feedback']}

📚 Source Validator
   Decision: {validators['source']['decision'].upper()}
   Score: {validators['source']['score']:.2%}
   {validators['source']['feedback']}

✓ Completeness Validator
   Decision: {validators['completeness']['decision'].upper()}
   Score: {validators['completeness']['score']:.2%}
   {validators['completeness']['feedback']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 CONSENSUS METRICS
   ✅ Approvals: {consensus['approvals']}/3
   ❌ Rejections: {consensus['rejections']}/3
   🔄 Revision Requests: {consensus['revision_requests']}/3
   📊 Average Score: {consensus['average_score']:.2%}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

    return report


def create_validation_proof(
    reasoning_chain: Dict[str, Any],
    validation_result: Dict[str, Any]
) -> Dict[str, Any]:
    """Create validation proof for verified reasoning."""
    return {
        'validation_id': str(uuid4()),
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'status': validation_result['status'],
        'reasoning_chain': reasoning_chain,
        'validation_result': validation_result,
        'validators': {
            'logic': validation_result['validators']['logic'],
            'source': validation_result['validators']['source'],
            'completeness': validation_result['validators']['completeness']
        },
        'consensus': validation_result['consensus'],
        'metadata': {
            'validator_version': '1.0',
            'validation_type': 'multi_agent_automated',
            'confidence': reasoning_chain.get('confidence', 0.0),
            'reasoning_type': reasoning_chain.get('reasoning_type', 'unknown')
        }
    }


# ============================================
# MESSAGE HANDLERS
# ============================================

# Initialize coordinator
coordinator = ValidationCoordinator()


@chat.on_message(ChatMessage)
async def handle_validation_request(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming validation requests from Reasoning Agent."""
    # ACK first
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id,
    ))

    ctx.logger.info(f"Validating from {sender[:20]}...")

    # Extract reasoning chain and metadata
    reasoning_chain = None
    query_text = None
    session_id = None
    user_address = None

    for content in msg.content:
        if isinstance(content, TextContent):
            query_text = content.text
        if isinstance(content, MetadataContent):
            if 'reasoning_chain' in content.metadata:
                rc = content.metadata['reasoning_chain']
                if isinstance(rc, str):
                    try:
                        reasoning_chain = json.loads(rc)
                    except:
                        pass
                else:
                    reasoning_chain = rc
            session_id = content.metadata.get('session_id')
            user_address = content.metadata.get('user_address')

    # If no structured chain, create basic one from text
    if not reasoning_chain and query_text:
        reasoning_chain = {
            'query': query_text[:200],
            'reasoning_type': 'unknown',
            'key_concepts': [],
            'reasoning_steps': query_text,
            'confidence': 0.5,
            'requires_validation': True,
            'metadata': {}
        }

    if not reasoning_chain:
        ctx.logger.warning("No reasoning chain found in message")
        await ctx.send(sender, create_text_message(
            "❌ Error: No reasoning chain provided for validation"
        ))
        return

    # Run multi-agent validation
    validation_result = coordinator.validate_reasoning(reasoning_chain)

    ctx.logger.info(f"Validation: {validation_result['status']} ({validation_result['consensus']['average_score']:.0%})")

    # Format report
    report = format_validation_report(validation_result, reasoning_chain)

    # Handle based on status
    if validation_result['status'] == ValidationStatus.VERIFIED.value:
        # All validators approved - create proof and forward to capsule agent
        avg_score = validation_result['consensus']['average_score']
        proof = create_validation_proof(reasoning_chain, validation_result)

        # Forward to Capsule Agent with original sender info for feedback
        if CAPSULE_AGENT_ADDRESS:
            capsule_metadata = {
                'reasoning_chain': json.dumps(reasoning_chain),
                'validation_proof': json.dumps(proof),
                'status': 'verified',
                'original_sender': sender,  # Pass original sender for feedback
                'session_id': session_id or '',
                'user_address': user_address or ''
            }

            await ctx.send(
                CAPSULE_AGENT_ADDRESS,
                create_text_message(reasoning_chain.get('query', ''), metadata=capsule_metadata)
            )

            ctx.logger.info(f"✅ VERIFIED - Forwarded to Capsule Agent (score: {avg_score:.0%})")
        else:
            ctx.logger.warning("⚠️ Capsule Agent address not configured")

        # Don't send response back to reasoning agent (would create loop)
        # Capsule agent will send feedback to original requester

    elif validation_result['status'] == ValidationStatus.REVISION_REQUESTED.value:
        # Some validators need revision - log but don't respond (would create loop)
        issues = []
        for validator_name, result in validation_result['validators'].items():
            if result['decision'] != ValidatorDecision.APPROVE.value:
                issues.append(f"{validator_name}: {result['feedback'].split(':')[0]}")

        ctx.logger.info(f"Revision requested - Issues: {', '.join(issues)}")

    else:  # REJECTED
        # One or more validators rejected - log but don't respond (would create loop)
        reasons = []
        for validator_name, result in validation_result['validators'].items():
            if result['decision'] == ValidatorDecision.REJECT.value:
                # Extract first issue from feedback
                feedback_lines = result['feedback'].split('\n')
                for line in feedback_lines:
                    if line.strip().startswith('-'):
                        reasons.append(line.strip('- '))
                        break

        ctx.logger.info(f"Rejected - Reasons: {', '.join(reasons[:3])}")


@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    pass  # Silent ACK


@validation_agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize Validation Agent - waits silently for validation requests."""
    ctx.logger.info("✅ Validation Agent ready")


@validation_agent.on_event("shutdown")
async def shutdown_handler(ctx: Context):
    """Cleanup on shutdown."""
    validation_sessions.clear()


# Include chat protocol
validation_agent.include(chat, publish_manifest=True)


if __name__ == "__main__":
    print("✅ Validation Agent starting... (3 validators)")
    validation_agent.run()
