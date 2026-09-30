# BIS Platform - Smart India Hackathon 2026

An AI-powered compliance, quality standards exploration, and dispute-resolution platform tailored for the **Bureau of Indian Standards (BIS)** ecosystem. The platform serves both industrial manufacturers and everyday Indian consumers with AI assistants, semantic standards search (RAG), automated compliance checklists, and lab directory services.

---

## 🌟 Key Features

### For Industry & Manufacturers
- **Standards Navigator**: Search and navigate official BIS standards (e.g., IS 4151 for Protective Helmets, IS 694 for PVC Cables, IS 269 for Cement, IS 14543 for Packaged Drinking Water).
- **Compliance Gap Checker**: Step-by-step audit assistant that maps manufacturing parameters against required BIS clauses and test protocols.
- **Testing & Lab Locator**: Discover recognized BIS testing laboratories, capabilities, and sample submission guidelines.
- **AI Compliance Advisor**: Multi-model RAG assistance powered by local LLMs (Qwen2.5-Coder-7B) or Google Gemini for answering complex regulatory questions with clause-level citations.

### For Consumers
- **Product Verification**: Verify ISI marks, license numbers, and standard marks to detect counterfeit goods.
- **Simplified Standards**: Easily digest complex technical specifications into consumer-friendly checklists.
- **Multilingual Support**: Explore standards and communicate with the assistant in multiple Indian regional languages.
- **Grievance Guidance**: Clear workflows for reporting non-compliant or sub-standard products to the appropriate authorities.

---

## 🏗️ Project Architecture

```
SIH 2026/
├── bis-platform/                  # Next.js 16 Full-Stack Web Application
│   ├── src/
│   │   ├── app/                  # Next.js App Router (pages & API routes)
│   │   ├── components/           # UI components, layout, and persona switchers
│   │   ├── lib/                  # RAG pipeline, Supabase vector store, AI client
│   │   └── types/                # TypeScript interface definitions
│   ├── scripts/
│   │   ├── ingest.ts             # PDF parsing, chunking, and embedding generation
│   │   └── schema.sql            # Supabase pgvector schema and search functions
│   ├── public/                   # Static assets
│   ├── .env.example              # Environment variable template
│   └── package.json
├── BIS_Standards_Collection/      # Raw BIS Standards documentation & test manuals
│   ├── IS4151_2015_Archive.pdf   # Protective Helmets Standard
│   ├── IS694_2010_lawresource.pdf# PVC Insulated Cables Standard
│   ├── PM_IS14543_...pdf         # Packaged Drinking Water Manual
│   ├── PM_IS269_Cement_...pdf    # Cement Testing Manual
│   └── ...
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.18+ or v20+)
- **npm** / **yarn** / **pnpm**
- **Supabase** account with `pgvector` enabled
- *(Optional)* **LM Studio** or Ollama running `Qwen2.5-Coder-7B` for offline local inference

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saladi-siddharth/SIH-2026.git
   cd SIH-2026/bis-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project credentials, keys, and preferred AI provider (Local or Gemini).

4. **Initialize Database Schema:**
   Run `scripts/schema.sql` inside your Supabase SQL editor to create the standards tables and vector index.

5. **Run the Ingestion Pipeline (Optional):**
   To parse and index BIS standards into vector embeddings:
   ```bash
   npm run ingest
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **UI & Styling**: React 19, Tailwind CSS, Framer Motion, Lucide Icons
- **Database & Vectors**: Supabase (PostgreSQL with `pgvector`)
- **AI & RAG**: Google Gemini API + Local Qwen2.5-Coder-7B (via OpenAI-compatible API)
- **Document Processing**: `pdf-parse` for semantic chunking and indexing

---

## 📜 License

This project is created for **Smart India Hackathon (SIH) 2026**.
