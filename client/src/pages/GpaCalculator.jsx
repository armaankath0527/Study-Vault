import React, { useState, useEffect, useRef, useMemo } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { GRADE_POINTS } from "../utils/constants.js";
import { marksToGrade } from "../utils/gradeUtils.js";
import { useAppData } from "../context/AppDataContext.jsx";

export default function GpaCalculator({ showToast }) {
  const { data, addSemester, editSemester, removeSemester } = useAppData();
  const [semesters, setSemesters] = useState(data.gpa);
  const debounceTimers = useRef({});

  // Re-sync local draft whenever the number of semesters changes on the server
  // (e.g. after add/remove), without clobbering in-progress edits.
  useEffect(() => {
    if (semesters.length !== data.gpa.length) setSemesters(data.gpa);
  }, [data.gpa]); // eslint-disable-line react-hooks/exhaustive-deps

  const coursePct = (c) => {
    const max = Number(c.maxMarks) > 0 ? Number(c.maxMarks) : 100;
    const obtained = Number(c.marks) || 0;
    return Math.max(0, Math.min(100, (obtained / max) * 100));
  };
  const calcSGPA = (courses) => {
    const valid = courses.filter((c) => Number(c.credits) > 0);
    const totalCredits = valid.reduce((s, c) => s + Number(c.credits || 0), 0);
    const totalPoints = valid.reduce((s, c) => s + Number(c.credits || 0) * GRADE_POINTS[marksToGrade(coursePct(c))], 0);
    return totalCredits ? totalPoints / totalCredits : 0;
  };

  const cgpa = useMemo(() => calcSGPA(semesters.flatMap((s) => s.courses)), [semesters]);
  const trendData = semesters.map((s) => ({ name: s.name.replace("Semester ", "S"), sgpa: Number(calcSGPA(s.courses).toFixed(2)) }));

  const persist = (semId, patch) => {
    if (debounceTimers.current[semId]) clearTimeout(debounceTimers.current[semId]);
    debounceTimers.current[semId] = setTimeout(async () => {
      try { await editSemester(semId, patch); }
      catch (e) { showToast(e.message || "Could not save GPA changes"); }
    }, 600);
  };

  const patchLocal = (semId, updater) => {
    setSemesters((prev) => prev.map((s) => (s._id === semId ? updater(s) : s)));
  };

  const handleAddSemester = async () => {
    try { await addSemester({ name: `Semester ${semesters.length + 1}`, courses: [] }); }
    catch (e) { showToast(e.message || "Could not add semester"); }
  };
  const handleRemoveSemester = async (id) => {
    try { await removeSemester(id); }
    catch (e) { showToast(e.message || "Could not remove semester"); }
  };

  const addCourse = (semId) => {
    patchLocal(semId, (s) => {
      const courses = [...s.courses, { _id: `tmp-${Date.now()}`, name: "", credits: 3, marks: 0, maxMarks: 100 }];
      persist(semId, { courses });
      return { ...s, courses };
    });
  };
  const updateCourse = (semId, courseId, field, value) => {
    patchLocal(semId, (s) => {
      const courses = s.courses.map((c) => (c._id === courseId ? { ...c, [field]: value } : c));
      persist(semId, { courses });
      return { ...s, courses };
    });
  };
  const removeCourse = (semId, courseId) => {
    patchLocal(semId, (s) => {
      const courses = s.courses.filter((c) => c._id !== courseId);
      persist(semId, { courses });
      return { ...s, courses };
    });
  };
  const renameSemester = (semId, name) => {
    patchLocal(semId, (s) => { persist(semId, { name }); return { ...s, name }; });
  };

  return (
    <div className="sv-anim">
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="sv-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary)" + "1F" }}>
            <Calculator size={26} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <p className="sv-display text-3xl font-semibold">{cgpa.toFixed(2)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Cumulative CGPA (10-point scale)</p>
          </div>
        </div>
        <div className="sv-card p-5">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>SGPA TREND</p>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={trendData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--ink)" }} labelStyle={{ color: "var(--ink)" }} itemStyle={{ color: "var(--ink)" }} />
              <Line type="monotone" dataKey="sgpa" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {semesters.map((sem) => (
          <div key={sem._id} className="sv-card p-4">
            <div className="flex items-center justify-between mb-3">
              <input value={sem.name} onChange={(e) => renameSemester(sem._id, e.target.value)} className="sv-input px-2 py-1 text-sm font-semibold" style={{ width: 160 }} />
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>SGPA {calcSGPA(sem.courses).toFixed(2)}</span>
                <button onClick={() => handleRemoveSemester(sem._id)}><Trash2 size={14} style={{ color: "var(--danger)" }} /></button>
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-[1fr_70px_90px_90px_60px_28px] gap-2 px-1 mb-1">
              {["Course", "Credits", "Marks", "Out of", "Grade", ""].map((h) => (
                <span key={h} className="text-[10px] font-semibold uppercase" style={{ color: "var(--muted)" }}>{h}</span>
              ))}
            </div>
            {sem.courses.map((c) => {
              const pct = coursePct(c);
              const grade = marksToGrade(pct);
              return (
                <div key={c._id} className="grid grid-cols-2 sm:grid-cols-[1fr_70px_90px_90px_60px_28px] gap-2 py-1.5 items-center">
                  <input value={c.name} onChange={(e) => updateCourse(sem._id, c._id, "name", e.target.value)} placeholder="Course name" className="sv-input px-2 py-1.5 text-sm col-span-2 sm:col-span-1" />
                  <input type="number" min="1" max="6" value={c.credits} onChange={(e) => updateCourse(sem._id, c._id, "credits", e.target.value)} className="sv-input px-2 py-1.5 text-sm" placeholder="Credits" title="Credits" />
                  <input type="number" min="0" value={c.marks} onChange={(e) => updateCourse(sem._id, c._id, "marks", e.target.value)} className="sv-input px-2 py-1.5 text-sm" placeholder="Marks" title="Marks obtained" />
                  <input type="number" min="1" value={c.maxMarks} onChange={(e) => updateCourse(sem._id, c._id, "maxMarks", e.target.value)} className="sv-input px-2 py-1.5 text-sm" placeholder="Max marks" title="Maximum marks" />
                  <span className="text-xs font-semibold text-center px-1.5 py-1.5 rounded-lg" style={{ background: "var(--surface2)", color: "var(--primary)" }} title={`${pct.toFixed(1)}%`}>{grade}</span>
                  <button onClick={() => removeCourse(sem._id, c._id)} className="justify-self-center"><Trash2 size={13} style={{ color: "var(--danger)" }} /></button>
                </div>
              );
            })}
            <button onClick={() => addCourse(sem._id)} className="sv-btn-ghost px-3 py-1.5 text-xs mt-2 flex items-center gap-1"><Plus size={12} /> Add course</button>
            <p className="text-[11px] mt-2" style={{ color: "var(--muted)" }}>Grade is calculated automatically from marks: 90%+ = O, 80–89% = A+, 70–79% = A, 60–69% = B+, 50–59% = B, 40–49% = C, below 40% = F.</p>
          </div>
        ))}
        <button onClick={handleAddSemester} className="sv-btn-primary px-4 py-2 text-sm self-start flex items-center gap-1.5"><Plus size={15} /> Add semester</button>
      </div>
    </div>
  );
}
