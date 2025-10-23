"""
Test script for Multi-Agent Validation System
Tests the three validators with various reasoning chains
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from validation_agent import (
    LogicValidator,
    SourceValidator,
    CompletenessValidator,
    ValidationCoordinator,
    ValidatorDecision
)


def test_validator(validator_name, validator, test_cases):
    """Test a single validator with multiple test cases."""
    print(f"\n{'='*60}")
    print(f"Testing {validator_name}")
    print(f"{'='*60}")
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {test_case['name']}")
        print(f"Expected: {test_case['expected']}")
        
        decision, feedback, score = validator.validate(test_case['reasoning_chain'])
        
        print(f"Result: {decision.value} (score: {score:.2%})")
        print(f"Feedback: {feedback[:100]}...")
        
        # Check if result matches expectation
        matches = decision.value == test_case['expected']
        status = "✅ PASS" if matches else "❌ FAIL"
        print(f"Status: {status}")


def test_logic_validator():
    """Test Logic Validator."""
    validator = LogicValidator()
    
    test_cases = [
        {
            'name': 'Well-structured deductive reasoning',
            'expected': ValidatorDecision.APPROVE.value,
            'reasoning_chain': {
                'query': 'Why do neural networks work?',
                'reasoning_type': 'deductive',
                'reasoning_steps': '''
**Step 1: Universal Function Approximation**
Neural networks can approximate any continuous function, therefore they can learn complex patterns.

**Step 2: Hierarchical Learning**
Multiple layers allow hierarchical feature extraction. First, simple features are learned, then complex ones.

**Step 3: Backpropagation**
Gradients flow backward through the network, thus weights are optimized to minimize error.

**Conclusion:**
Since neural networks combine universal approximation, hierarchical learning, and gradient-based optimization, they can effectively learn from data.
'''
            }
        },
        {
            'name': 'Logical contradiction',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'Is the model accurate?',
                'reasoning_type': 'deductive',
                'reasoning_steps': '''
The model is highly accurate on training data. However, it cannot generalize to new data.
But the model is also very accurate on test data. This means it's accurate.
'''
            }
        },
        {
            'name': 'Missing logical structure',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'Why use attention?',
                'reasoning_type': 'deductive',
                'reasoning_steps': 'Attention is good. Models use it. It works well.'
            }
        }
    ]
    
    test_validator("Logic Validator", validator, test_cases)


def test_source_validator():
    """Test Source Validator."""
    validator = SourceValidator()
    
    test_cases = [
        {
            'name': 'Well-sourced reasoning with MeTTa knowledge',
            'expected': ValidatorDecision.APPROVE.value,
            'reasoning_chain': {
                'query': 'Why do transformers outperform RNNs?',
                'reasoning_steps': '''
According to research on attention mechanisms, transformers can model long-range dependencies more effectively than RNNs.

Based on the MeTTa knowledge graph:
- Attention enables parallel processing
- RNNs have sequential bottleneck
- Evidence from BERT and GPT papers demonstrates superior performance

The research shows that transformers achieve better results on benchmarks.
''',
                'metadata': {'has_research_context': True},
                'metta_knowledge_used': {
                    'patterns': ['comparative'],
                    'domain_rules': ['transformers enable parallel processing']
                },
                'confidence': 0.85
            }
        },
        {
            'name': 'Unsupported claims',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'Are neural networks best?',
                'reasoning_steps': '''
I claim that neural networks are the best machine learning method.
They are superior to all other approaches.
Everyone should use neural networks exclusively.
''',
                'metadata': {},
                'metta_knowledge_used': {},
                'confidence': 0.9
            }
        },
        {
            'name': 'High confidence without support',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'What is the best architecture?',
                'reasoning_steps': 'The best architecture is definitely X. It will always work.',
                'metadata': {},
                'metta_knowledge_used': {},
                'confidence': 0.95
            }
        }
    ]
    
    test_validator("Source Validator", validator, test_cases)


def test_completeness_validator():
    """Test Completeness Validator."""
    validator = CompletenessValidator()
    
    test_cases = [
        {
            'name': 'Complete answer with all elements',
            'expected': ValidatorDecision.APPROVE.value,
            'reasoning_chain': {
                'query': 'Why do neural networks learn hierarchical representations?',
                'key_concepts': ['neural networks', 'hierarchical', 'representations', 'learning'],
                'reasoning_steps': '''
## Background
Neural networks are computational models inspired by biological neurons. They learn hierarchical representations through layered architecture.

## Key Mechanisms

### 1. Multiple Layers
Each layer builds upon previous layer features, creating a hierarchy from simple to complex patterns.

### 2. Feature Composition
Lower layers detect edges and textures. Middle layers combine these into parts. Higher layers recognize complete objects.

### 3. Backpropagation
The learning algorithm adjusts each layer to optimize the entire hierarchy.

## Conclusion
Neural networks learn hierarchical representations because multiple layers naturally compose features from simple to complex, with each layer building on the previous one. This hierarchical organization enables effective learning of complex patterns.
'''
            }
        },
        {
            'name': 'Missing key concepts',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'Explain CNNs, RNNs, and Transformers',
                'key_concepts': ['CNNs', 'RNNs', 'Transformers', 'architecture'],
                'reasoning_steps': '''
CNNs are good for images. They use convolution.
Some neural networks work sequentially.
'''
            }
        },
        {
            'name': 'Missing conclusion',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'Why use dropout?',
                'key_concepts': ['dropout', 'regularization'],
                'reasoning_steps': '''
Dropout randomly disables neurons during training.
This prevents overfitting.
Neural networks benefit from regularization.
'''
            }
        },
        {
            'name': 'Too brief',
            'expected': ValidatorDecision.NEEDS_REVISION.value,
            'reasoning_chain': {
                'query': 'How does backpropagation work?',
                'key_concepts': ['backpropagation', 'gradients'],
                'reasoning_steps': 'Backpropagation computes gradients using chain rule.'
            }
        }
    ]
    
    test_validator("Completeness Validator", validator, test_cases)


def test_coordinator():
    """Test the ValidationCoordinator with full reasoning chains."""
    print(f"\n{'='*60}")
    print("Testing ValidationCoordinator (All 3 Validators)")
    print(f"{'='*60}")
    
    coordinator = ValidationCoordinator()
    
    test_cases = [
        {
            'name': 'High-quality reasoning (should VERIFY)',
            'reasoning_chain': {
                'query': 'Why do transformers use attention mechanisms?',
                'reasoning_type': 'causal',
                'key_concepts': ['transformers', 'attention', 'mechanisms'],
                'reasoning_steps': '''
## Understanding Transformers and Attention

### Step 1: The Limitation of Sequential Models
RNNs process sequences step-by-step, therefore they struggle with long-range dependencies because information must pass through many steps.

### Step 2: Attention as a Solution
Attention mechanisms allow models to directly connect any two positions in a sequence, thus eliminating the sequential bottleneck.

### Step 3: Parallel Processing Benefits
Since attention doesn't require sequential processing, transformers can process entire sequences in parallel, leading to faster training.

### Step 4: Modeling Long-Range Dependencies
Research shows that attention enables transformers to capture relationships between distant words more effectively than RNNs. This is demonstrated by BERT and GPT models.

### Conclusion
Transformers use attention mechanisms because they enable parallel processing, overcome the sequential bottleneck of RNNs, and effectively model long-range dependencies in sequences. This combination of benefits has made transformers the dominant architecture in NLP.
''',
                'confidence': 0.85,
                'metadata': {'has_research_context': True},
                'metta_knowledge_used': {
                    'patterns': ['causal'],
                    'domain_rules': ['attention enables parallel processing']
                }
            }
        },
        {
            'name': 'Needs revision (logic issues)',
            'reasoning_chain': {
                'query': 'Is deep learning always better?',
                'reasoning_type': 'comparative',
                'key_concepts': ['deep learning', 'comparison'],
                'reasoning_steps': '''
Deep learning is always the best approach. Traditional methods are obsolete.
Deep learning works for everything. No exceptions exist.
''',
                'confidence': 0.6,
                'metadata': {},
                'metta_knowledge_used': {}
            }
        },
        {
            'name': 'Should be rejected (multiple issues)',
            'reasoning_chain': {
                'query': 'How do neural networks work?',
                'reasoning_type': 'deductive',
                'key_concepts': ['neural networks'],
                'reasoning_steps': 'Networks are good.',
                'confidence': 0.3,
                'metadata': {},
                'metta_knowledge_used': {}
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'─'*60}")
        print(f"Test Case {i}: {test_case['name']}")
        print(f"{'─'*60}")
        
        result = coordinator.validate_reasoning(test_case['reasoning_chain'])
        
        print(f"\n📊 VALIDATION RESULT")
        print(f"Status: {result['status']}")
        print(f"Message: {result['message']}")
        print(f"\n📈 Consensus:")
        print(f"  ✅ Approvals: {result['consensus']['approvals']}/3")
        print(f"  ❌ Rejections: {result['consensus']['rejections']}/3")
        print(f"  🔄 Revision Requests: {result['consensus']['revision_requests']}/3")
        print(f"  📊 Average Score: {result['consensus']['average_score']:.2%}")
        
        print(f"\n🤖 Individual Validators:")
        for validator_name, validator_result in result['validators'].items():
            print(f"  {validator_name}: {validator_result['decision']} ({validator_result['score']:.2%})")


def main():
    """Run all tests."""
    print("="*60)
    print("🧪 MULTI-AGENT VALIDATION SYSTEM TEST SUITE")
    print("="*60)
    
    try:
        # Test individual validators
        test_logic_validator()
        test_source_validator()
        test_completeness_validator()
        
        # Test coordinator
        test_coordinator()
        
        print(f"\n{'='*60}")
        print("✅ All tests completed!")
        print(f"{'='*60}")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

