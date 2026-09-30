"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/providers";
import ValidatorForm from "@/components/validator/validator-form";

export default function ValidatorPage() {
  const { t } = useLanguage();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* CM/L Validator */}
        <div style={{ marginBottom: 40 }}>
          <ValidatorForm type="cml" />
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid var(--border-light)",
          margin: "0 0 40px",
        }} />

        {/* HUID Validator */}
        <ValidatorForm type="huid" />
      </motion.div>
    </div>
  );
}
