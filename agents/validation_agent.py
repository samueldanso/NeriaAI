# validation_agent.py
"""
NERIA AI Validation Agent
Coordinates human expert validation via ASI:One
Sends reasoning to human experts
 Handles approve/revise workflow
Tracks validation status
Creates validation proof

"""

from uagents import Agent, Context

# Agent configuration following Fetch.ai docs and AgentFlow pattern
validation_agent = Agent(
    name="validation_agent",
    mailbox=True,  # Using mailbox for Agentverse connectivity
    port=9002
)

@validation_agent.on_event("startup")
async def startup_handler(ctx: Context):
    ctx.logger.info(f"✅ NERIA Validation Agent starting up...")
    ctx.logger.info(f"Agent address: {validation_agent.address}")
    ctx.logger.info(f"Ready to coordinate human validation via ASI:One!")

    # TODO Phase 2: Implement ASI:One API integration
    # TODO Phase 2: Set up agent communication protocols

if __name__ == "__main__":
    print(f"🚀 Starting NERIA Validation Agent...")
    print(f"📍 Agent address: {validation_agent.address}")
    validation_agent.run()
