import { getServiceClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./embeddings";
import type { RetrievalResult, Citation } from "@/lib/types";

/**
 * Retrieve relevant BIS document chunks using semantic search (pgvector).
 * Returns the top matching chunks with their citation metadata.
 */
export async function retrieveChunks(
  query: string,
  matchCount: number = 6,
  matchThreshold: number = 0.5
): Promise<RetrievalResult[]> {
  const supabase = getServiceClient();
  if (!supabase) {
    return [];
  }

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Call the match_chunks RPC function
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    match_threshold: matchThreshold,
  });

  if (error) {
    console.error("Retrieval error:", error);
    throw new Error(`Retrieval failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Enrich with document metadata
  const documentIds = [...new Set(data.map((d: RetrievalResult) => d.document_id))];
  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .in("id", documentIds);

  const docMap = new Map(docs?.map((d: { id: string }) => [d.id, d]) || []);

  return data.map((chunk: RetrievalResult) => ({
    ...chunk,
    document: docMap.get(chunk.document_id) || null,
  }));
}

/**
 * Convert retrieval results into citation objects for the frontend.
 */
export function extractCitations(results: RetrievalResult[]): Citation[] {
  return results.map((r) => ({
    document_id: r.document_id,
    document_title: (r.document as Record<string, string> | undefined)?.title || undefined,
    is_code: (r.document as Record<string, string> | undefined)?.is_code || undefined,
    page: r.page,
    clause: r.clause,
    section: r.section,
    content: r.content,
    similarity: r.similarity,
  }));
}

/**
 * Build context text from retrieved chunks for the LLM prompt.
 */
export function buildContext(results: RetrievalResult[]): string {
  if (results.length === 0) return "";

  return results
    .map((r, i) => {
      const doc = r.document as Record<string, string> | undefined;
      const header = [
        `[Source ${i + 1}]`,
        doc?.is_code ? `Standard: ${doc.is_code}` : null,
        doc?.title ? `Document: ${doc.title}` : null,
        r.page ? `Page: ${r.page}` : null,
        r.clause ? `Clause: ${r.clause}` : null,
        r.section ? `Section: ${r.section}` : null,
      ].filter(Boolean).join(" | ");

      return `${header}\n${r.content}`;
    })
    .join("\n\n---\n\n");
}
