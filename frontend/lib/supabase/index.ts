// Export Supabase client

// Export capsule functions and types
export {
  type CapsuleSearchResult,
  type CreateCapsuleInput,
  createCapsule,
  getCapsuleById,
  getCapsules,
  getCapsulesByCreator,
  incrementCapsuleView,
  type KnowledgeCapsule,
  searchCapsules,
  updateCapsuleIPFS,
  updateCapsuleNFT,
} from "./capsules";
export { createClient } from "./client";
