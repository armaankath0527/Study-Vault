import React from "react";

export default function LoadingScreen({ text = "Loading StudyVault…" }) {
  return (
    <div className="sv-root min-h-screen flex items-center justify-center" data-theme="light">
      <p className="text-sm" style={{ color: "var(--muted)" }}>{text}</p>
    </div>
  );
}
