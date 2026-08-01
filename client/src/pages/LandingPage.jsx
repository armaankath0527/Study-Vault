import React from "react";
import { GraduationCap, ArrowRight, CalendarDays, CheckSquare, ClipboardCheck, Megaphone, StickyNote, Calculator } from "lucide-react";
import { SUBJECT_COLORS } from "../utils/constants.js";
import { useBodyBackground } from "../hooks/useBodyBackground.js";

const FEATURES = [
  { icon: CalendarDays, label: "Timetable", desc: "Your weekly classes, color-coded and always in view." },
  { icon: CheckSquare, label: "Tasks", desc: "Track assignments and deadlines without the sticky notes." },
  { icon: ClipboardCheck, label: "Attendance", desc: "Know your percentage before it becomes a problem." },
  { icon: Megaphone, label: "Notice Board", desc: "Every campus update, in one scroll." },
  { icon: StickyNote, label: "Notes", desc: "Quick notes that stay organized by subject." },
  { icon: Calculator, label: "GPA Calculator", desc: "SGPA and CGPA, computed as you go." },
];

export default function LandingPage({ onEnter }) {
  useBodyBackground("#F3F5F1");
  return (
    <div className="sv-root min-h-screen" data-theme="light">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span className="sv-display text-xl font-semibold">StudyVault</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mt-14 md:mt-20">
          <div className="sv-anim">
            <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--primary)" }}>Campus life, organized</p>
            <h1 className="sv-display text-4xl md:text-5xl font-semibold leading-tight mb-5">
              One vault for your <span style={{ color: "var(--primary)" }}>timetable</span>, <span style={{ color: "var(--secondary)" }}>tasks</span>, and everything in between.
            </h1>
            <p className="text-base mb-8" style={{ color: "var(--muted)" }}>
              StudyVault brings your class schedule, assignments, attendance, notices, notes and GPA
              tracking into one calm, responsive place — so you spend less time hunting for information
              and more time studying.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onEnter} className="sv-btn-primary px-6 py-3 text-sm flex items-center gap-2">
                Get started <ArrowRight size={16} />
              </button>
              <button onClick={onEnter} className="sv-btn-ghost px-6 py-3 text-sm">I already have an account</button>
            </div>
          </div>
          <div className="sv-card p-5 sv-anim">
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>TODAY'S SCHEDULE — PREVIEW</p>
            {["09:00 Data Structures", "11:00 Software Engineering", "13:00 Operating Systems"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="w-2 h-8 rounded-full" style={{ background: SUBJECT_COLORS[i % 6].hex }} />
                <div>
                  <p className="sv-mono text-xs" style={{ color: "var(--muted)" }}>{s.slice(0, 5)}</p>
                  <p className="text-sm font-medium">{s.slice(6)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="sv-display text-2xl font-semibold mb-6">Everything you need, nothing you don't</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="sv-card p-5 sv-anim">
                <f.icon size={20} style={{ color: "var(--primary)" }} className="mb-3" />
                <p className="font-semibold text-sm mb-1">{f.label}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 mb-10 text-center">
          <button onClick={onEnter} className="sv-btn-primary px-8 py-3 text-sm">Continue to login</button>
        </div>
      </div>
    </div>
  );
}
