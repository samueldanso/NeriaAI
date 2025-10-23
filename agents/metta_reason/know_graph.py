"""
MeTTa Knowledge Graph for Reasoning Agent
Built with proper MeTTa language constructs for symbolic reasoning
Provides structured knowledge for transparent, auditable reasoning chains

Features:
- Reasoning patterns (deductive, inductive, abductive, causal, comparative)
- Domain knowledge (AI/ML, neural networks, transformers, etc.)
- Causal relationships and logical implications
- Validation criteria and reasoning templates
- Dynamic knowledge addition and querying

Based on Hyperon MeTTa: https://github.com/trueagi-io/hyperon-experimental
"""

try:
    from hyperon import MeTTa, E, S, V, ValueAtom
    HYPERON_AVAILABLE = True
except ImportError as e:
    HYPERON_AVAILABLE = False
    MeTTa = None
    E = S = V = ValueAtom = None
    
    import sys
    print(f"\n❌ ERROR: Hyperon/MeTTa not installed!", file=sys.stderr)
    print(f"   This module requires real MeTTa to function.", file=sys.stderr)
    print(f"   Install: pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python", file=sys.stderr)
    print(f"   Or on Ubuntu: Follow build instructions from the repository\n", file=sys.stderr)


def initialize_reasoning_knowledge(metta: MeTTa):
    """
    Initialize the MeTTa knowledge graph with reasoning patterns and domain knowledge.
    
    **REQUIRES REAL HYPERON/MeTTa** - No mock fallback.
    
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
    
    Raises:
        RuntimeError: If MeTTa is not properly initialized
    """
    
    if not HYPERON_AVAILABLE or metta is None:
        raise RuntimeError(
            "Cannot initialize knowledge graph: Hyperon/MeTTa not available. "
            "Install with: pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python"
        )
    
    # ===== REASONING PATTERNS =====
    
    # Deductive reasoning - from general to specific
    metta.run('(reasoning_pattern deductive "Logical deduction from premises to conclusion")')
    metta.run('(reasoning_pattern modus_ponens "If P implies Q and P is true then Q is true")')
    metta.run('(reasoning_pattern modus_tollens "If P implies Q and Q is false then P is false")')
    metta.run('(reasoning_pattern syllogism "If A implies B and B implies C then A implies C")')
    metta.run('(reasoning_pattern disjunctive_syllogism "If P or Q is true and P is false then Q is true")')
    
    # Inductive reasoning - from specific to general
    metta.run('(reasoning_pattern inductive "Observe instances to form general principle")')
    metta.run('(reasoning_pattern pattern_recognition "Identify patterns from examples")')
    metta.run('(reasoning_pattern generalization "Extend specific observations to broader principle")')
    metta.run('(reasoning_pattern statistical_inference "Draw conclusions from data patterns")')
    
    # Abductive reasoning - best explanation
    metta.run('(reasoning_pattern abductive "Infer most likely explanation from observation")')
    metta.run('(reasoning_pattern hypothesis_formation "Form hypothesis explaining evidence")')
    metta.run('(reasoning_pattern inference_to_best_explanation "Select most plausible explanation")')
    
    # Analogical reasoning
    metta.run('(reasoning_pattern analogical "Transfer knowledge from similar domain")')
    metta.run('(reasoning_pattern structural_mapping "Map relationships between domains")')
    
    # Causal reasoning
    metta.run('(reasoning_pattern causal "Identify cause-effect relationships")')
    metta.run('(reasoning_pattern counterfactual "Reason about alternative scenarios")')
    
    # Comparative reasoning
    metta.run('(reasoning_pattern comparative "Analyze differences and similarities")')
    metta.run('(reasoning_pattern contrastive "Highlight contrasting features")')
    
    # ===== REASONING STRATEGIES =====
    
    metta.run('(strategy forward_chaining "Start with facts and derive new facts")')
    metta.run('(strategy backward_chaining "Start with goal and find supporting facts")')
    metta.run('(strategy case_based "Use similar past cases for new situations")')
    metta.run('(strategy divide_and_conquer "Break complex problem into subproblems")')
    metta.run('(strategy proof_by_contradiction "Assume negation and derive contradiction")')
    metta.run('(strategy proof_by_induction "Prove base case and inductive step")')
    metta.run('(strategy hypothesis_testing "Form and test hypotheses systematically")')
    metta.run('(strategy elimination "Systematically eliminate invalid options")')
    metta.run('(strategy constraint_propagation "Apply constraints to narrow possibilities")')
    
    # ===== VALIDATION CRITERIA =====
    
    metta.run('(validation_criterion logical_consistency "No contradictions in reasoning")')
    metta.run('(validation_criterion evidence_support "All claims supported by evidence")')
    metta.run('(validation_criterion transparency "Each step clearly explained")')
    metta.run('(validation_criterion completeness "All necessary steps included")')
    metta.run('(validation_criterion reproducibility "Results can be independently verified")')
    metta.run('(validation_criterion soundness "Reasoning follows valid logical rules")')
    metta.run('(validation_criterion relevance "All steps contribute to conclusion")')
    metta.run('(validation_criterion parsimony "Uses simplest adequate explanation")')
    
    # ===== DOMAIN KNOWLEDGE (AI/ML) =====
    
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
    metta.run('(capability Transformer self_attention)')
    metta.run('(capability Transformer positional_encoding)')
    
    # Modern architectures
    metta.run('(specificInstance neural_networks BERT)')
    metta.run('(specificInstance neural_networks GPT)')
    metta.run('(specificInstance neural_networks ViT)')
    metta.run('(specificInstance neural_networks CLIP)')
    
    # BERT capabilities
    metta.run('(capability BERT bidirectional_context)')
    metta.run('(capability BERT masked_language_modeling)')
    metta.run('(capability BERT contextual_embeddings)')
    
    # GPT capabilities
    metta.run('(capability GPT autoregressive_generation)')
    metta.run('(capability GPT zero_shot_learning)')
    metta.run('(capability GPT in_context_learning)')
    
    # Vision Transformer capabilities
    metta.run('(capability ViT patch_embedding)')
    metta.run('(capability ViT spatial_attention)')
    
    # Gradient Descent
    metta.run('(domain_rule gradient_descent "Optimization follows negative gradient")')
    metta.run('(capability gradient_descent loss_minimization)')
    metta.run('(capability gradient_descent parameter_optimization)')
    metta.run('(capability gradient_descent convergence)')
    
    # Attention Mechanism
    metta.run('(domain_rule attention_mechanism "Focus on relevant input parts dynamically")')
    metta.run('(capability attention_mechanism dynamic_weighting)')
    metta.run('(capability attention_mechanism context_awareness)')
    metta.run('(capability attention_mechanism query_key_value)')
    
    # Backpropagation
    metta.run('(domain_rule backpropagation "Compute gradients via chain rule backwards")')
    metta.run('(capability backpropagation gradient_computation)')
    metta.run('(capability backpropagation weight_updates)')
    metta.run('(capability backpropagation error_propagation)')
    
    # Reinforcement Learning
    metta.run('(domain_rule reinforcement_learning "Learn through reward and penalty signals")')
    metta.run('(capability reinforcement_learning policy_optimization)')
    metta.run('(capability reinforcement_learning value_estimation)')
    metta.run('(capability reinforcement_learning exploration_exploitation)')
    
    # Transfer Learning
    metta.run('(domain_rule transfer_learning "Transfer knowledge from source to target task")')
    metta.run('(capability transfer_learning domain_adaptation)')
    metta.run('(capability transfer_learning fine_tuning)')
    metta.run('(capability transfer_learning feature_reuse)')
    
    # ===== CAUSAL RELATIONSHIPS =====
    
    # Dataset and generalization
    metta.run('(causes large_dataset better_generalization)')
    metta.run('(causes diverse_data robust_models)')
    metta.run('(causes more_data better_performance)')
    metta.run('(causes insufficient_data overfitting)')
    
    # Architecture and learning
    metta.run('(causes more_layers hierarchical_features)')
    metta.run('(causes deep_architecture complex_patterns)')
    metta.run('(causes wider_layers more_capacity)')
    metta.run('(causes attention long_range_dependencies)')
    metta.run('(causes residual_connections gradient_flow)')
    
    # Regularization techniques
    metta.run('(causes regularization reduced_overfitting)')
    metta.run('(causes dropout reduced_overfitting)')
    metta.run('(causes weight_decay simpler_models)')
    metta.run('(causes data_augmentation better_generalization)')
    
    # Optimization and training
    metta.run('(causes batch_normalization stable_training)')
    metta.run('(causes learning_rate_scheduling better_convergence)')
    metta.run('(causes momentum faster_convergence)')
    metta.run('(causes adaptive_learning_rates efficient_training)')
    
    # Modern techniques
    metta.run('(causes transfer_learning faster_training)')
    metta.run('(causes pretrained_models better_performance)')
    metta.run('(causes self_attention contextual_understanding)')
    metta.run('(causes bidirectional_encoding richer_representations)')
    
    # ===== LOGICAL IMPLICATIONS =====
    
    # Network architecture implications
    metta.run('(implies deep_network many_parameters)')
    metta.run('(implies many_parameters needs_large_data)')
    metta.run('(implies more_layers more_capacity)')
    metta.run('(implies more_capacity risk_of_overfitting)')
    
    # Training implications
    metta.run('(implies overfitting poor_generalization)')
    metta.run('(implies high_learning_rate unstable_training)')
    metta.run('(implies small_learning_rate slow_convergence)')
    metta.run('(implies insufficient_training underfitting)')
    metta.run('(implies vanishing_gradients training_difficulty)')
    
    # Mechanism implications
    metta.run('(implies attention_mechanism better_context)')
    metta.run('(implies self_attention global_dependencies)')
    metta.run('(implies recurrence sequential_processing)')
    metta.run('(implies convolution local_patterns)')
    
    # Data implications
    metta.run('(implies limited_data need_regularization)')
    metta.run('(implies noisy_data need_robustness)')
    metta.run('(implies imbalanced_data biased_predictions)')
    
    # Performance implications
    metta.run('(implies high_accuracy on_training may_indicate_overfitting)')
    metta.run('(implies poor_validation_performance need_adjustment)')
    metta.run('(implies long_training_time need_optimization)')
    
    # ===== REASONING TEMPLATES =====
    
    metta.run('(template why_explanation "1_State_phenomenon 2_Identify_mechanism 3_Show_causal_chain 4_Provide_evidence")')
    metta.run('(template how_explanation "1_Break_into_steps 2_Describe_each_step 3_Show_connections 4_Summarize_process")')
    metta.run('(template comparison "1_Identify_dimensions 2_Compare_on_each 3_Note_tradeoffs 4_Conclude")')
    metta.run('(template problem_solving "1_Understand_problem 2_Identify_constraints 3_Generate_solutions 4_Evaluate_options 5_Select_best")')
    metta.run('(template causal_explanation "1_Identify_cause 2_Trace_mechanism 3_Show_effects 4_Provide_supporting_evidence")')
    metta.run('(template hypothesis_evaluation "1_State_hypothesis 2_Identify_predictions 3_Test_against_evidence 4_Accept_or_reject")')
    metta.run('(template analogical_reasoning "1_Identify_source_domain 2_Map_relationships 3_Transfer_to_target 4_Verify_validity")')
    
    # ===== CONSIDERATIONS/LIMITATIONS =====
    
    metta.run('(consideration neural_networks "Require large amounts of training data")')
    metta.run('(consideration neural_networks "Computationally expensive to train")')
    metta.run('(consideration neural_networks "Black box nature limits interpretability")')
    metta.run('(consideration gradient_descent "Can get stuck in local minima")')
    metta.run('(consideration attention_mechanism "Quadratic complexity with sequence length")')
    metta.run('(consideration deep_learning "Requires significant computational resources")')
    
    # ===== FAQ KNOWLEDGE =====
    
    # Fundamental concepts
    metta.run('(faq "What is backpropagation?" "Algorithm for computing gradients via chain rule")')
    metta.run('(faq "Why use activation functions?" "To introduce non-linearity for complex patterns")')
    metta.run('(faq "What is gradient descent?" "Optimization algorithm that follows negative gradient")')
    metta.run('(faq "What is a neural network?" "Computational model inspired by biological neurons")')
    
    # Training and optimization
    metta.run('(faq "What causes overfitting?" "Model learns training data including noise")')
    metta.run('(faq "How to prevent overfitting?" "Use regularization, dropout, and more training data")')
    metta.run('(faq "What is learning rate?" "Step size for gradient descent updates")')
    metta.run('(faq "Why use batch normalization?" "Stabilize training and allow higher learning rates")')
    
    # Architecture-specific
    metta.run('(faq "Why do transformers use attention?" "To model dependencies regardless of distance")')
    metta.run('(faq "What is self-attention?" "Mechanism where sequence attends to itself")')
    metta.run('(faq "How do CNNs work?" "Extract features through convolution and pooling")')
    metta.run('(faq "What are residual connections?" "Skip connections that help gradient flow")')
    
    # Modern ML
    metta.run('(faq "What is transfer learning?" "Reusing knowledge from pretrained models")')
    metta.run('(faq "What is fine-tuning?" "Adapting pretrained model to new task")')
    metta.run('(faq "What is zero-shot learning?" "Performing tasks without specific training examples")')
    metta.run('(faq "What is few-shot learning?" "Learning from very few examples")')
    
    # Practical considerations
    metta.run('(faq "How much data do I need?" "Depends on model complexity and task difficulty")')
    metta.run('(faq "What is data augmentation?" "Creating variations of training data")')
    metta.run('(faq "How to choose architecture?" "Consider task type, data size, and computational resources")')
    
    # ===== REASONING EXAMPLES =====
    # Example reasoning chains
    metta.run('(reasoning_example "Why hierarchical?" "CNNs use multiple layers to build complex features from simple ones")')
    metta.run('(reasoning_example "Why attention?" "Transformers use attention to focus on relevant information")')
    
    # ===== VERIFICATION (Silent) =====
    # Silent verification - just ensure data is loaded
    metta.run('!(match &self (reasoning_pattern deductive $desc) $desc)')
    metta.run('!(match &self (domain_rule neural_networks $rule) $rule)')
    metta.run('!(match &self (capability neural_networks $cap) $cap)')
    metta.run('!(match &self (causes large_dataset $effect) $effect)')
    metta.run('!(match &self (validation_criterion logical_consistency $desc) $desc)')


