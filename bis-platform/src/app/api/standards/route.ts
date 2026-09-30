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

    let standardsList = data || [];
    let totalCount = count || 0;

    const SEED_STANDARDS = [
      {
        id: "std-4151",
        is_code: "IS 4151:2015",
        title: "Protective Helmets for Two-Wheeler Riders",
        category: "Safety Equipment",
        document_id: "doc-4151",
        metadata: {
          mandatory: true,
          amendments: ["Amd 1 (2018)", "Amd 2 (2020)"],
          key_clauses: ["Clause 7.1 Impact Absorption", "Clause 7.2 Retention System", "Clause 7.3 Rigidity Test"],
        }
      },
      {
        id: "std-694",
        is_code: "IS 694:2010",
        title: "PVC Insulated Cables for Working Voltages up to 1100 V",
        category: "Electrical & Electronics",
        document_id: "doc-694",
        metadata: {
          mandatory: true,
          amendments: ["Product Manual March 2024"],
          key_clauses: ["Clause 14 Spark Test", "Clause 15 Conductor Resistance", "Clause 16 Flame Retardance"],
        }
      },
      {
        id: "std-269",
        is_code: "IS 269:2015",
        title: "Ordinary Portland Cement (33, 43 & 53 Grade)",
        category: "Civil & Construction",
        document_id: "doc-269",
        metadata: {
          mandatory: true,
          amendments: ["Product Manual Oct 2023"],
          key_clauses: ["Clause 6.1 Compressive Strength", "Clause 6.2 Setting Time", "Clause 6.3 Soundness"],
        }
      },
      {
        id: "std-14543",
        is_code: "IS 14543:2024",
        title: "Packaged Drinking Water (Other than Natural Mineral Water)",
        category: "Food & Water",
        document_id: "doc-14543",
        metadata: {
          mandatory: true,
          amendments: ["Scheme of Inspection 2025"],
          key_clauses: ["Table 1 Physical Parameters", "Table 2 Chemical Limits", "Table 3 Microbiological Limits"],
        }
      },
      {
        id: "std-15885",
        is_code: "IS 15885 (Part 2/Sec 13):2020",
        title: "Safety of Lamp Controlgear - DC/AC Supplied Electronic Controlgear for LED Modules",
        category: "Electrical & Electronics",
        document_id: "doc-15885",
        metadata: {
          mandatory: true,
          key_clauses: ["Clause 8 Electric Shock Protection", "Clause 11 Moisture Resistance", "Clause 14 Fault Conditions"],
        }
      },
      {
        id: "std-1293",
        is_code: "IS 1293:2019",
        title: "Plugs and Socket-Outlets of Rated Voltage up to 250V",
        category: "Consumer Electronics",
        document_id: "doc-1293",
        metadata: {
          mandatory: true,
          key_clauses: ["Clause 9 Dimensions & Gauge", "Clause 13 Protection Against Shock", "Clause 20 Temperature Rise"],
        }
      }
    ];

    if (standardsList.length === 0) {
      let filtered = SEED_STANDARDS;
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(s =>
          s.is_code.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      if (category) {
        filtered = filtered.filter(s => s.category === category);
      }
      standardsList = filtered;
      totalCount = filtered.length;
    }

    return NextResponse.json({
      standards: standardsList,
      total: totalCount,
      page,
      limit,
    });
  } catch (error) {
    console.error("Standards API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
