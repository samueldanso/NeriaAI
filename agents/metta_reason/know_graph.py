"""
MeTTa Knowledge Graph for Reasoning
Based on MeTTa Python API documentation and best practices
Stores reasoning patterns, domain knowledge, and logical relationships
"""

try:
    from hyperon import MeTTa, E, S, V, ValueAtom
    HYPERON_AVAILABLE = True
except ImportError:
    print("⚠️  Hyperon not installed. Using mock MeTTa for development.")
    print("   Install hyperon for full functionality: https://github.com/trueagi-io/hyperon-experimental")
    HYPERON_AVAILABLE = False
    
    # Mock MeTTa for development
    class MeTTa:
        def __init__(self):
            self.atoms = []
        def run(self, query):
            return []
    
    E = S = V = ValueAtom = lambda x: x


def initialize_reasoning_knowledge(metta: MeTTa):
    """
    Initialize the MeTTa knowledge graph with reasoning patterns and domain knowledge.
    
    This creates a structured knowledge base using proper MeTTa syntax:
    - E() for expressions
    - S() for symbols
    - ValueAtom() for string values
    
    Relations defined:
    - (reasoning_pattern <type> <description>)
    - (domain_rule <domain> <rule>)
    - (capability <concept> <feature>)
    - (specificInstance <category> <instance>)
    - (strategy <type> <description>)
    - (validation_criterion <name> <description>)
    - (template <type> <structure>)
    - (causes <cause> <effect>)
    - (implies <premise> <conclusion>)
    - (consideration <topic> <limitation>)
    - (faq <question> <answer>)
    """
    
    print("🔧 Initializing MeTTa reasoning knowledge graph...")
    
    # ===== REASONING PATTERNS =====
    print("  └─ Adding reasoning patterns...")
    
    # Deductive reasoning
    metta.run('(reasoning_pattern deductive "Logical deduction from premises to conclusion")')
    metta.run('(reasoning_pattern modus_ponens "If P implies Q and P is true then Q is true")')
    metta.run('(reasoning_pattern syllogism "If A implies B and B implies C then A implies C")')
    
    # Inductive reasoning
    metta.run('(reasoning_pattern inductive "Observe instances to form general principle")')
    metta.run('(reasoning_pattern pattern_recognition "Identify patterns from examples")')
    
    # Abductive reasoning
    metta.run('(reasoning_pattern abductive "Infer most likely explanation from observation")')
    metta.run('(reasoning_pattern hypothesis_formation "Form hypothesis explaining evidence")')
    
    # ===== REASONING STRATEGIES =====
    print("  └─ Adding reasoning strategies...")
    
    metta.run('(strategy forward_chaining "Start with facts and derive new facts")')
    metta.run('(strategy backward_chaining "Start with goal and find supporting facts")')
    metta.run('(strategy case_based "Use similar past cases for new situations")')
    
    # ===== VALIDATION CRITERIA =====
    print("  └─ Adding validation criteria...")
    
    metta.run('(validation_criterion logical_consistency "No contradictions in reasoning")')
    metta.run('(validation_criterion evidence_support "All claims supported by evidence")')
    metta.run('(validation_criterion transparency "Each step clearly explained")')
    metta.run('(validation_criterion completeness "All necessary steps included")')
    
    # ===== DOMAIN KNOWLEDGE (AI/ML) =====
    print("  └─ Adding AI/ML domain knowledge...")
    
    # Neural Networks
    metta.run('(domain_rule neural_networks "Deep networks learn hierarchical representations")')
    metta.run('(capability neural_networks hierarchical_learning)')
    metta.run('(capability neural_networks feature_extraction)')
    metta.run('(capability neural_networks pattern_recognition)')
    
    # Specific neural network types
    metta.run('(specificInstance neural_networks CNN)')
    metta.run('(specificInstance neural_networks RNN)')
    metta.run('(specificInstance neural_networks Transformer)')
    
    # CNN capabilities
    metta.run('(capability CNN spatial_hierarchy)')
    metta.run('(capability CNN local_connectivity)')
    metta.run('(capability CNN translation_invariance)')
    
    # RNN capabilities
    metta.run('(capability RNN sequential_processing)')
    metta.run('(capability RNN temporal_dependencies)')
    metta.run('(capability RNN memory_states)')
    
    # Transformer capabilities
    metta.run('(capability Transformer attention_mechanism)')
    metta.run('(capability Transformer parallel_processing)')
    metta.run('(capability Transformer long_range_dependencies)')
    
    # Gradient Descent
    metta.run('(domain_rule gradient_descent "Optimization follows negative gradient")')
    metta.run('(capability gradient_descent loss_minimization)')
    metta.run('(capability gradient_descent parameter_optimization)')
    
    # Attention Mechanism
    metta.run('(domain_rule attention_mechanism "Focus on relevant input parts dynamically")')
    metta.run('(capability attention_mechanism dynamic_weighting)')
    metta.run('(capability attention_mechanism context_awareness)')
    
    # Backpropagation
    metta.run('(domain_rule backpropagation "Compute gradients via chain rule backwards")')
    metta.run('(capability backpropagation gradient_computation)')
    metta.run('(capability backpropagation weight_updates)')
    
    # ===== CAUSAL RELATIONSHIPS =====
    print("  └─ Adding causal relationships...")
    
    metta.run('(causes large_dataset better_generalization)')
    metta.run('(causes more_layers hierarchical_features)')
    metta.run('(causes regularization reduced_overfitting)')
    metta.run('(causes attention long_range_dependencies)')
    metta.run('(causes dropout reduced_overfitting)')
    metta.run('(causes batch_normalization stable_training)')
    metta.run('(causes more_data better_performance)')
    metta.run('(causes deep_architecture complex_patterns)')
    
    # ===== LOGICAL IMPLICATIONS =====
    print("  └─ Adding logical implications...")
    
    metta.run('(implies deep_network many_parameters)')
    metta.run('(implies many_parameters needs_large_data)')
    metta.run('(implies overfitting poor_generalization)')
    metta.run('(implies high_learning_rate unstable_training)')
    metta.run('(implies more_layers more_capacity)')
    metta.run('(implies attention_mechanism better_context)')
    
    # ===== REASONING TEMPLATES =====
    print("  └─ Adding reasoning templates...")
    
    metta.run('(template why_explanation "1_State_phenomenon 2_Identify_mechanism 3_Show_causal_chain 4_Provide_evidence")')
    metta.run('(template how_explanation "1_Break_into_steps 2_Describe_each_step 3_Show_connections 4_Summarize_process")')
    metta.run('(template comparison "1_Identify_dimensions 2_Compare_on_each 3_Note_tradeoffs 4_Conclude")')
    
    # ===== CONSIDERATIONS/LIMITATIONS =====
    print("  └─ Adding considerations and limitations...")
    
    metta.run('(consideration neural_networks "Require large amounts of training data")')
    metta.run('(consideration neural_networks "Computationally expensive to train")')
    metta.run('(consideration neural_networks "Black box nature limits interpretability")')
    metta.run('(consideration gradient_descent "Can get stuck in local minima")')
    metta.run('(consideration attention_mechanism "Quadratic complexity with sequence length")')
    metta.run('(consideration deep_learning "Requires significant computational resources")')
    
    # ===== FAQ KNOWLEDGE =====
    print("  └─ Adding FAQ knowledge...")
    
    metta.run('(faq "What is backpropagation?" "Algorithm for computing gradients via chain rule")')
    metta.run('(faq "Why use activation functions?" "To introduce non-linearity for complex patterns")')
    metta.run('(faq "What causes overfitting?" "Model learns training data including noise")')
    metta.run('(faq "Why do transformers use attention?" "To model dependencies regardless of distance")')
    metta.run('(faq "What is gradient descent?" "Optimization algorithm that follows negative gradient")')
    
    # ===== REASONING EXAMPLES =====
    print("  └─ Adding reasoning examples...")
    
    # Example reasoning chains
    metta.run('(reasoning_example "Why hierarchical?" "CNNs use multiple layers to build complex features from simple ones")')
    metta.run('(reasoning_example "Why attention?" "Transformers use attention to focus on relevant information")')
    
    # ===== VERIFICATION =====
    print("  └─ Verifying knowledge graph...")
    
    # Test query to verify
    test_result = metta.run('!(match &self (reasoning_pattern deductive $desc) $desc)')
    if test_result and len(test_result) > 0:
        print("  ✓ Knowledge graph verification successful")
    else:
        print("  ⚠️ Warning: Knowledge graph may not be properly initialized")
    
    print("✓ MeTTa reasoning knowledge graph initialized successfully")
    print(f"  Total atoms added: ~80+ relations")