def add_verified_reasoning(metta: MeTTa, query: str, reasoning_type: str, confidence: float):
    """
    Add a verified reasoning chain to the knowledge graph.
    
    **REQUIRES REAL HYPERON/MeTTa** - No mock fallback.
    
    Args:
        metta: MeTTa instance
        query: Original query (escaped for MeTTa)
        reasoning_type: Type of reasoning used
        confidence: Confidence score (0.0-1.0)
        
    Raises:
        RuntimeError: If MeTTa is not available
    """
    if not HYPERON_AVAILABLE or metta is None:
        raise RuntimeError("MeTTa not available - cannot add verified reasoning")
    
    # Escape query for MeTTa (replace quotes)
    safe_query = query.replace('"', '\\"').replace('\n', ' ')
    
    # Add verified reasoning atom
    reasoning_str = f'(verified_reasoning "{safe_query}" {reasoning_type} {confidence})'
    metta.run(reasoning_str)


def query_knowledge(metta: MeTTa, relation: str, subject: str):
    """
    Query the knowledge graph for a specific relation and subject.
    
    **REQUIRES REAL HYPERON/MeTTa** - No mock fallback.
    
    Args:
        metta: MeTTa instance
        relation: Relation type (e.g., "capability", "domain_rule")
        subject: Subject to query (e.g., "neural_networks")
        
    Returns:
        List of query results
        
    Raises:
        RuntimeError: If MeTTa is not available
    """
    if not HYPERON_AVAILABLE or metta is None:
        raise RuntimeError("MeTTa not available - cannot query knowledge")
    
    query_str = f'!(match &self ({relation} {subject} $object) $object)'
    results = metta.run(query_str)
    return results


def add_dynamic_knowledge(metta: MeTTa, relation: str, subject: str, object_value: str):
    """
    Dynamically add new knowledge to the graph at runtime.
    
    **REQUIRES REAL HYPERON/MeTTa** - No mock fallback.
    
    Args:
        metta: MeTTa instance
        relation: Relation type
        subject: Subject
        object_value: Object/value
        
    Raises:
        RuntimeError: If MeTTa is not available
    """
    if not HYPERON_AVAILABLE or metta is None:
        raise RuntimeError("MeTTa not available - cannot add dynamic knowledge")
    
    # Escape string values
    if ' ' in object_value or '"' in object_value:
        safe_value = f'"{object_value}"'
    else:
        safe_value = object_value
    
    atom_str = f'({relation} {subject} {safe_value})'
    metta.run(atom_str)


# Example usage and testing
if __name__ == "__main__":
    """Test the knowledge graph initialization and queries."""
    
    if not HYPERON_AVAILABLE:
        print("\n❌ Cannot run tests: Hyperon/MeTTa not installed!")
        print("Install with: pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python")
        exit(1)
    
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
