/**
 * BIS Platform — PDF Ingestion Pipeline
 * 
 * This script:
 * 1. Reads all BIS PDF files from the collection directory
 * 2. Extracts text with page numbers
 * 3. Chunks text by clause/section boundaries
 * 4. Generates embeddings using Gemini text-embedding-004
 * 5. Uploads everything to Supabase (documents, chunks, standards tables)
 * 
 * Usage: npx tsx scripts/ingest.ts
 * Requires: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env.local
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const LOCAL_EMBED_URL = process.env.LOCAL_EMBEDDING_URL || process.env.LOCAL_LLM_URL || "http://localhost:1234/v1";
const LOCAL_EMBED_MODEL = process.env.LOCAL_EMBEDDING_MODEL || "text-embedding-nomic-embed-text-v1.5";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const hasGemini = GEMINI_KEY && GEMINI_KEY.trim() !== "" && GEMINI_KEY !== "PASTE_YOUR_GEMINI_API_KEY_HERE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const genai = hasGemini ? new GoogleGenerativeAI(GEMINI_KEY!) : null;

// ============================================================================
// PDF Metadata — maps filenames to BIS standard info
// ============================================================================
const PDF_METADATA: Record<string, { is_code: string; title: string; category: string }> = {
  "PM_IS14543_Packaged_Drinking_Water_2025.pdf": {
    is_code: "IS 14543",
    title: "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
    category: "Food & Water",
  },
  "PM_IS4151_Helmet.pdf": {
    is_code: "IS 4151",
    title: "Protective Helmets for Two-Wheeler Riders",
    category: "Safety Equipment",
  },
  "IS4151_2015_Archive.pdf": {
    is_code: "IS 4151",
    title: "Protective Helmets for Two-Wheeler Riders (Full Standard 2015)",
    category: "Safety Equipment",
  },
  "IS4151_Amd1.pdf": {
    is_code: "IS 4151 Amd 1",
    title: "Protective Helmets — Amendment 1",
    category: "Safety Equipment",
  },
  "IS4151_Amd2.pdf": {
    is_code: "IS 4151 Amd 2",
    title: "Protective Helmets — Amendment 2",
    category: "Safety Equipment",
  },
  "PM_IS694_Cables_March2024.pdf": {
    is_code: "IS 694",
    title: "PVC Insulated Cables for Working Voltages up to and Including 1100V",
    category: "Electrical",
  },
  "IS694_2010_lawresource.pdf": {
    is_code: "IS 694",
    title: "PVC Insulated Cables (Full Standard 2010)",
    category: "Electrical",
  },
  "PM_IS269_Cement_Oct2023.pdf": {
    is_code: "IS 269",
    title: "Ordinary Portland Cement — Specification",
    category: "Construction",
  },
};

// ============================================================================
// PDF Parsing
// ============================================================================
async function parsePDF(filePath: string): Promise<{ text: string; pages: number }> {
  const { PDFParse } = await import("pdf-parse");
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();
  return { text: data.text || "", pages: data.total || 1 };
}

// ============================================================================
// Clause-Aware Chunking
// ============================================================================
interface TextChunk {
  content: string;
  page: number | null;
  clause: string | null;
  section: string | null;
}

function chunkDocument(text: string, maxChunkSize: number = 1200): TextChunk[] {
  const chunks: TextChunk[] = [];

  // Split into lines
  const lines = text.split("\n");

  let currentChunk = "";
  let currentClause: string | null = null;
  let currentSection: string | null = null;
  let currentPage: number | null = 1;

  // Regex patterns for clause detection
  const clausePattern = /^(\d+(?:\.\d+)*)\s+/;
  const sectionPattern = /^(SECTION|ANNEX|APPENDIX|TABLE|SCHEDULE)\s+/i;
  const pagePattern = /(?:^|\s)(?:Page|—\s*)\s*(\d+)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for page numbers
    const pageMatch = trimmed.match(pagePattern);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1]);
    }

    // Check for clause headers
    const clauseMatch = trimmed.match(clausePattern);
    if (clauseMatch) {
      // Save previous chunk if substantial
      if (currentChunk.trim().length > 50) {
        chunks.push({
          content: currentChunk.trim(),
          page: currentPage,
          clause: currentClause,
          section: currentSection,
        });
      }
      currentClause = `Clause ${clauseMatch[1]}`;
      currentChunk = trimmed + "\n";
      continue;
    }

    // Check for section headers
    const sectionMatch = trimmed.match(sectionPattern);
    if (sectionMatch) {
      if (currentChunk.trim().length > 50) {
        chunks.push({
          content: currentChunk.trim(),
          page: currentPage,
          clause: currentClause,
          section: currentSection,
        });
      }
      currentSection = trimmed.substring(0, 80);
      currentClause = null;
      currentChunk = trimmed + "\n";
      continue;
    }

    // Add to current chunk
    currentChunk += trimmed + "\n";

    // Split if chunk is too large
    if (currentChunk.length > maxChunkSize) {
      chunks.push({
        content: currentChunk.trim(),
        page: currentPage,
        clause: currentClause,
        section: currentSection,
      });
      currentChunk = "";
    }
  }

  // Final chunk
  if (currentChunk.trim().length > 50) {
    chunks.push({
      content: currentChunk.trim(),
      page: currentPage,
      clause: currentClause,
      section: currentSection,
    });
  }

  return chunks;
}

// ============================================================================
// Embedding Generation
// ============================================================================
async function generateEmbedding(text: string): Promise<number[]> {
  // 1. Try local embedding endpoint (e.g. LM Studio on port 1234)
  try {
    const res = await fetch(`${LOCAL_EMBED_URL.replace(/\/+$/, "")}/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LOCAL_EMBED_MODEL,
        input: text,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.[0]?.embedding) {
        return data.data[0].embedding;
      }
    }
  } catch {
    // Local server error or not running
  }

  // 2. Try Gemini
  if (hasGemini && genai) {
    const model = genai.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  throw new Error("No active embedding provider available (neither local model nor Gemini)");
}

async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    try {
      const emb = await generateEmbedding(texts[i]);
      embeddings.push(emb);
    } catch (error) {
      console.error(`  ⚠ Embedding failed for chunk ${i}, retrying...`);
      await sleep(2000);
      try {
        const emb = await generateEmbedding(texts[i]);
        embeddings.push(emb);
      } catch {
        console.error(`  ❌ Embedding failed again for chunk ${i}, using zero vector`);
        embeddings.push(new Array(768).fill(0));
      }
    }
    // Rate limiting: ~200ms between requests
    if (i < texts.length - 1) {
      await sleep(250);
    }
    if ((i + 1) % 10 === 0) {
      console.log(`    Embedded ${i + 1}/${texts.length} chunks`);
    }
  }
  return embeddings;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Main Ingestion Pipeline
// ============================================================================
async function main() {
  console.log("🚀 BIS Platform — PDF Ingestion Pipeline");
  console.log("=========================================\n");

  const pdfDir = path.resolve(__dirname, "../../BIS_Standards_Collection");

  if (!fs.existsSync(pdfDir)) {
    console.error(`❌ PDF directory not found: ${pdfDir}`);
    process.exit(1);
  }

  const pdfFiles = fs.readdirSync(pdfDir).filter((f) => f.endsWith(".pdf"));
  console.log(`📁 Found ${pdfFiles.length} PDF files\n`);

  const standardsMap = new Map<string, string>(); // is_code -> document_id

  for (const filename of pdfFiles) {
    const filePath = path.join(pdfDir, filename);
    const meta = PDF_METADATA[filename];

    if (!meta) {
      console.log(`⏭ Skipping ${filename} (no metadata mapping)`);
      continue;
    }

    console.log(`\n📄 Processing: ${filename}`);
    console.log(`   IS Code: ${meta.is_code} | Category: ${meta.category}`);

    // Step 1: Parse PDF
    console.log("   1. Parsing PDF...");
    let text: string;
    let pages: number;
    try {
      const result = await parsePDF(filePath);
      text = result.text;
      pages = result.pages;
      console.log(`      ✓ Extracted ${text.length} characters, ${pages} pages`);
    } catch (error) {
      console.error(`   ❌ Failed to parse: ${error}`);
      continue;
    }

    // Step 2: Insert document record
    console.log("   2. Creating document record...");
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert({
        filename,
        is_code: meta.is_code,
        title: meta.title,
        category: meta.category,
        source: "bis.gov.in",
        pages,
        status: "indexed",
      })
      .select("id")
      .single();

    if (docError) {
      console.error(`   ❌ Document insert failed: ${docError.message}`);
      continue;
    }

    const documentId = docData.id;
    console.log(`      ✓ Document ID: ${documentId}`);

    // Track for standards table
    if (!standardsMap.has(meta.is_code.replace(/ Amd \d+/, ""))) {
      standardsMap.set(meta.is_code.replace(/ Amd \d+/, ""), documentId);
    }

    // Step 3: Chunk
    console.log("   3. Chunking document...");
    const chunks = chunkDocument(text);
    console.log(`      ✓ Created ${chunks.length} chunks`);

    if (chunks.length === 0) {
      console.log("   ⚠ No chunks generated, skipping...");
      continue;
    }

    // Step 4: Generate embeddings
    console.log("   4. Generating embeddings...");
    const embeddings = await generateEmbeddingsBatch(chunks.map((c) => c.content));
    console.log(`      ✓ Generated ${embeddings.length} embeddings`);

    // Step 5: Insert chunks with embeddings
    console.log("   5. Uploading chunks to Supabase...");
    const chunkRecords = chunks.map((chunk, i) => ({
      document_id: documentId,
      content: chunk.content,
      page: chunk.page,
      clause: chunk.clause,
      section: chunk.section,
      embedding: embeddings[i],
      metadata: {},
    }));

    // Upload in batches of 20
    for (let i = 0; i < chunkRecords.length; i += 20) {
      const batch = chunkRecords.slice(i, i + 20);
      const { error: chunkError } = await supabase.from("chunks").insert(batch);
      if (chunkError) {
        console.error(`   ❌ Chunk batch insert failed: ${chunkError.message}`);
      }
    }
    console.log(`      ✓ Uploaded ${chunkRecords.length} chunks`);
  }

  // Step 6: Create standards table entries
  console.log("\n📋 Creating standards records...");
  for (const [isCode, documentId] of standardsMap) {
    const meta = Object.values(PDF_METADATA).find(
      (m) => m.is_code === isCode || m.is_code.replace(/ Amd \d+/, "") === isCode
    );
    if (!meta) continue;

    const { error } = await supabase.from("standards").insert({
      is_code: isCode,
      title: meta.title,
      category: meta.category,
      document_id: documentId,
      metadata: {},
    });

    if (error) {
      console.error(`   ❌ Standard insert failed for ${isCode}: ${error.message}`);
    } else {
      console.log(`   ✓ ${isCode}: ${meta.title}`);
    }
  }

  console.log("\n✅ Ingestion complete!");

  // Verify counts
  const { count: docCount } = await supabase.from("documents").select("*", { count: "exact", head: true });
  const { count: chunkCount } = await supabase.from("chunks").select("*", { count: "exact", head: true });
  const { count: stdCount } = await supabase.from("standards").select("*", { count: "exact", head: true });

  console.log(`\n📊 Final counts:`);
  console.log(`   Documents: ${docCount}`);
  console.log(`   Chunks: ${chunkCount}`);
  console.log(`   Standards: ${stdCount}`);
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
