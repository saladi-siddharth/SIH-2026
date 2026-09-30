// ============================================================================
// BIS Platform — Core Type Definitions
// ============================================================================

export type Persona = "industry" | "consumer";

export type Language = "en" | "hi";

export type DocumentStatus = "indexed" | "processing" | "error";

// --- Database Models ---

export interface BISDocument {
  id: string;
  filename: string;
  is_code: string | null;
  title: string | null;
  category: string | null;
  source: string;
  pages: number | null;
  status: DocumentStatus;
  indexed_at: string;
}

export interface Chunk {
  id: string;
  document_id: string;
  content: string;
  page: number | null;
  clause: string | null;
  section: string | null;
  metadata: Record<string, unknown>;
}

export interface BISStandard {
  id: string;
  is_code: string;
  title: string;
  category: string | null;
  document_id: string | null;
  metadata: Record<string, unknown>;
  document?: BISDocument;
}

export interface SavedStandard {
  id: string;
  user_id: string;
  standard_id: string;
  created_at: string;
  standard?: BISStandard;
}

export interface Conversation {
  id: string;
  user_id: string;
  persona: Persona;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations: Citation[];
  created_at: string;
}

// --- RAG / Citation ---

export interface Citation {
  document_id: string;
  document_title?: string;
  is_code?: string;
  page: number | null;
  clause: string | null;
  section?: string | null;
  content: string;
  similarity?: number;
}

export interface RetrievalResult {
  id: string;
  document_id: string;
  content: string;
  page: number | null;
  clause: string | null;
  section: string | null;
  similarity: number;
  document?: BISDocument;
}

// --- SSE Stream Events ---

export type StreamEventType =
  | "status"
  | "retrieval"
  | "sources"
  | "token"
  | "done"
  | "error";

export interface StreamEvent {
  type: StreamEventType;
  data: string | Citation[] | RetrievalResult[];
}

// --- API ---

export interface AssistantRequest {
  query: string;
  conversationId?: string;
  persona?: Persona;
}

export interface StandardSearchParams {
  query?: string;
  category?: string;
  is_code?: string;
  page?: number;
  limit?: number;
}

export interface ValidatorResult {
  input: string;
  isValidFormat: boolean;
  formatType: string | null;
  message: string;
  disclaimer: string;
}

// --- UI State ---

export interface SearchState {
  query: string;
  results: BISStandard[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  isStreaming?: boolean;
  timestamp: Date;
}

// --- Dashboard Metrics ---

export interface DashboardMetrics {
  standardsCount: number;
  documentsCount: number;
  categoriesCount: number;
  savedCount: number;
  chunksCount: number;
}

// --- Laboratory ---

export interface Laboratory {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  testing_domain: string[];
  relevant_products: string[];
  contact: string | null;
  source: string | null;
}
