"use client";

import dynamic from "next/dynamic";

// The builder reads the saved draft from localStorage on first render,
// so it only renders in the browser.
export const CvBuilderLoader = dynamic(() => import("@/components/cv/cv-builder").then((m) => m.CvBuilder), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-500" role="status">
      Loading CV maker…
    </div>
  ),
});
