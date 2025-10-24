// Export Supabase client
export { createClient } from './client'

// Export capsule functions and types
export {
	createCapsule,
	updateCapsuleIPFS,
	updateCapsuleNFT,
	getCapsuleById,
	getCapsules,
	getCapsulesByCreator,
	searchCapsules,
	incrementCapsuleView,
	type KnowledgeCapsule,
	type CreateCapsuleInput,
	type CapsuleSearchResult,
} from './capsules'
