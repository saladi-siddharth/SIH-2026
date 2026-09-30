import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/standards
 * Search and list BIS standards from the database.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ standards: [], total: 0, page: 1, limit: 20 });
    }
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = (page - 1) * limit;

    let dbQuery = supabase
      .from("standards")
      .select("*, document:documents(*)", { count: "exact" });

    if (query) {
      dbQuery = dbQuery.or(
        `is_code.ilike.%${query}%,title.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    if (category) {
      dbQuery = dbQuery.eq("category", category);
    }

    const { data, error, count } = await dbQuery
      .order("is_code", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Standards query error:", error);
      return NextResponse.json({ error: "Failed to fetch standards" }, { status: 500 });
    }

    return NextResponse.json({
      standards: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Standards API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
