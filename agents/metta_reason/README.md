# 🧠 MeTTa Reasoning Engine for NERIA AI

**Symbolic reasoning engine built with Hyperon MeTTa**

## Overview

The MeTTa Reasoning Engine provides structured, transparent, and auditable reasoning capabilities for the NERIA AI reasoning agent. Built on [Hyperon MeTTa](https://github.com/trueagi-io/hyperon-experimental), it uses symbolic AI and knowledge graphs to generate high-confidence reasoning chains.

### Key Features

✅ **150+ Knowledge Statements** - Comprehensive AI/ML domain knowledge  
✅ **20+ Reasoning Patterns** - Deductive, inductive, abductive, causal, analogical  
✅ **10+ Relation Types** - Domain rules, capabilities, causal chains, implications  
✅ **Dynamic Knowledge Addition** - Store verified reasoning for reuse  
✅ **RAG System** - Query and retrieve relevant knowledge efficiently  
✅ **Validation Criteria** - Built-in checks for logical consistency and transparency  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Reasoning Agent                          │
│  (reasoning_agent.py)                                        │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├──> Query Classification (utils.py)
              ├──> Concept Extraction (utils.py)
              │
              ├──> MeTTa Knowledge Graph (know_graph.py)
              │    • 20+ reasoning patterns
              │    • 150+ domain facts
              │    • Causal relationships
              │    • Logical implications
              │
              ├──> RAG System (reasonrag.py)
              │    • Query reasoning patterns
              │    • Retrieve domain knowledge
              │    • Search knowledge graph
              │
              └──> Reasoning Chain Generation (utils.py)
                   • Combines MeTTa knowledge + LLM
                   • Transparent step-by-step logic
                   • Confidence scoring
```

---

## Installation

### Prerequisites

- Python 3.8+
- Git
- C++ compiler (for building Hyperon from source)
- **For Windows**: WSL (Windows Subsystem for Linux) recommended

### ⚠️ **Important Note for Windows Users From Team Experience**

Hyperon/MeTTa has **limited Windows support** due to native dependencies. The **recommended approach** for Windows users is to use **Ubuntu via WSL (Windows Subsystem for Linux)**.

---

### Option 1: Windows via WSL (Recommended) ✅

This is the **proven working method** for Windows users:

#### **Step 1: Install WSL and Ubuntu**

```powershell
# In PowerShell (as Administrator)
wsl --install
# Or install Ubuntu specifically:
wsl --install -d Ubuntu
```

After installation, restart your computer if prompted.

#### **Step 2: Open Ubuntu Terminal**

Search for "Ubuntu" in Windows Start menu and open it. This gives you a Linux environment on Windows.

#### **Step 3: Update Ubuntu System**

```bash
# In Ubuntu terminal
sudo apt update
sudo apt upgrade -y
```

#### **Step 4: Install Build Dependencies**

```bash
# Install Python and build tools
sudo apt install -y python3 python3-pip python3-venv git build-essential cmake

# Install Rust (required for Hyperon)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### **Step 5: Clone and Build Hyperon**

```bash
# Clone the repository
cd ~
git clone https://github.com/trueagi-io/hyperon-experimental.git
cd hyperon-experimental

# Build the Python bindings
cd python
pip install -e .
```

#### **Step 6: Verify Installation**

```bash
python3 -c "from hyperon import MeTTa; print('✅ MeTTa installed successfully!')"
```

#### **Step 7: Access Your Windows Files**

Your Windows files are accessible in WSL at `/mnt/c/`:

```bash
# Navigate to your project
cd /mnt/c/Users/YourUsername/NERIA/NeriaAI/agents

# Run the reasoning agent
python3 reasoning_agent.py
```

**✅ Success!** Your reasoning agent will now use MeTTa on Ubuntu while running on Windows!

---

### Option 2: Ubuntu/Linux Native

For native Ubuntu/Linux systems:

```bash
# Install dependencies
sudo apt install -y python3 python3-pip git build-essential cmake

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Clone and build Hyperon
git clone https://github.com/trueagi-io/hyperon-experimental.git
cd hyperon-experimental/python
pip install -e .
```

---

### Option 3: Direct pip Install (Experimental)

⚠️ **May not work on Windows** - Try WSL method above if this fails:

```bash
pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python
```

---

### Verify Installation

```bash
# Test MeTTa import
python -c "from hyperon import MeTTa; print('✅ MeTTa installed successfully!')"

# Test with the knowledge graph
cd NeriaAI/agents/metta_reason
python -c "from know_graph import initialize_reasoning_knowledge; from hyperon import MeTTa; m = MeTTa(); initialize_reasoning_knowledge(m); print('✅ Knowledge graph loaded!')"
```

---

### Troubleshooting

#### **Issue: "No module named 'hyperon'"**

**Solution**: MeTTa is not installed or not in Python path.
- For WSL: Make sure you're running Python from Ubuntu terminal, not Windows
- Run: `pip install -e .` in the `hyperon-experimental/python` directory

#### **Issue: "Cannot import MeTTa on Windows"**

**Solution**: Use WSL method (Option 1 above). Native Windows support is limited.

#### **Issue: "Build errors during installation"**

**Solution**: 
- Ensure Rust is installed: `rustc --version`
- Ensure build tools: `sudo apt install build-essential cmake`
- Try rebuilding: `cd hyperon-experimental/python && pip install -e . --force-reinstall`

#### **Issue: "Permission denied" on WSL**

**Solution**:
- Don't use `sudo` with pip in your home directory
- If needed: `pip install --user -e .`

---

### Platform Compatibility

| Platform | Status | Method |
|----------|--------|--------|
| **Windows** | ⚠️ Limited | ✅ Use WSL + Ubuntu (Recommended) |
| **Ubuntu/Linux** | ✅ Full Support | Direct installation |
| **macOS** | ✅ Supported | Direct installation |
| **WSL Ubuntu** | ✅ Full Support | Recommended for Windows users |

---

## Components

### 1. `know_graph.py` - Knowledge Base

**Purpose**: Initialize and manage the MeTTa knowledge graph

**Knowledge Categories**:

- **Reasoning Patterns** (20+ patterns)
  - Deductive: modus_ponens, modus_tollens, syllogism
  - Inductive: pattern_recognition, generalization
  - Abductive: hypothesis_formation, inference_to_best_explanation
  - Analogical: structural_mapping
  - Causal: counterfactual reasoning
  - Comparative: contrastive analysis

- **Reasoning Strategies** (9 strategies)
  - Forward/backward chaining
  - Divide and conquer
  - Proof by contradiction/induction
  - Hypothesis testing
  - Constraint propagation

- **Validation Criteria** (8 criteria)
  - Logical consistency
  - Evidence support
  - Transparency
  - Completeness
  - Reproducibility
  - Soundness
  - Relevance
  - Parsimony

- **AI/ML Domain Knowledge**
  - Neural Networks (CNNs, RNNs, Transformers, BERT, GPT, ViT, CLIP)
  - Training (backpropagation, gradient descent, optimization)
  - Modern techniques (attention, transfer learning, reinforcement learning)

- **Causal Relationships** (20+ causal chains)
  - `large_dataset → better_generalization`
  - `more_layers → hierarchical_features`
  - `attention → long_range_dependencies`

- **Logical Implications** (19 implications)
  - `deep_network → many_parameters → needs_large_data`
  - `overfitting → poor_generalization`

**Key Functions**:

```python
initialize_reasoning_knowledge(metta)  # Initialize knowledge graph
add_verified_reasoning(metta, query, type, confidence)  # Add verified reasoning
query_knowledge(metta, relation, subject)  # Query specific knowledge
add_dynamic_knowledge(metta, relation, subject, object)  # Add new knowledge
```

### 2. `reasonrag.py` - RAG System

**Purpose**: Query and retrieve knowledge from the graph

**Key Methods**:

```python
rag = GeneralRAG(metta_instance)

# Query by relation type
rag.query_reasoning_pattern("deductive")
rag.query_domain_rule("neural_networks")
rag.query_capability("CNN")
rag.query_causes("large_dataset")
rag.query_implies("deep_network")

# Advanced queries
rag.get_all_patterns()  # Get all reasoning patterns
rag.search_knowledge("attention")  # Search entire graph
rag.query_all_specific_capabilities("neural_networks")  # Complex query
```

### 3. `utils.py` - Integration Layer

**Purpose**: Bridge MeTTa knowledge with LLM reasoning

**Key Functions**:

```python
# Query processing
classify_reasoning_type(query, api_key)  # Classify reasoning type
extract_key_concepts(query, api_key)  # Extract key concepts

# Reasoning generation
generate_reasoning_chain(
    query, reasoning_type, concepts, 
    rag, context, api_key
)  # Generate complete reasoning chain

# Formatting
format_reasoning_for_validation(chain)  # Format for human review
```

---

## Usage Examples

### Example 1: Initialize and Query Knowledge Graph

```python
from hyperon import MeTTa
from metta_reason.know_graph import initialize_reasoning_knowledge
from metta_reason.reasonrag import GeneralRAG

# Initialize MeTTa
metta = MeTTa()
initialize_reasoning_knowledge(metta)

# Create RAG system
rag = GeneralRAG(metta)

# Query reasoning patterns
patterns = rag.query_reasoning_pattern("deductive")
print(f"Deductive patterns: {patterns}")

# Query AI/ML domain knowledge
capabilities = rag.query_capability("Transformer")
print(f"Transformer capabilities: {capabilities}")

# Query causal relationships
effects = rag.query_causes("attention")
print(f"Attention causes: {effects}")
```

### Example 2: Generate Reasoning Chain

```python
from metta_reason.utils import (
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain
)

query = "Why do transformers outperform RNNs on long sequences?"

# Classify and extract
reasoning_type = classify_reasoning_type(query, ASI_ONE_API_KEY)
concepts = extract_key_concepts(query, ASI_ONE_API_KEY)

# Generate reasoning chain
chain = generate_reasoning_chain(
    query=query,
    reasoning_type=reasoning_type,
    concepts=concepts,
    rag=rag,
    context=None,
    api_key=ASI_ONE_API_KEY
)

print(f"Reasoning type: {chain['reasoning_type']}")
print(f"Confidence: {chain['confidence']}")
print(f"\nReasoning steps:\n{chain['reasoning_steps']}")
```

### Example 3: Add Verified Reasoning

```python
from metta_reason.know_graph import add_verified_reasoning

# After generating and validating a reasoning chain
add_verified_reasoning(
    metta,
    "Why do neural networks need activation functions?",
    "causal",
    0.92
)

# Query verified reasoning
result = metta.run('!(match &self (verified_reasoning $q causal $c) ($q $c))')
print(f"Verified reasoning: {result}")
```

---

## Testing

### Run Comprehensive Test Suite

```bash
cd NeriaAI/agents/metta_reason
python test_metta_knowledge.py
```

**Expected Output**:
```
✅ MeTTa/Hyperon successfully imported
🧪 MeTTa Knowledge Graph Test Suite
============================================================
TEST 1: Knowledge Graph Initialization
✓ MeTTa instance created
✓ Knowledge graph initialized
...
📊 TEST SUMMARY
✅ PASS: Reasoning Patterns
✅ PASS: Domain Knowledge
✅ PASS: Causal Relationships
✅ PASS: RAG System
✅ PASS: Dynamic Knowledge
Result: 5/5 tests passed
✅ All tests passed! MeTTa knowledge graph is fully operational
```

### Quick Validation Test

```bash
cd NeriaAI/agents/metta_reason
python know_graph.py
```

This runs the built-in test suite and verifies:
- Knowledge graph initialization
- Reasoning pattern queries
- Domain knowledge queries
- Causal relationship queries
- Capability queries

---

## Integration with Reasoning Agent

The MeTTa knowledge graph is automatically integrated with `reasoning_agent.py`:

```python
# In reasoning_agent.py
from metta_reason.know_graph import initialize_reasoning_knowledge
from metta_reason.reasonrag import GeneralRAG
from metta_reason.utils import (
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain
)

@reasoning_agent.on_event("startup")
async def startup_handler(ctx: Context):
    global metta_instance, reasoning_rag
    
    if METTA_AVAILABLE:
        # Initialize MeTTa
        metta_instance = MeTTa()
        initialize_reasoning_knowledge(metta_instance)
        reasoning_rag = GeneralRAG(metta_instance)
        
        ctx.logger.info("🎉 MeTTa reasoning engine fully operational!")
```

### Reasoning Flow

1. **Query Reception**: User query received by reasoning agent
2. **Classification**: Query classified into reasoning type (deductive, causal, etc.)
3. **Concept Extraction**: Key concepts extracted from query
4. **Knowledge Retrieval**: Relevant MeTTa knowledge retrieved via RAG
5. **Chain Generation**: LLM combines MeTTa knowledge into reasoning chain
6. **Confidence Scoring**: Confidence calculated based on knowledge coverage
7. **Validation**: High confidence chains returned; low confidence forwarded for review

---

## Knowledge Graph Schema

### Relation Types

```metta
(reasoning_pattern <type> <description>)
(strategy <type> <description>)
(validation_criterion <name> <description>)
(domain_rule <domain> <rule>)
(capability <concept> <feature>)
(specificInstance <category> <instance>)
(template <type> <structure>)
(causes <cause> <effect>)
(implies <premise> <conclusion>)
(consideration <topic> <limitation>)
(faq <question> <answer>)
(reasoning_example <context> <explanation>)
(verified_reasoning <query> <type> <confidence>)
```

### Example Queries

```metta
# Find reasoning patterns
!(match &self (reasoning_pattern deductive $desc) $desc)

# Find neural network capabilities
!(match &self (capability neural_networks $cap) $cap)

# Find causal chains
!(match &self (causes $cause better_generalization) $cause)

# Find specific model instances
!(match &self (specificInstance neural_networks $model) $model)

# Complex query: get capabilities of all NN instances
!(match &self (, (specificInstance neural_networks $inst) 
                  (capability $inst $cap)) ($inst $cap))
```

---

## Extending the Knowledge Graph

### Add New Domain Knowledge

```python
from hyperon import MeTTa

metta = MeTTa()

# Add new domain rule
metta.run('(domain_rule quantum_computing "Superposition enables parallel states")')

# Add capability
metta.run('(capability quantum_computing quantum_parallelism)')

# Add causal relationship
metta.run('(causes quantum_entanglement quantum_speedup)')

# Add logical implication
metta.run('(implies quantum_computer exponential_speedup)')
```

### Add Custom Reasoning Pattern

```python
metta.run('(reasoning_pattern probabilistic "Reason under uncertainty using probability theory")')
```

### Add Domain-Specific Knowledge

```python
# Blockchain domain
metta.run('(domain_rule blockchain "Immutable distributed ledger using cryptography")')
metta.run('(capability blockchain decentralization)')
metta.run('(capability blockchain transparency)')
metta.run('(causes consensus_mechanism security)')

# Biology domain
metta.run('(domain_rule protein_folding "3D structure determines protein function")')
metta.run('(capability proteins enzymatic_activity)')
metta.run('(causes hydrophobic_interaction protein_structure)')
```

---

## Performance Characteristics

### Initialization
- **Cold start**: ~2-5 seconds (one-time on agent startup)
- **Knowledge loading**: 150+ atoms loaded
- **Verification**: 5 automatic checks

### Query Performance
- **Simple query**: ~10-50ms (single relation lookup)
- **Complex query**: ~100-500ms (multiple joins, search)
- **RAG retrieval**: ~50-200ms (depending on query complexity)

### Memory Usage
- **Base MeTTa**: ~10-20 MB
- **Knowledge graph**: ~2-5 MB (150+ atoms)
- **Total overhead**: ~15-25 MB

### Reasoning Generation
- **With MeTTa**: High confidence (0.7-0.9), rich knowledge context
- **Without MeTTa**: Lower confidence (0.4-0.6), basic reasoning

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'hyperon'"

**Solution**:
```bash
pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python
```

### Issue: "No module named 'hyperon.atoms'" or import errors

**Solution**: Reinstall from source
```bash
git clone https://github.com/trueagi-io/hyperon-experimental.git
cd hyperon-experimental/python
pip install -e .
```

### Issue: "Knowledge graph verification failed"

**Possible causes**:
1. MeTTa not properly initialized
2. Import errors during initialization

**Solution**: Run test suite for detailed diagnostics
```bash
python test_metta_knowledge.py
```

### Issue: Fallback mode activated

**Cause**: MeTTa/Hyperon not available

**Impact**: 
- Lower confidence scores (0.4-0.6 vs 0.7-0.9)
- Basic reasoning without domain knowledge
- No knowledge graph queries

**Solution**: Install Hyperon to enable full capabilities

---

## Configuration

### Environment Variables

```bash
# Reasoning Agent Configuration
REASONING_NAME=reasoning_agent
REASONING_PORT=9001
REASONING_SEED=your_secret_seed

# ASI:One API (optional - enhances classification)
ASI_ONE_API_KEY=your_asi_one_key
ASI_ONE_API_URL=https://api.asi.one/v1

# Validation Agent (for human review)
VALIDATION_AGENT_ADDRESS=agent1q...
```

---

## Roadmap

### Current Features ✅
- [x] 150+ knowledge statements
- [x] 20+ reasoning patterns
- [x] AI/ML domain expertise
- [x] RAG system
- [x] Dynamic knowledge addition
- [x] Comprehensive testing

### Planned Enhancements 🚀
- [ ] Multi-domain knowledge (biology, physics, economics)
- [ ] Probabilistic reasoning
- [ ] Uncertainty quantification
- [ ] Knowledge provenance tracking
- [ ] Interactive knowledge refinement
- [ ] GraphQL-style complex queries
- [ ] Knowledge graph visualization
- [ ] Automated knowledge extraction from documents

---

## Contributing

### Adding New Knowledge

1. Edit `know_graph.py`
2. Add atoms using proper MeTTa syntax
3. Run verification: `python know_graph.py`
4. Run test suite: `python test_metta_knowledge.py`
5. Update documentation

### Code Standards

- Use proper MeTTa syntax for all atoms
- Include descriptive comments
- Add verification tests for new knowledge
- Update README with new capabilities

---

## References

- **Hyperon MeTTa**: https://github.com/trueagi-io/hyperon-experimental
- **MeTTa Documentation**: https://wiki.opencog.org/w/MeTTa
- **NERIA AI**: Main project documentation

---

## License

Same as NERIA AI project license.

---

## Support

For issues or questions:
1. Check this README's Troubleshooting section
2. Run the test suite: `python test_metta_knowledge.py`
3. Check Hyperon GitHub issues
4. Review agent logs for detailed error messages

---

**Status**: __
**Version**: V1
**Last Updated**: 2025-01-22



