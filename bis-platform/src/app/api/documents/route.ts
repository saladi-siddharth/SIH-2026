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

    const SEED_DOCUMENTS = [
      {
        id: "doc-4151-spec",
        filename: "IS4151_2015_Archive.pdf",
        is_code: "IS 4151:2015",
        title: "Protective Helmets for Two-Wheeler Riders (Full Standard)",
        category: "Safety Equipment",
        source: "BIS Standards Portal",
        pages: 42,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      },
      {
        id: "doc-4151-manual",
        filename: "PM_IS4151_Helmet.pdf",
        is_code: "IS 4151",
        title: "Product Manual for Certification of Helmets",
        category: "Safety Equipment",
        source: "Central Marks Department - III",
        pages: 28,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      },
      {
        id: "doc-694-spec",
        filename: "IS694_2010_lawresource.pdf",
        is_code: "IS 694:2010",
        title: "PVC Insulated Cables for Working Voltages up to 1100 V",
        category: "Electrical & Electronics",
        source: "Law Resource India Archive",
        pages: 36,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      },
      {
        id: "doc-694-manual",
        filename: "PM_IS694_Cables_March2024.pdf",
        is_code: "IS 694",
        title: "Product Manual for PVC Insulated Cables (Revised March 2024)",
        category: "Electrical & Electronics",
        source: "Central Marks Department - I",
        pages: 24,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      },
      {
        id: "doc-269-manual",
        filename: "PM_IS269_Cement_Oct2023.pdf",
        is_code: "IS 269",
        title: "Product Manual for Ordinary Portland Cement Testing & Audit",
        category: "Civil & Construction",
        source: "Civil Engineering Standards Directorate",
        pages: 32,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      },
      {
        id: "doc-14543-manual",
        filename: "PM_IS14543_Packaged_Drinking_Water_2025.pdf",
        is_code: "IS 14543",
        title: "Product Manual for Packaged Drinking Water Inspection (2025)",
        category: "Food & Water",
        source: "Food and Agriculture Department",
        pages: 46,
        status: "indexed",
        indexed_at: new Date().toISOString(),
      }
    ];

    const docList = data && data.length > 0 ? data : SEED_DOCUMENTS;
    return NextResponse.json({ documents: docList });
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
