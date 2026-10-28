"use client";

import { createContext, useContext } from "react";
import type { CvLabels } from "@/lib/cv-strings";

// Translated CV maker labels, provided by the builder page. Falls back to English.
const LabelsContext = createContext<CvLabels>({});

export const CvLabelsProvider = LabelsContext.Provider;

export function labelFn(labels: CvLabels) {
  return (s: string, vars?: Record<string, string | number>) => {
    const text = labels[s] ?? s;
    return vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;
  };
}

export function useL() {
  return labelFn(useContext(LabelsContext));
}
