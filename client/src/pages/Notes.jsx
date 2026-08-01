import React, { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import Modal from "../components/common/Modal.jsx";
import Field from "../components/common/Field.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useAppData } from "../context/AppDataContext.jsx";

export default function Notes({ data, showToast }) {
  const { addNote, editNote, removeNote } = useAppData();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", tag: "" });

  const openAdd = () => { setForm({ title: "", body: "", tag: "" }); setModal({ mode: "add" }); };
  const openEdit = (n) => { setForm(n); setModal({ mode: "edit", note: n }); };

  const save = async () => {
    if (!form.title.trim()) { showToast("Please enter a title."); return; }
    try {
      if (modal.mode === "add") await addNote(form);
      else await editNote(form._id, form);
      showToast(modal.mode === "add" ? "Note created" : "Note updated");
      setModal(null);
    } catch (e) {
      showToast(e.message || "Could not save this note");
    }
  };

  const remove = async (id) => {
    try { await removeNote(id); }
    catch (e) { showToast(e.message || "Could not delete this note"); }
  };

  const filtered = data.notes.filter((n) => (n.title + n.body + n.tag).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sv-anim">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes…" className="sv-input w-full pl-9 pr-3 py-2 text-sm" />
        </div>
        <button onClick={openAdd} className="sv-btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Plus size={15} /> New note</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((n) => (
          <div key={n._id} className="sv-card p-4 cursor-pointer" onClick={() => openEdit(n)}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold">{n.title}</p>
              <button onClick={(e) => { e.stopPropagation(); remove(n._id); }}><Trash2 size={13} style={{ color: "var(--danger)" }} /></button>
            </div>
            <p className="text-xs whitespace-pre-line line-clamp-4" style={{ color: "var(--muted)" }}>{n.body}</p>
            {n.tag && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-2 inline-block" style={{ background: "var(--surface2)", color: "var(--primary)" }}>{n.tag}</span>}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full"><EmptyState emoji="📝" text="No notes yet — jot something down." /></div>}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === "add" ? "New note" : "Edit note"} wide>
        <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        <Field label="Subject tag"><input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Operating Systems" /></Field>
        <Field label="Content"><textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={8} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        <button onClick={save} className="sv-btn-primary w-full py-2.5 text-sm mt-1">Save note</button>
      </Modal>
    </div>
  );
}
