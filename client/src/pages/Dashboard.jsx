import React, { useState, useEffect } from "react";
import { ClipboardCheck, CheckSquare, Flame, TrendingUp, Clock, Megaphone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../components/common/StatCard.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { DAYS } from "../utils/constants.js";
import { todayISO, timeGreeting, getNextClass, formatCountdown } from "../utils/dateUtils.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard({ data }) {
  const { user } = useAuth();
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 60000); return () => clearInterval(id); }, []);

  const jsDay = new Date().getDay();
  const todayName = DAYS[jsDay === 0 ? 5 : jsDay - 1] || "Mon";
  const todayClasses = data.timetable.filter((c) => c.day === todayName).sort((a, b) => a.start.localeCompare(b.start));
  const nextClass = getNextClass(data.timetable);
  const todayLabel = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const pendingToday = data.tasks.filter((t) => t.status !== "done" && t.due === todayISO()).length;

  const overallAttendance = (() => {
    const p = data.attendance.reduce((s, a) => s + a.present, 0);
    const t = data.attendance.reduce((s, a) => s + a.total, 0);
    return t ? ((p / t) * 100).toFixed(1) : "100.0";
  })();

  const taskTrend = [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
    const count = data.tasks.filter((t) => t.status === "done" && t.due === d).length;
    return { day: d.slice(5), done: count };
  });

  const streaks = user?.streaks || { current: 0, best: 0 };

  return (
    <div className="sv-anim">
      <h1 className="sv-display text-2xl md:text-3xl font-semibold mb-1">{timeGreeting()}, {(user?.name || "Student").split(" ")[0]} 👋</h1>
      <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>{todayLabel}{user?.semester ? ` · ${user.semester}` : ""}</p>
      <p className="text-sm mb-6 flex items-center gap-1.5" style={{ color: nextClass ? "var(--primary)" : "var(--muted)" }}>
        <Clock size={14} />
        {nextClass ? <>Next Class: <strong>{nextClass.class.subject}</strong> · {formatCountdown(nextClass)}</> : "No more classes scheduled — enjoy the free time!"}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ClipboardCheck} label="Overall attendance" value={`${overallAttendance}%`} color={overallAttendance < 75 ? "var(--danger)" : "var(--primary)"} />
        <StatCard icon={CheckSquare} label="Tasks due today" value={pendingToday} color="var(--secondary)" />
        <StatCard icon={Flame} label="Current streak" value={`${streaks.current}d`} color="#E8654F" />
        <StatCard icon={TrendingUp} label="Best streak" value={`${streaks.best}d`} color="#7C6FD1" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="sv-card p-5 lg:col-span-1">
          <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--muted)" }}><Clock size={13} /> TODAY'S SCHEDULE</p>
          {todayClasses.length === 0 && <EmptyState emoji="🎈" text="No classes today — enjoy!" />}
          {todayClasses.map((c) => (
            <div key={c._id} className="flex items-center gap-3 py-2.5 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="w-2 h-9 rounded-full shrink-0" style={{ background: c.color }} />
              <div className="min-w-0">
                <p className="sv-mono text-[11px]" style={{ color: "var(--muted)" }}>{c.start} – {c.end}</p>
                <p className="text-sm font-medium truncate">{c.subject}</p>
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>{c.room}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sv-card p-5 lg:col-span-2">
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>TASKS COMPLETED — LAST 7 DAYS</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={taskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--ink)" }} labelStyle={{ color: "var(--ink)" }} itemStyle={{ color: "var(--ink)" }} />
              <Bar dataKey="done" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="sv-card p-5">
          <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--muted)" }}><Megaphone size={13} /> LATEST NOTICES</p>
          {data.notices.slice(0, 3).map((n) => (
            <div key={n._id} className="py-2 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{n.date}</p>
            </div>
          ))}
          {data.notices.length === 0 && <EmptyState emoji="📣" text="No notices yet — check back soon." />}
        </div>
        <div className="sv-card p-5">
          <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--muted)" }}><Flame size={13} /> PRODUCTIVITY STREAK</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="sv-display text-4xl font-semibold">{streaks.current}</span>
            <span className="text-sm mb-1" style={{ color: "var(--muted)" }}>days in a row</span>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Complete at least one task each day to keep your streak alive. Best so far: {streaks.best} days.</p>
        </div>
      </div>
    </div>
  );
}
