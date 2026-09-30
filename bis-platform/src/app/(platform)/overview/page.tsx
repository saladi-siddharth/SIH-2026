"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Bookmark,
  Search,
  MessageSquare,
  ClipboardCheck,
  Award,
  FlaskConical,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  ShoppingBag,
  Info as InfoIcon,
} from "lucide-react";
import { usePersona, useLanguage } from "@/lib/providers";
import MetricCard from "@/components/shared/metric-card";
import QuickActionCard from "@/components/shared/quick-action-card";
import type { DashboardMetrics } from "@/lib/types";

export default function OverviewPage() {
  const { persona } = usePersona();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        setMetrics({
          standardsCount: data.standardsCount || 0,
          documentsCount: data.documentsCount || 0,
          categoriesCount: data.categoriesCount || 0,
          savedCount: 0,
          chunksCount: data.chunksCount || 0,
        });
      })
      .catch(() => {
        setMetrics({
          standardsCount: 0,
          documentsCount: 0,
          categoriesCount: 0,
          savedCount: 0,
          chunksCount: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const isConsumer = persona === "consumer";

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          {isConsumer ? t.consumer.title : t.industry.title}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          {isConsumer ? t.consumer.subtitle : t.industry.subtitle}
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        <MetricCard
          label={t.industry.metrics.standards}
          value={metrics?.standardsCount ?? "-"}
          icon={BookOpen}
          color="var(--primary-500)"
          loading={loading}
        />
        <MetricCard
          label={t.industry.metrics.documents}
          value={metrics?.documentsCount ?? "-"}
          icon={FileText}
          color="var(--accent-500)"
          loading={loading}
        />
        <MetricCard
          label={t.industry.metrics.categories}
          value={metrics?.categoriesCount ?? "-"}
          icon={FolderOpen}
          color="#16a34a"
          loading={loading}
        />
        <MetricCard
          label={t.industry.metrics.saved}
          value={metrics?.savedCount ?? 0}
          icon={Bookmark}
          color="#8b5cf6"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>
        Quick Actions
      </h2>

      {isConsumer ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          <QuickActionCard
            title={t.consumer.verifyBIS}
            description="Check BIS / ISI mark format"
            icon={ShieldCheck}
            href="/validator"
            color="var(--primary-500)"
          />
          <QuickActionCard
            title={t.consumer.huidAssistance}
            description="Verify hallmark HUID format"
            icon={Award}
            href="/validator"
            color="var(--accent-500)"
          />
          <QuickActionCard
            title={t.consumer.understandStandard}
            description="Learn about BIS standards"
            icon={BookOpen}
            href="/standards"
            color="#16a34a"
          />
          <QuickActionCard
            title={t.consumer.askAssistant}
            description="Ask AI about product standards"
            icon={MessageSquare}
            href="/assistant"
            color="#8b5cf6"
          />
          <QuickActionCard
            title={t.consumer.productSafety}
            description="Learn about product safety"
            icon={HelpCircle}
            href="/assistant"
            color="#ec4899"
          />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          <QuickActionCard
            title={t.industry.actions.findStandard}
            description={t.industry.actions.findStandardDesc}
            icon={Search}
            href="/standards"
            color="var(--primary-500)"
          />
          <QuickActionCard
            title={t.industry.actions.askAssistant}
            description={t.industry.actions.askAssistantDesc}
            icon={MessageSquare}
            href="/assistant"
            color="var(--accent-500)"
          />
          <QuickActionCard
            title={t.industry.actions.testingReqs}
            description={t.industry.actions.testingReqsDesc}
            icon={ClipboardCheck}
            href="/assistant"
            color="#16a34a"
          />
          <QuickActionCard
            title={t.industry.actions.certGuide}
            description={t.industry.actions.certGuideDesc}
            icon={Award}
            href="/assistant"
            color="#8b5cf6"
          />
          <QuickActionCard
            title={t.industry.actions.findLab}
            description={t.industry.actions.findLabDesc}
            icon={FlaskConical}
            href="/laboratories"
            color="#ec4899"
          />
        </div>
      )}

      {/* AI Transparency */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "14px 18px",
        background: "var(--primary-50)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--primary-200)",
        fontSize: 13,
        color: "var(--primary-700)",
        lineHeight: 1.6,
      }}>
        <InfoIcon size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>{t.assistant.evidenceTooltip}</span>
      </div>
    </div>
  );
}
