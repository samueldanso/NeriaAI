import { type NextRequest, NextResponse } from 'next/server'

// UAgent addresses from your existing agents
const UAGENT_ADDRESSES = {
	QUERY_ROUTER: 'agent1qwh5h2rcqy90hsa7cw4nx7zz2rt28dw7yrs234pgg7dyq8l0c9ykjy87hzu',
	RESEARCH: 'agent1qgfcn08vzxtkn9l6qyu56g8vxex5qz4l8u6umgpdlqa8fwuau6cx6vmeklm',
	REASONING: 'agent1qgfphu7jw45my7a3c0qpmnuvrf3e50fqkvyvst7mh8lvsuhv5n92zqwmeuz',
	VALIDATION: 'agent1qv64keg2jx4gsrsgk4s8r8q5pjahmaq4dpsa0whge0l3zf4glkzxw89wacm',
	CAPSULE: 'agent1qt78fvx2utyw0qdnld73d9vn3rca8xcfkec24vtkqzu0xrdlsnkqgul8246',
}

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
		const { message } = await request.json()

		if (!message || typeof message !== 'string') {
			return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
		}

		const client = await getClient()

		// Start with Query Router Agent (entry point)
		const result = await client.query(UAGENT_ADDRESSES.QUERY_ROUTER, message)

		if (result.success) {
			return NextResponse.json({
				response: result.response,
				success: true,
				agentAddress: UAGENT_ADDRESSES.QUERY_ROUTER,
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
