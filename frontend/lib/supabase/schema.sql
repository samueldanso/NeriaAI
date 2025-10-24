-- NeriaAI Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable pgvector extension for vector search
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge Capsules Table
CREATE TABLE IF NOT EXISTS knowledge_capsules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Query & Content
    query TEXT NOT NULL,
    answer TEXT NOT NULL,

    -- Reasoning Data
    reasoning_chain JSONB NOT NULL,
    reasoning_type TEXT NOT NULL,

    -- Validation Data
    validation_proof JSONB NOT NULL,
    validation_status TEXT NOT NULL CHECK (validation_status IN ('VERIFIED', 'REJECTED', 'NEEDS_REVISION')),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),

    -- Storage References
    ipfs_hash TEXT,
    nft_token_id BIGINT,
    nft_contract_address TEXT,
    nft_tx_hash TEXT,

    -- Creator & Ownership
    creator_address TEXT NOT NULL,

    -- Vector Embedding for Semantic Search
    embedding vector(1536), -- OpenAI ada-002 dimensions

    -- Metadata
    tags TEXT[],
    category TEXT,

    -- Usage Statistics
    view_count INTEGER DEFAULT 0,
    citation_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Indexes
    CONSTRAINT valid_confidence CHECK (confidence BETWEEN 0 AND 1)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_capsules_creator ON knowledge_capsules(creator_address);
CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON knowledge_capsules(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_capsules_validation_status ON knowledge_capsules(validation_status);
CREATE INDEX IF NOT EXISTS idx_capsules_confidence ON knowledge_capsules(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_capsules_category ON knowledge_capsules(category);
CREATE INDEX IF NOT EXISTS idx_capsules_ipfs ON knowledge_capsules(ipfs_hash);
CREATE INDEX IF NOT EXISTS idx_capsules_nft_token ON knowledge_capsules(nft_token_id);

-- Vector similarity search index (HNSW for fast approximate search)
CREATE INDEX IF NOT EXISTS idx_capsules_embedding ON knowledge_capsules
USING hnsw (embedding vector_cosine_ops);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_knowledge_capsules_updated_at BEFORE UPDATE
ON knowledge_capsules FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_capsules(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    query TEXT,
    answer TEXT,
    reasoning_chain JSONB,
    validation_status TEXT,
    confidence DECIMAL,
    ipfs_hash TEXT,
    creator_address TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.query,
        kc.answer,
        kc.reasoning_chain,
        kc.validation_status,
        kc.confidence,
        kc.ipfs_hash,
        kc.creator_address,
        1 - (kc.embedding <=> query_embedding) AS similarity
    FROM knowledge_capsules kc
    WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Capsule Statistics Table (for analytics)
CREATE TABLE IF NOT EXISTS capsule_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Global Statistics
    total_capsules INTEGER DEFAULT 0,
    total_verified INTEGER DEFAULT 0,
    total_rejected INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_citations INTEGER DEFAULT 0,

    -- Category Breakdown
    category_breakdown JSONB DEFAULT '{}'::JSONB,

    -- Timestamps
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial statistics row
INSERT INTO capsule_statistics (total_capsules, total_verified, total_rejected, total_views, total_citations)
VALUES (0, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_capsule_view(capsule_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_capsules
    SET view_count = view_count + 1
    WHERE id = capsule_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment citation count
CREATE OR REPLACE FUNCTION increment_capsule_citation(capsule_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_capsules
    SET citation_count = citation_count + 1
    WHERE id = capsule_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE knowledge_capsules ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for discovery)
CREATE POLICY "Allow public read access"
ON knowledge_capsules FOR SELECT
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
ON knowledge_capsules FOR INSERT
WITH CHECK (true);

-- Allow creators to update their own capsules
CREATE POLICY "Allow creators to update own capsules"
ON knowledge_capsules FOR UPDATE
USING (creator_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Comments for documentation
COMMENT ON TABLE knowledge_capsules IS 'Stores verified AI reasoning chains as Knowledge Capsules';
COMMENT ON COLUMN knowledge_capsules.reasoning_chain IS 'Full structured reasoning chain in JSON format';
COMMENT ON COLUMN knowledge_capsules.validation_proof IS 'Multi-agent validation results';
COMMENT ON COLUMN knowledge_capsules.embedding IS 'Vector embedding for semantic search using pgvector';
COMMENT ON COLUMN knowledge_capsules.ipfs_hash IS 'IPFS hash where full capsule data is stored';
COMMENT ON COLUMN knowledge_capsules.nft_token_id IS 'ERC-721 token ID on Base L2';
