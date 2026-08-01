import React, { useState } from "react";
import { ChevronLeft, ChevronRight, PartyPopper, Gift } from "lucide-react";
import Modal from "./common/Modal.jsx";
import Field from "./common/Field.jsx";
import { HOLIDAYS } from "../utils/constants.js";
import { fmtDate } from "../utils/dateUtils.js";
import { useAppData } from "../context/AppDataContext.jsx";

export default function CalendarView({ data, showToast }) {
  const { addCalendarEvent } = useAppData();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ type: "Personal", label: "", priority: "Medium" });

  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(startOffset).fill(null), ...Array(daysInMonth)].map((_, i) => (i < startOffset ? null : i - startOffset + 1));

  const isoFor = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayISO = new Date().toISOString().slice(0, 10);

  const eventsFor = (iso) => data.calendarEvents.filter((e) => e.date === iso);

  const openDay = (d) => { setSelected(isoFor(d)); setForm({ type: "Personal", label: "", priority: "Medium" }); };

  const saveEvent = async () => {
    if (!form.label.trim()) { showToast("Please add a title for this event."); return; }
    try {
      const res = await addCalendarEvent({ date: selected, type: form.type, label: form.label, priority: form.priority });
      showToast(res.task ? "Added to calendar and synced to Tasks" : "Event added to calendar");
      setSelected(null);
    } catch (e) {
      showToast(e.message || "Could not add this event");
    }
  };

  return (
    <div className="sv-card p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
        <p className="font-semibold text-sm sv-display">{cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-[11px] font-semibold" style={{ color: "var(--muted)" }}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = isoFor(d);
          const holiday = HOLIDAYS[iso];
          const events = eventsFor(iso);
          const isToday = iso === todayISO;
          return (
            <button key={i} onClick={() => openDay(d)} className="aspect-square rounded-lg p-1 flex flex-col items-center justify-start text-left"
              style={{ background: isToday ? "var(--primary)" + "1A" : "var(--surface2)", border: isToday ? "1px solid var(--primary)" : "1px solid transparent" }}>
              <span className="text-xs font-medium">{d}</span>
              {holiday && <PartyPopper size={10} style={{ color: "var(--secondary)" }} className="mt-0.5" />}
              {events.length > 0 && <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: "var(--primary)" }} />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[11px]" style={{ color: "var(--muted)" }}>
        <span className="flex items-center gap-1"><PartyPopper size={11} style={{ color: "var(--secondary)" }} /> Holiday</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--primary)" }} /> Event / task</span>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? fmtDate(selected) : ""}>
        {selected && HOLIDAYS[selected] && (
          <div className="sv-card p-3 mb-4 flex items-center gap-2" style={{ background: "var(--surface2)" }}>
            <Gift size={16} style={{ color: "var(--secondary)" }} /> <span className="text-sm font-medium">{HOLIDAYS[selected]} — Holiday</span>
          </div>
        )}
        {selected && eventsFor(selected).map((ev) => (
          <div key={ev._id} className="text-sm py-1.5 border-t" style={{ borderColor: "var(--border)" }}>
            <span className="text-[11px] font-semibold mr-2" style={{ color: "var(--primary)" }}>{ev.type}</span>{ev.label}
          </div>
        ))}
        <div className="mt-4">
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="sv-input w-full px-3 py-2 text-sm">
              <option>Personal</option><option>Task</option>
            </select>
          </Field>
          <Field label="Title"><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Project submission" /></Field>
          {form.type === "Task" && (
            <Field label="Priority">
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="sv-input w-full px-3 py-2 text-sm">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </Field>
          )}
          <button onClick={saveEvent} className="sv-btn-primary w-full py-2.5 text-sm mt-1">
            {form.type === "Task" ? "Add & sync to Tasks" : "Add to calendar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