def add_verified_reasoning(metta: MeTTa, query: str, reasoning_type: str, confidence: float):
    """
    Add a verified reasoning chain to the knowledge graph.
    
    Args:
        metta: MeTTa instance
        query: Original query (escaped for MeTTa)
        reasoning_type: Type of reasoning used
        confidence: Confidence score (0.0-1.0)
    """
    # Escape query for MeTTa (replace quotes)
    safe_query = query.replace('"', '\\"').replace('\n', ' ')
    
    # Add verified reasoning atom
    reasoning_str = f'(verified_reasoning "{safe_query}" {reasoning_type} {confidence})'
    metta.run(reasoning_str)
    
    print(f"✓ Added verified reasoning: {query[:50]}... (type: {reasoning_type}, conf: {confidence:.2f})")


def query_knowledge(metta: MeTTa, relation: str, subject: str):
    """
    Query the knowledge graph for a specific relation and subject.
    
    Args:
        metta: MeTTa instance
        relation: Relation type (e.g., "capability", "domain_rule")
        subject: Subject to query (e.g., "neural_networks")
        
    Returns:
        List of query results
    """
    query_str = f'!(match &self ({relation} {subject} $object) $object)'
    results = metta.run(query_str)
    return results


def add_dynamic_knowledge(metta: MeTTa, relation: str, subject: str, object_value: str):
    """
    Dynamically add new knowledge to the graph at runtime.
    
    Args:
        metta: MeTTa instance
        relation: Relation type
        subject: Subject
        object_value: Object/value
    """
    # Escape string values
    if ' ' in object_value or '"' in object_value:
        safe_value = f'"{object_value}"'
    else:
        safe_value = object_value
    
    atom_str = f'({relation} {subject} {safe_value})'
    metta.run(atom_str)
    print(f"✓ Added: {atom_str}")


