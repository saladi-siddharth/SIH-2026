import { NextRequest } from "next/server";
import { retrieveChunks, extractCitations, buildContext } from "@/lib/rag/retriever";
import { generateStreamingResponse } from "@/lib/rag/generator";
import type { RetrievalResult } from "@/lib/types";
import { z } from "zod";

const RequestSchema = z.object({
  query: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  persona: z.enum(["industry", "consumer"]).optional(),
});

/**
 * POST /api/assistant/stream
 * SSE streaming endpoint for the BIS Assistant.
 * 
 * Flow: Query → Embedding → pgvector search → Context → LLM streaming → Citations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: parsed.error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { query } = parsed.data;

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (type: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`)
          );
        };

        try {
          // Step 1: Searching
          send("status", "Searching BIS knowledge base...");

          // Step 2: Retrieve relevant chunks
          let results: RetrievalResult[] = [];
          try {
            results = await retrieveChunks(query, 6, 0.4);
          } catch (retrievalError) {
            console.error("Retrieval error:", retrievalError);
            // If retrieval fails (e.g., no database), provide a graceful fallback
            send("status", "Knowledge base unavailable. Generating general response...");
            results = [];
          }

          if (results.length > 0) {
            send("status", `Found ${results.length} relevant document sections...`);

            // Step 3: Send sources
            const citations = extractCitations(results);
            send("sources", citations);

            send("status", "Generating evidence-backed response...");

            // Step 4: Generate streaming response
            const context = buildContext(results);
            for await (const chunk of generateStreamingResponse(query, context)) {
              send(chunk.type, chunk.data);
            }

            // Step 5: Done
            send("done", "");
          } else {
            send("status", "No matching documents found...");
            send("sources", []);

            // Generate response acknowledging lack of evidence
            for await (const chunk of generateStreamingResponse(query, "")) {
              send(chunk.type, chunk.data);
            }

            send("done", "");
          }
        } catch (error) {
          console.error("Stream error:", error);
          send("error", "The knowledge service encountered an error. Please try again.");
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Assistant API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
