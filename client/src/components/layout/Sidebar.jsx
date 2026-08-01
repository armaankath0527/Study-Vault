import React from "react";
import { GraduationCap, LogOut } from "lucide-react";
import {
  LayoutDashboard, CalendarDays, CheckSquare, ClipboardCheck, Megaphone,
  StickyNote, Calculator, BookOpen, User,
} from "lucide-react";
import { NAV } from "../../utils/constants.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ICONS = {
  dashboard: LayoutDashboard, timetable: CalendarDays, tasks: CheckSquare,
  attendance: ClipboardCheck, notices: Megaphone, notes: StickyNote,
  gpa: Calculator, faculty: BookOpen, profile: User,
};

export default function Sidebar({ tab, setTab }) {
  const { logout } = useAuth();
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
          <GraduationCap size={17} color="white" />
        </div>
        <span className="sv-display text-lg font-semibold">StudyVault</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {NAV.map((n) => {
          const Icon = ICONS[n.key];
          return (
            <button key={n.key} onClick={() => setTab(n.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left"
              style={{ background: tab === n.key ? "var(--surface2)" : "transparent", color: tab === n.key ? "var(--primary)" : "var(--ink)" }}>
              <Icon size={17} /> {n.label}
            </button>
          );
        })}
      </nav>
      <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: "var(--danger)" }}>
        <LogOut size={17} /> Log out
      </button>
    </aside>
  );
}
