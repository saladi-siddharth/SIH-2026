import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/documents
 * List all BIS documents in the knowledge base.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ documents: [] });
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("is_code", { ascending: true });

    if (error) {
      console.error("Documents query error:", error);
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }

    return NextResponse.json({ documents: data || [] });
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
