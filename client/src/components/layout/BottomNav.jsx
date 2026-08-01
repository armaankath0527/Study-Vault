import React from "react";
import { LogOut } from "lucide-react";
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

export default function BottomNav({ tab, setTab }) {
  const { logout } = useAuth();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex overflow-x-auto sv-scroll sv-bottom-nav" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      {NAV.map((n) => {
        const Icon = ICONS[n.key];
        return (
          <button key={n.key} onClick={() => setTab(n.key)} className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 shrink-0" style={{ minWidth: 66, color: tab === n.key ? "var(--primary)" : "var(--muted)" }}>
            <Icon size={17} />
            <span className="text-[10px] font-medium">{n.label.split(" ")[0]}</span>
          </button>
        );
      })}
      <button onClick={logout} className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 shrink-0" style={{ minWidth: 60, color: "var(--danger)" }}>
        <LogOut size={17} /><span className="text-[10px] font-medium">Log out</span>
      </button>
    </div>
  );
}
