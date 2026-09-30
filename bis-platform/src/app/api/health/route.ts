import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/health
 * Knowledge base health metrics for the admin panel.
 */
export async function GET() {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({
        documentsCount: 0,
        chunksCount: 0,
        standardsCount: 0,
        categoriesCount: 0,
        lastIngestion: null,
        status: "unconfigured",
      });
    }

    // Get counts in parallel
    const [docsResult, chunksResult, standardsResult] = await Promise.all([
      supabase.from("documents").select("*", { count: "exact", head: true }),
      supabase.from("chunks").select("*", { count: "exact", head: true }),
      supabase.from("standards").select("*", { count: "exact", head: true }),
    ]);

    // Get categories count
    const { data: categories } = await supabase
      .from("standards")
      .select("category")
      .not("category", "is", null);

    const uniqueCategories = new Set(categories?.map((c: { category: string }) => c.category) || []);

    // Get last ingestion
    const { data: lastDoc } = await supabase
      .from("documents")
      .select("indexed_at")
      .order("indexed_at", { ascending: false })
      .limit(1);

    return NextResponse.json({
      documentsCount: docsResult.count || 0,
      chunksCount: chunksResult.count || 0,
      standardsCount: standardsResult.count || 0,
      categoriesCount: uniqueCategories.size,
      lastIngestion: lastDoc?.[0]?.indexed_at || null,
      status: "healthy",
    });
  } catch (error) {
    console.error("Health API error:", error);
    return NextResponse.json({
      documentsCount: 0,
      chunksCount: 0,
      standardsCount: 0,
      categoriesCount: 0,
      lastIngestion: null,
      status: "error",
      error: "Failed to query knowledge base",
    });
  }
}
