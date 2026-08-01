import React, { useState, useMemo } from "react";
import { Search, Bell, Sun, Moon, GraduationCap } from "lucide-react";
import { NAV } from "../../utils/constants.js";
import { fmtDate } from "../../utils/dateUtils.js";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Topbar({ tab, darkMode, onToggleDarkMode, notifications, setTab }) {
  const { data } = useAppData();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    data.tasks.forEach((t) => { if ((t.title + " " + t.subject).toLowerCase().includes(q)) out.push({ id: "t-" + t._id, type: "Task", label: t.title, sub: `Due ${fmtDate(t.due)}`, tab: "tasks" }); });
    data.notes.forEach((n) => { if ((n.title + " " + n.body + " " + n.tag).toLowerCase().includes(q)) out.push({ id: "n-" + n._id, type: "Note", label: n.title, sub: n.tag || "Note", tab: "notes" }); });
    data.notices.forEach((n) => { if ((n.title + " " + n.body).toLowerCase().includes(q)) out.push({ id: "no-" + n._id, type: "Notice", label: n.title, sub: fmtDate(n.date), tab: "notices" }); });
    data.timetable.forEach((c) => { if ((c.subject + " " + c.room).toLowerCase().includes(q)) out.push({ id: "c-" + c._id, type: "Class", label: c.subject, sub: `${c.day} · ${c.start}`, tab: "timetable" }); });
    return out.slice(0, 20);
  }, [query, data]);

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 border-b sticky top-0 z-40" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
      <div className="flex items-center gap-3 md:hidden">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
          <GraduationCap size={15} color="white" />
        </div>
        <span className="sv-display text-base font-semibold">StudyVault</span>
      </div>
      <div className="hidden md:block text-sm font-medium capitalize" style={{ color: "var(--muted)" }}>
        {NAV.find((n) => n.key === tab)?.label}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => { setSearchOpen((o) => !o); setNotifOpen(false); }} className="sv-btn-ghost w-9 h-9 flex items-center justify-center">
            <Search size={16} />
          </button>
          {searchOpen && (
            <div className="sv-card absolute right-0 mt-2 p-3 sv-anim z-50" style={{ width: "min(320px, calc(100vw - 32px))", maxHeight: 400, overflowY: "auto" }}>
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks, notes, notices, classes…" className="sv-input w-full pl-8 pr-3 py-2 text-sm" />
              </div>
              {query.trim() === "" && <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>Start typing to search everything in StudyVault.</p>}
              {query.trim() !== "" && results.length === 0 && <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>No matches for "{query}".</p>}
              {results.map((r) => (
                <button key={r.id} onClick={() => { setTab(r.tab); setSearchOpen(false); setQuery(""); }} className="w-full text-left py-2 border-t flex items-center justify-between gap-2" style={{ borderColor: "var(--border)" }}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>{r.sub}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={{ background: "var(--surface2)", color: "var(--primary)" }}>{r.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => { setNotifOpen((o) => !o); setSearchOpen(false); }} className="sv-btn-ghost w-9 h-9 flex items-center justify-center relative">
            <Bell size={16} />
            {notifications.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold" style={{ background: "var(--danger)", color: "white" }}>
                {notifications.unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="sv-card absolute right-0 mt-2 p-3 sv-anim z-50" style={{ width: "min(300px, calc(100vw - 32px))", maxHeight: 360, overflowY: "auto" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Notifications</p>
                <button onClick={notifications.markAllRead} className="text-xs font-medium" style={{ color: "var(--primary)" }}>Mark all read</button>
              </div>
              {notifications.items.length === 0 && <p className="text-xs py-4 text-center" style={{ color: "var(--muted)" }}>You're all caught up.</p>}
              {notifications.items.map((n) => (
                <div key={n.id} className="py-2 border-t flex gap-2" style={{ borderColor: "var(--border)" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? "transparent" : "var(--primary)" }} />
                  <div>
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onToggleDarkMode} className="sv-btn-ghost w-9 h-9 flex items-center justify-center">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: user?.avatarColor || "#2F6F4E" }}>
          {(user?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
      </div>
    </div>
  );
}
