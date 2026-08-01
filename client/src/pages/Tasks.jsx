import React, { useState } from "react";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import Modal from "../components/common/Modal.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import Field from "../components/common/Field.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import PriorityBadge from "../components/common/PriorityBadge.jsx";
import { todayISO } from "../utils/dateUtils.js";
import { fmtDate } from "../utils/dateUtils.js";
import { useAppData } from "../context/AppDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Tasks({ data, showToast }) {
  const { addTask, editTask, removeTask } = useAppData();
  const { updateUserLocal } = useAuth();
  const [filter, setFilter] = useState("All");
  const [confirming, setConfirming] = useState(null); // task id awaiting "mark done" confirm
  const [modal, setModal] = useState(null);
  const [pendingSave, setPendingSave] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", due: todayISO(), priority: "Medium" });

  const openAdd = () => { setForm({ title: "", subject: "", due: todayISO(), priority: "Medium" }); setModal({ mode: "add" }); };
  const openEdit = (t) => { setForm(t); setModal({ mode: "edit", task: t }); };

  const requestSave = () => {
    if (!form.title.trim()) { showToast("Please enter a task title."); return; }
    setPendingSave({ ...form });
  };

  const confirmSave = async () => {
    try {
      if (modal.mode === "add") await addTask(pendingSave);
      else await editTask(pendingSave._id, pendingSave);
      showToast(modal.mode === "add" ? "Task added" : "Task updated");
    } catch (e) {
      showToast(e.message || "Could not save this task");
    }
    setPendingSave(null); setModal(null);
  };

  const remove = async (id) => {
    try { await removeTask(id); showToast("Task deleted"); }
    catch (e) { showToast(e.message || "Could not delete this task"); }
  };

  const toggleCheck = (id) => setConfirming(confirming === id ? null : id);

  const confirmDone = async (id) => {
    try {
      const res = await editTask(id, { status: "done" });
      if (res.streaks) updateUserLocal({ streaks: res.streaks });
      showToast("Task marked as done 🎉");
    } catch (e) {
      showToast(e.message || "Could not update this task");
    }
    setConfirming(null);
  };

  const undoDone = async (id) => {
    try { await editTask(id, { status: "pending" }); showToast("Task reopened"); }
    catch (e) { showToast(e.message || "Could not update this task"); }
  };

  const filtered = data.tasks.filter((t) => {
    if (filter === "Pending") return t.status !== "done";
    if (filter === "Completed") return t.status === "done";
    if (filter === "Overdue") return t.status !== "done" && t.due < todayISO();
    return true;
  }).sort((a, b) => a.due.localeCompare(b.due));

  const doneCount = data.tasks.filter((t) => t.status === "done").length;
  const progress = data.tasks.length ? Math.round((doneCount / data.tasks.length) * 100) : 0;

  return (
    <div className="sv-anim">
      <div className="sv-card p-4 mb-5">
        <div className="flex justify-between text-sm mb-2"><span className="font-medium">Overall progress</span><span style={{ color: "var(--muted)" }}>{doneCount}/{data.tasks.length} done</span></div>
        <div className="w-full h-2 rounded-full" style={{ background: "var(--surface2)" }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--primary)" }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--surface2)" }}>
          {["All", "Pending", "Completed", "Overdue"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg"
              style={{ background: filter === f ? "var(--surface)" : "transparent", boxShadow: filter === f ? "var(--shadow)" : "none" }}>{f}</button>
          ))}
        </div>
        <button onClick={openAdd} className="sv-btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={15} /> Add task</button>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((t) => {
          const overdue = t.status !== "done" && t.due < todayISO();
          return (
            <div key={t._id} className="sv-card p-3.5 flex items-center gap-3">
              <button onClick={() => (t.status === "done" ? undoDone(t._id) : toggleCheck(t._id))}
                className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
                style={{ borderColor: t.status === "done" ? "var(--primary)" : "var(--border)", background: t.status === "done" ? "var(--primary)" : "transparent" }}>
                {t.status === "done" && <Check size={13} color="white" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? "var(--muted)" : "var(--ink)" }}>{t.title}</p>
                <p className="text-[11px] flex items-center gap-2" style={{ color: overdue ? "var(--danger)" : "var(--muted)" }}>
                  {t.subject} · Due {fmtDate(t.due)} {overdue && "· Overdue"}
                </p>
              </div>
              <PriorityBadge priority={t.priority} />
              {confirming === t._id && (
                <button onClick={() => confirmDone(t._id)} className="sv-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Check size={12} /> Done</button>
              )}
              <button onClick={() => openEdit(t)}><Pencil size={14} style={{ color: "var(--muted)" }} /></button>
              <button onClick={() => remove(t._id)}><Trash2 size={14} style={{ color: "var(--danger)" }} /></button>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState emoji="📖" text="Looks like you're all caught up." />}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "Add task" : "Edit task"}>
        <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Submit lab report" /></Field>
        <Field label="Subject"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Database Systems" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Due date"><input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" /></Field>
          <Field label="Priority">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="sv-input w-full px-3 py-2 text-sm">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </Field>
        </div>
        <button onClick={requestSave} className="sv-btn-primary w-full py-2.5 text-sm mt-2">Save task</button>
      </Modal>

      <ConfirmModal open={!!pendingSave} title="Save changes to this task?" body="Your task list will be updated. Do you want to continue?" onConfirm={confirmSave} onCancel={() => setPendingSave(null)} />
    </div>
  );
}
