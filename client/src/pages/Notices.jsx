import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Field from "../components/common/Field.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { fmtDate } from "../utils/dateUtils.js";
import { useAppData } from "../context/AppDataContext.jsx";

export default function Notices({ data, showToast }) {
  const { addNotice, removeNotice } = useAppData();
  const [form, setForm] = useState({ title: "", body: "", pinned: false });

  const post = async () => {
    if (!form.title.trim()) { showToast("Please add a title."); return; }
    try {
      await addNotice(form);
      showToast("Notice posted");
      setForm({ title: "", body: "", pinned: false });
    } catch (e) {
      showToast(e.message || "Could not post this notice");
    }
  };

  const remove = async (id) => {
    try { await removeNotice(id); }
    catch (e) { showToast(e.message || "Could not remove this notice"); }
  };

  const sorted = [...data.notices].sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date));

  return (
    <div className="sv-anim grid md:grid-cols-3 gap-5">
      <div className="sv-card p-4 md:col-span-1 h-fit">
        <p className="text-sm font-semibold mb-3">Post a notice</p>
        <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Workshop on Friday" /></Field>
        <Field label="Details"><textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className="sv-input w-full px-3 py-2 text-sm" placeholder="Add details students should know" /></Field>
        <label className="flex items-center gap-2 mb-3 text-sm"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin to top</label>
        <button onClick={post} className="sv-btn-primary w-full py-2 text-sm">Post notice</button>
      </div>
      <div className="md:col-span-2 flex flex-col gap-3">
        {sorted.map((n) => (
          <div key={n._id} className="sv-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {n.pinned && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--secondary)" + "22", color: "var(--secondary)" }}>PINNED</span>}
                  <p className="text-sm font-semibold">{n.title}</p>
                </div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{n.body}</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>{fmtDate(n.date)}</p>
              </div>
              <button onClick={() => remove(n._id)}><Trash2 size={14} style={{ color: "var(--danger)" }} /></button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <EmptyState emoji="📣" text="No notices yet — check back soon." />}
      </div>
    </div>
  );
}
