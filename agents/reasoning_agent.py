# reasoning_agent.py
"""
NeriaMind Reasoning Agent
Generates structured knowledge reasoning chains using MeTTa
Creates transparent MeTTa logic graphs
Shows reasoning steps clearly
Builds on existing capsules (reusability!)
"""

from uagents import Agent, Context

reasoning_agent = Agent(
    name="reasoning_agent",
    mailbox=True,  # Using mailbox for Agentverse connectivity
    port=9001
)

@reasoning_agent.on_event("startup")
async def startup_handler(ctx: Context):
    ctx.logger.info(f"🧠 NERIA Reasoning Agent starting up...")
    ctx.logger.info(f"Agent address: {reasoning_agent.address}")
    ctx.logger.info(f"Ready to process complex reasoning queries!")

    # TODO Phase 2: Initialize MeTTa reasoning engine
    # TODO Phase 2: Set up agent communication protocols

if __name__ == "__main__":
    print(f"🚀 Starting NERIA Reasoning Agent...")
    print(f"📍 Agent address: {reasoning_agent.address}")
    reasoning_agent.run()
