-- ============================================================================
-- BIS Intelligence Platform — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- Documents table — stores metadata about each BIS PDF
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  is_code TEXT,
  title TEXT,
  category TEXT,
  source TEXT DEFAULT 'bis.gov.in',
  pages INTEGER,
  status TEXT DEFAULT 'indexed' CHECK (status IN ('indexed', 'processing', 'error')),
  indexed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Chunks table — clause-aware text chunks with embeddings
-- Gemini text-embedding-004 produces 768-dimensional vectors
-- ============================================================================
CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page INTEGER,
  clause TEXT,
  section TEXT,
  embedding vector(768),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Standards table — top-level BIS standard records
-- ============================================================================
CREATE TABLE IF NOT EXISTS standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_code TEXT NOT NULL,
  title TEXT,
  category TEXT,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Saved standards — user bookmarks
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  standard_id UUID REFERENCES standards(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Conversations — chat history
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  persona TEXT DEFAULT 'industry',
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Messages — individual chat messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Similarity search function (pgvector)
-- ============================================================================
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  page INTEGER,
  clause TEXT,
  section TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.document_id,
    c.content,
    c.page,
    c.clause,
    c.section,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunks c
  WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- Indexes
-- ============================================================================

-- HNSW index for fast vector similarity search (recommended over IVFFlat)
CREATE INDEX IF NOT EXISTS chunks_embedding_idx
  ON chunks USING hnsw (embedding vector_cosine_ops);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_standards_is_code ON standards (is_code);
CREATE INDEX IF NOT EXISTS idx_standards_category ON standards (category);
CREATE INDEX IF NOT EXISTS idx_documents_is_code ON documents (is_code);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks (document_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_saved_standards_user_id ON saved_standards (user_id);

-- ============================================================================
-- Enable Row Level Security (basic)
-- ============================================================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated and anonymous users for public tables
-- Drop existing policies first to ensure idempotency when re-running
DROP POLICY IF EXISTS "Public read access to documents" ON documents;
CREATE POLICY "Public read access to documents" ON documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to chunks" ON chunks;
CREATE POLICY "Public read access to chunks" ON chunks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to standards" ON standards;
CREATE POLICY "Public read access to standards" ON standards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access to saved_standards" ON saved_standards;
CREATE POLICY "Public read access to saved_standards" ON saved_standards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access to saved_standards" ON saved_standards;
CREATE POLICY "Public insert access to saved_standards" ON saved_standards FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete access to saved_standards" ON saved_standards;
CREATE POLICY "Public delete access to saved_standards" ON saved_standards FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read access to conversations" ON conversations;
CREATE POLICY "Public read access to conversations" ON conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access to conversations" ON conversations;
CREATE POLICY "Public insert access to conversations" ON conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access to messages" ON messages;
CREATE POLICY "Public read access to messages" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access to messages" ON messages;
CREATE POLICY "Public insert access to messages" ON messages FOR INSERT WITH CHECK (true);

-- Service role has full access (for ingestion scripts)
-- (Service role key bypasses RLS by default)

SELECT 'Schema created successfully!' AS result;