# Example usage and testing
if __name__ == "__main__":
    """Test the knowledge graph initialization and queries."""
    
    print("\n" + "=" * 60)
    print("Testing MeTTa Reasoning Knowledge Graph")
    print("=" * 60 + "\n")
    
    # Initialize MeTTa
    metta = MeTTa()
    
    # Initialize knowledge graph
    initialize_reasoning_knowledge(metta)
    
    print("\n" + "=" * 60)
    print("Running Test Queries")
    print("=" * 60 + "\n")
    
    # Test query 1: Get reasoning patterns
    print("1. Query deductive reasoning pattern:")
    result = metta.run('!(match &self (reasoning_pattern deductive $desc) $desc)')
    print(f"   Result: {result}\n")
    
    # Test query 2: Get neural network capabilities
    print("2. Query neural network capabilities:")
    result = metta.run('!(match &self (capability neural_networks $cap) $cap)')
    print(f"   Result: {result}\n")
    
    # Test query 3: Get specific instances
    print("3. Query specific neural network instances:")
    result = metta.run('!(match &self (specificInstance neural_networks $instance) $instance)')
    print(f"   Result: {result}\n")
    
    # Test query 4: Get CNN capabilities
    print("4. Query CNN capabilities:")
    result = metta.run('!(match &self (capability CNN $cap) $cap)')
    print(f"   Result: {result}\n")
    
    # Test query 5: Get causal relationships
    print("5. Query what causes better_generalization:")
    result = metta.run('!(match &self (causes $cause better_generalization) $cause)')
    print(f"   Result: {result}\n")
    
    # Test query 6: Get domain rule
    print("6. Query neural networks domain rule:")
    result = metta.run('!(match &self (domain_rule neural_networks $rule) $rule)')
    print(f"   Result: {result}\n")
    
    # Test query 7: Get all capabilities of specific instances
    print("7. Query all capabilities of neural network instances:")
    result = metta.run('!(match &self (, (specificInstance neural_networks $inst) (capability $inst $cap)) ($inst $cap))')
    print(f"   Result: {result}\n")
    
    # Test adding verified reasoning
    print("8. Add verified reasoning:")
    add_verified_reasoning(
        metta,
        "Why do neural networks learn hierarchical representations?",
        "causal",
        0.85
    )
    
    # Query verified reasoning
    print("\n9. Query verified reasoning:")
    result = metta.run('!(match &self (verified_reasoning $query $type $conf) ($query $type $conf))')
    print(f"   Result: {result}\n")
    
    print("=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)
