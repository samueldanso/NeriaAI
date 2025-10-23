#!/usr/bin/env python3
"""
Diagnostic script to check agent configuration and communication flow
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 70)
print("🔍 NERIA AGENT FLOW DIAGNOSTIC")
print("=" * 70)
print()

# Check agent addresses from environment
print("📍 AGENT ADDRESSES (from environment):")
print("-" * 70)

agents = {
    "Query Router": "QUERY_ROUTER_ADDRESS",
    "Research Agent": "RESEARCH_AGENT_ADDRESS",
    "Reasoning Agent": "REASONING_AGENT_ADDRESS",
    "Validation Agent": "VALIDATION_AGENT_ADDRESS",
    "Capsule Agent": "CAPSULE_AGENT_ADDRESS"
}

addresses = {}
for agent_name, env_var in agents.items():
    address = os.getenv(env_var, "")
    addresses[agent_name] = address
    status = "✓ Configured" if address else "✗ NOT CONFIGURED"
    print(f"  {agent_name:20} {status:20} {address[:30] if address else 'N/A'}...")

print()

# Check which agents have references to other agents
print("🔗 AGENT CONNECTIONS:")
print("-" * 70)

connections = [
    ("Query Router", "Research Agent", addresses.get("Research Agent", "")),
    ("Query Router", "Reasoning Agent", addresses.get("Reasoning Agent", "")),
    ("Research Agent", "Reasoning Agent", addresses.get("Reasoning Agent", "")),
    ("Reasoning Agent", "Validation Agent", addresses.get("Validation Agent", "")),
    ("Validation Agent", "Capsule Agent", addresses.get("Capsule Agent", "")),
]

all_configured = True
for from_agent, to_agent, address in connections:
    if address:
        print(f"  ✓ {from_agent:20} → {to_agent:20}")
    else:
        print(f"  ✗ {from_agent:20} → {to_agent:20} (ADDRESS MISSING!)")
        all_configured = False

print()

# Check storage directories
print("💾 STORAGE CONFIGURATION:")
print("-" * 70)

capsule_dir = Path("data/knowledge_capsules")
capsule_storage = capsule_dir / "capsules"
capsule_stats = capsule_dir / "capsule_stats.json"

dirs_to_check = [
    ("Capsule Directory", capsule_dir),
    ("Capsule Storage", capsule_storage),
]

for name, path in dirs_to_check:
    if path.exists():
        print(f"  ✓ {name:20} exists: {path}")
    else:
        print(f"  ✗ {name:20} MISSING: {path}")

if capsule_stats.exists():
    import json
    try:
        with open(capsule_stats, 'r') as f:
            stats = json.load(f)
        print(f"  ✓ Statistics file    exists: {stats.get('total_capsules', 0)} capsules")
    except Exception as e:
        print(f"  ✗ Statistics file    ERROR: {e}")
else:
    print(f"  ⚠️  Statistics file    will be created on first run")

print()

# Check .env file
print("⚙️  ENVIRONMENT CONFIGURATION:")
print("-" * 70)

env_file = Path(".env")
if env_file.exists():
    print(f"  ✓ .env file found: {env_file.absolute()}")
    with open(env_file, 'r') as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    print(f"  ✓ Environment variables: {len(lines)} configured")
else:
    print(f"  ✗ .env file NOT FOUND")
    print(f"    Expected location: {env_file.absolute()}")

print()

# Summary and recommendations
print("=" * 70)
print("📊 DIAGNOSTIC SUMMARY:")
print("=" * 70)

issues = []
recommendations = []

# Check critical path: Reasoning → Validation → Capsule
if not addresses.get("Validation Agent"):
    issues.append("❌ CRITICAL: Validation Agent address not configured")
    recommendations.append("   Set VALIDATION_AGENT_ADDRESS in .env file")

if not addresses.get("Capsule Agent"):
    issues.append("❌ CRITICAL: Capsule Agent address not configured")
    recommendations.append("   Set CAPSULE_AGENT_ADDRESS in .env file")
    recommendations.append("   Run capsule agent and copy its address from logs")

if not addresses.get("Reasoning Agent"):
    issues.append("⚠️  WARNING: Reasoning Agent address not configured")
    recommendations.append("   Set REASONING_AGENT_ADDRESS in .env for query routing")

if issues:
    print()
    print("🚨 ISSUES FOUND:")
    for issue in issues:
        print(issue)
    print()
    print("💡 RECOMMENDATIONS:")
    for rec in recommendations:
        print(rec)
    print()
    print("=" * 70)
    print("❌ AGENT FLOW: NOT PROPERLY CONFIGURED")
    print("=" * 70)
    sys.exit(1)
else:
    print()
    print("✅ All agent addresses configured!")
    print("✅ Storage directories ready!")
    print()
    print("=" * 70)
    print("✅ AGENT FLOW: PROPERLY CONFIGURED")
    print("=" * 70)
    print()
    print("🚀 You can now:")
    print("   1. Start all agents (reasoning, validation, capsule)")
    print("   2. Send a test query")
    print("   3. Watch logs for message flow")
    print()
    sys.exit(0)

