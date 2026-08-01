import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import EmptyState from "../components/common/EmptyState.jsx";
import { useAppData } from "../context/AppDataContext.jsx";

export default function Attendance({ data, showToast }) {
  const { markAttendance } = useAppData();

  const mark = async (subject, present) => {
    try { await markAttendance(subject, present); showToast(present ? "Marked present" : "Marked absent"); }
    catch (e) { showToast(e.message || "Could not mark attendance"); }
  };

  const p = data.attendance.reduce((s, a) => s + a.present, 0);
  const t = data.attendance.reduce((s, a) => s + a.total, 0);
  const pieData = [{ name: "Present", value: p }, { name: "Absent", value: t - p }];
  const barData = data.attendance.map((a) => ({ subject: a.subject.split(" ")[0], pct: a.total ? Math.round((a.present / a.total) * 100) : 100 }));

  const tooltipStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--ink)" };
  const tooltipTextStyle = { color: "var(--ink)" };

  return (
    <div className="sv-anim">
      {data.attendance.length === 0 ? (
        <EmptyState emoji="🗓️" text="No subjects tracked yet — attendance you mark will show up here." />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div className="sv-card p-5">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>OVERALL PRESENT VS ABSENT</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    <Cell fill="var(--primary)" /><Cell fill="var(--danger)" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--ink)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="sv-card p-5">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>ATTENDANCE % BY SUBJECT</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipTextStyle} itemStyle={tooltipTextStyle} />
                  <Bar dataKey="pct" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {data.attendance.map((a) => {
              const pct = a.total ? (a.present / a.total) * 100 : 100;
              const color = pct >= 75 ? "var(--primary)" : pct >= 65 ? "var(--secondary)" : "var(--danger)";
              return (
                <div key={a._id} className="sv-card p-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-sm font-medium mb-1">{a.subject}</p>
                    <div className="w-full h-2 rounded-full" style={{ background: "var(--surface2)" }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>{a.present}/{a.total} classes · <span style={{ color }}>{pct.toFixed(1)}%</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => mark(a.subject, true)} className="sv-btn-primary px-3 py-1.5 text-xs">Present today</button>
                    <button onClick={() => mark(a.subject, false)} className="sv-btn-ghost px-3 py-1.5 text-xs">Absent today</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AddSubject onAdd={mark} />
    </div>
  );
}

function AddSubject({ onAdd }) {
  const [subject, setSubject] = React.useState("");
  return (
    <div className="sv-card p-4 mt-4 flex flex-wrap items-center gap-3">
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Track a new subject (e.g. Computer Networks)" className="sv-input flex-1 min-w-[200px] px-3 py-2 text-sm" />
      <button
        onClick={() => { if (subject.trim()) { onAdd(subject.trim(), true); setSubject(""); } }}
        className="sv-btn-primary px-4 py-2 text-sm"
      >
        Start tracking
      </button>
    </div>
  );
}
