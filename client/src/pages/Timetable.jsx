import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../components/common/Modal.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import Field from "../components/common/Field.jsx";
import CalendarView from "../components/CalendarView.jsx";
import { DAYS, SUBJECT_COLORS } from "../utils/constants.js";
import { useAppData } from "../context/AppDataContext.jsx";

export default function Timetable({ data, showToast }) {
  const { addClass, editClass, removeClass } = useAppData();
  const [view, setView] = useState("weekly");
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', entry}
  const [pendingSave, setPendingSave] = useState(null);
  const [form, setForm] = useState({ day: "Mon", start: "09:00", end: "10:00", subject: "", room: "", color: SUBJECT_COLORS[0].hex });

  const openAdd = () => { setForm({ day: "Mon", start: "09:00", end: "10:00", subject: "", room: "", color: SUBJECT_COLORS[0].hex }); setModal({ mode: "add" }); };
  const openEdit = (entry) => { setForm(entry); setModal({ mode: "edit", entry }); };

  const requestSave = () => {
    if (!form.subject.trim()) { showToast("Please enter a subject name."); return; }
    setPendingSave({ ...form });
  };

  const confirmSave = async () => {
    try {
      if (modal.mode === "add") await addClass(pendingSave);
      else await editClass(pendingSave._id, pendingSave);
      showToast(modal.mode === "add" ? "Class added to timetable" : "Class updated");
    } catch (e) {
      showToast(e.message || "Could not save this class");
    }
    setPendingSave(null); setModal(null);
  };

  const remove = async (id) => {
    try { await removeClass(id); showToast("Class removed"); }
    catch (e) { showToast(e.message || "Could not remove this class"); }
  };

  return (
    <div className="sv-anim">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--surface2)" }}>
          {["weekly", "calendar"].map((v) => (
            <button key={v} onClick={() => setView(v)} className="px-4 py-1.5 text-sm font-medium rounded-lg capitalize"
              style={{ background: view === v ? "var(--surface)" : "transparent", boxShadow: view === v ? "var(--shadow)" : "none" }}>{v}</button>
          ))}
        </div>
        {view === "weekly" && <button onClick={openAdd} className="sv-btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={15} /> Add class</button>}
      </div>

      {view === "weekly" ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <div key={day} className="sv-card p-4">
              <p className="text-sm font-semibold mb-3">{day}</p>
              {data.timetable.filter((c) => c.day === day).sort((a, b) => a.start.localeCompare(b.start)).map((c) => (
                <div key={c._id} className="flex items-center gap-2 py-2 border-t group" style={{ borderColor: "var(--border)" }}>
                  <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: c.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="sv-mono text-[11px]" style={{ color: "var(--muted)" }}>{c.start}–{c.end}</p>
                    <p className="text-sm font-medium truncate">{c.subject}</p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>{c.room}</p>
                  </div>
                  <button onClick={() => openEdit(c)}><Pencil size={13} style={{ color: "var(--muted)" }} /></button>
                  <button onClick={() => remove(c._id)}><Trash2 size={13} style={{ color: "var(--danger)" }} /></button>
                </div>
              ))}
              {data.timetable.filter((c) => c.day === day).length === 0 && <p className="text-xs py-3" style={{ color: "var(--muted)" }}>Free day 🎈</p>}
            </div>
          ))}
        </div>
      ) : <CalendarView data={data} showToast={showToast} />}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add class" : "Edit class"}>
        <Field label="Day">
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="sv-input w-full px-3 py-2 text-sm">
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start time"><input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" /></Field>
          <Field label="End time"><input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        </div>
        <Field label="Subject"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Data Structures" /></Field>
        <Field label="Room"><input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. CS-101" /></Field>
        <Field label="Color tag">
          <div className="flex gap-2">
            {SUBJECT_COLORS.map((c) => (
              <button key={c.hex} onClick={() => setForm({ ...form, color: c.hex })} className="w-7 h-7 rounded-full" style={{ background: c.hex, outline: form.color === c.hex ? "2px solid var(--ink)" : "none", outlineOffset: 2 }} />
            ))}
          </div>
        </Field>
        <button onClick={requestSave} className="sv-btn-primary w-full py-2.5 text-sm mt-2">Save class</button>
      </Modal>

      <ConfirmModal open={!!pendingSave} title="Save changes to timetable?" body="This will update your class schedule. Do you want to continue?" onConfirm={confirmSave} onCancel={() => setPendingSave(null)} />
    </div>
  );
}
