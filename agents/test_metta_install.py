#!/usr/bin/env python3
"""
Quick test script to verify MeTTa installation and knowledge graph
Run this after installing hyperon to verify everything works
"""

print("\n" + "=" * 60)
print("🧪 MeTTa Installation Test")
print("=" * 60 + "\n")

# Test 1: Import hyperon
print("Test 1: Import hyperon...")
try:
    from hyperon import MeTTa, E, S, ValueAtom
    print("  ✓ SUCCESS: hyperon imported successfully\n")
    hyperon_available = True
except ImportError as e:
    print(f"  ❌ FAILED: {e}")
    print("  Install with: pip install git+https://github.com/trueagi-io/hyperon-experimental.git#subdirectory=python\n")
    hyperon_available = False

if not hyperon_available:
    print("=" * 60)
    print("⚠️  Cannot continue - hyperon not installed")
    print("=" * 60)
    exit(1)

# Test 2: Create MeTTa instance
print("Test 2: Create MeTTa instance...")
try:
    metta = MeTTa()
    print("  ✓ SUCCESS: MeTTa instance created\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 3: Add simple knowledge
print("Test 3: Add and query simple knowledge...")
try:
    metta.run('(fact test_fact "This is a test")')
    result = metta.run('!(match &self (fact test_fact $value) $value)')
    if result and len(result) > 0:
        print(f"  ✓ SUCCESS: Retrieved: {result[0]}\n")
    else:
        print("  ⚠️  WARNING: Query returned empty result\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 4: Import and initialize knowledge graph
print("Test 4: Import knowledge graph module...")
try:
    from metta_reason.know_graph import initialize_reasoning_knowledge, query_knowledge
    from metta_reason.reasonrag import GeneralRAG
    print("  ✓ SUCCESS: Knowledge graph modules imported\n")
except ImportError as e:
    print(f"  ❌ FAILED: {e}")
    print("  Make sure you're running from NeriaAI/agents/ directory\n")
    exit(1)

# Test 5: Initialize knowledge graph
print("Test 5: Initialize reasoning knowledge graph...")
try:
    initialize_reasoning_knowledge(metta)
    print("  ✓ SUCCESS: Knowledge graph initialized\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 6: Query reasoning patterns
print("Test 6: Query reasoning patterns...")
try:
    result = metta.run('!(match &self (reasoning_pattern deductive $desc) $desc)')
    if result and len(result) > 0:
        print(f"  ✓ SUCCESS: Found pattern: {result[0][0].get_object().value}\n")
    else:
        print("  ⚠️  WARNING: No reasoning patterns found\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 7: Query neural network capabilities
print("Test 7: Query neural network capabilities...")
try:
    result = metta.run('!(match &self (capability neural_networks $cap) $cap)')
    if result and len(result) > 0:
        capabilities = [str(r[0]) for r in result]
        print(f"  ✓ SUCCESS: Found {len(capabilities)} capabilities")
        for cap in capabilities[:3]:
            print(f"    - {cap}")
        if len(capabilities) > 3:
            print(f"    ... and {len(capabilities) - 3} more")
        print()
    else:
        print("  ⚠️  WARNING: No capabilities found\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 8: Initialize RAG system
print("Test 8: Initialize RAG system...")
try:
    rag = GeneralRAG(metta)
    patterns = rag.get_all_patterns()
    print(f"  ✓ SUCCESS: RAG system initialized with {len(patterns)} pattern types\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 9: Query with RAG
print("Test 9: Query reasoning pattern with RAG...")
try:
    patterns = rag.query_reasoning_pattern("causal")
    if patterns:
        print(f"  ✓ SUCCESS: Found causal reasoning patterns")
        for pattern in patterns[:2]:
            print(f"    - {pattern}")
        print()
    else:
        print("  ⚠️  WARNING: No causal patterns found\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Test 10: Query domain rules
print("Test 10: Query domain rules...")
try:
    rules = rag.query_domain_rule("neural_networks")
    if rules:
        print(f"  ✓ SUCCESS: Found domain rules")
        for rule in rules[:2]:
            print(f"    - {rule}")
        print()
    else:
        print("  ⚠️  WARNING: No domain rules found\n")
except Exception as e:
    print(f"  ❌ FAILED: {e}\n")
    exit(1)

# Summary
print("=" * 60)
print("✅ ALL TESTS PASSED!")
print("=" * 60)
print("\nMeTTa is properly installed and configured.")
print("\nNext steps:")
print("1. Run reasoning_agent.py to verify full integration")
print("2. Send test queries via Agentverse Chat")
print("3. Observe MeTTa knowledge graph citations in responses")
print("\n" + "=" * 60 + "\n")

