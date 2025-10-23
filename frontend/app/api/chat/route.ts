import { NextRequest, NextResponse } from 'next/server'

// Agent addresses from your reasoning_agent.py
const REASONING_AGENT_ADDRESS = 'agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu'
const VALIDATION_AGENT_ADDRESS = 'agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm'

let clientInstance: any = null

async function getClient() {
	if (!clientInstance) {
		const UAgentClientModule = await import('uagent-client')
		const UAgentClient = UAgentClientModule.default || UAgentClientModule

		clientInstance = new (UAgentClient as any)({
			timeout: 60000,
			autoStartBridge: true,
		})

		// Wait for bridge to initialize
		await new Promise((resolve) => setTimeout(resolve, 2000))
	}
	return clientInstance
}

export async function POST(request: NextRequest) {
	try {
		const { message, agentType = 'reasoning' } = await request.json()

		if (!message || typeof message !== 'string') {
			return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
		}

		const client = await getClient()

		// Route to appropriate agent based on agentType
		const agentAddress =
			agentType === 'validation' ? VALIDATION_AGENT_ADDRESS : REASONING_AGENT_ADDRESS

		const result = await client.query(agentAddress, message)

		if (result.success) {
			return NextResponse.json({
				response: result.response,
				success: true,
				agentType,
				agentAddress,
			})
		} else {
			return NextResponse.json({
				response: 'I apologize, but I was unable to process your request at this time.',
				success: false,
				error: result.error,
			})
		}
	} catch (error) {
		console.error('Agent communication error:', error)
		return NextResponse.json(
			{
				response: 'An error occurred while processing your request.',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		)
	}
}
