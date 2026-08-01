import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { dashboardService } from "../services/dashboardService.js";
import { taskService } from "../services/taskService.js";
import { timetableService } from "../services/timetableService.js";
import { attendanceService } from "../services/attendanceService.js";
import { noteService } from "../services/noteService.js";
import { noticeService } from "../services/noticeService.js";
import { calendarService } from "../services/calendarService.js";
import { gpaService } from "../services/gpaService.js";

const AppDataContext = createContext(null);

const emptySnapshot = {
  tasks: [], timetable: [], attendance: [], notices: [], notes: [], gpa: [], calendarEvents: [],
};

export function AppDataProvider({ children }) {
  const { user, token } = useAuth();
  const [data, setData] = useState(emptySnapshot);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const reload = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);
    setDataError("");
    try {
      const snapshot = await dashboardService.getSnapshot();
      setData({
        tasks: snapshot.tasks,
        timetable: snapshot.timetable,
        attendance: snapshot.attendance,
        notices: snapshot.notices,
        notes: snapshot.notes,
        gpa: snapshot.gpa,
        calendarEvents: snapshot.calendarEvents,
      });
    } catch (err) {
      setDataError(err.message);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) reload(); else setData(emptySnapshot);
  }, [user, reload]);

  /* ---------------- Tasks ---------------- */
  const addTask = useCallback(async (payload) => {
    const task = await taskService.create(payload);
    setData((d) => ({ ...d, tasks: [...d.tasks, task] }));
    return task;
  }, []);
  const editTask = useCallback(async (id, payload) => {
    const res = await taskService.update(id, payload);
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t._id === id ? res.data : t)) }));
    return res; // includes updated streaks when a task transitions to done
  }, []);
  const removeTask = useCallback(async (id) => {
    await taskService.remove(id);
    setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t._id !== id) }));
  }, []);

  /* ---------------- Timetable ---------------- */
  const addClass = useCallback(async (payload) => {
    const entry = await timetableService.create(payload);
    setData((d) => ({ ...d, timetable: [...d.timetable, entry] }));
    return entry;
  }, []);
  const editClass = useCallback(async (id, payload) => {
    const entry = await timetableService.update(id, payload);
    setData((d) => ({ ...d, timetable: d.timetable.map((c) => (c._id === id ? entry : c)) }));
    return entry;
  }, []);
  const removeClass = useCallback(async (id) => {
    await timetableService.remove(id);
    setData((d) => ({ ...d, timetable: d.timetable.filter((c) => c._id !== id) }));
  }, []);

  /* ---------------- Attendance ---------------- */
  const markAttendance = useCallback(async (subject, present) => {
    const res = await attendanceService.mark(subject, present);
    setData((d) => {
      const exists = d.attendance.some((s) => s.subject === subject);
      const nextSubjects = exists
        ? d.attendance.map((s) => (s.subject === subject ? res.subject : s))
        : [...d.attendance, res.subject];
      return { ...d, attendance: nextSubjects };
    });
    return res;
  }, []);

  /* ---------------- Notes ---------------- */
  const addNote = useCallback(async (payload) => {
    const note = await noteService.create(payload);
    setData((d) => ({ ...d, notes: [note, ...d.notes] }));
    return note;
  }, []);
  const editNote = useCallback(async (id, payload) => {
    const note = await noteService.update(id, payload);
    setData((d) => ({ ...d, notes: d.notes.map((n) => (n._id === id ? note : n)) }));
    return note;
  }, []);
  const removeNote = useCallback(async (id) => {
    await noteService.remove(id);
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n._id !== id) }));
  }, []);

  /* ---------------- Notices ---------------- */
  const addNotice = useCallback(async (payload) => {
    const notice = await noticeService.create(payload);
    setData((d) => ({ ...d, notices: [notice, ...d.notices] }));
    return notice;
  }, []);
  const removeNotice = useCallback(async (id) => {
    await noticeService.remove(id);
    setData((d) => ({ ...d, notices: d.notices.filter((n) => n._id !== id) }));
  }, []);

  /* ---------------- Calendar ---------------- */
  const addCalendarEvent = useCallback(async (payload) => {
    const res = await calendarService.create(payload);
    setData((d) => ({
      ...d,
      calendarEvents: [...d.calendarEvents, res.event],
      tasks: res.task ? [...d.tasks, res.task] : d.tasks,
    }));
    return res;
  }, []);

  /* ---------------- GPA ---------------- */
  const addSemester = useCallback(async (payload) => {
    const semester = await gpaService.create(payload);
    setData((d) => ({ ...d, gpa: [...d.gpa, semester] }));
    return semester;
  }, []);
  const editSemester = useCallback(async (id, payload) => {
    const semester = await gpaService.update(id, payload);
    setData((d) => ({ ...d, gpa: d.gpa.map((s) => (s._id === id ? semester : s)) }));
    return semester;
  }, []);
  const removeSemester = useCallback(async (id) => {
    await gpaService.remove(id);
    setData((d) => ({ ...d, gpa: d.gpa.filter((s) => s._id !== id) }));
  }, []);

  const value = {
    data, dataLoading, dataError, reload,
    addTask, editTask, removeTask,
    addClass, editClass, removeClass,
    markAttendance,
    addNote, editNote, removeNote,
    addNotice, removeNotice,
    addCalendarEvent,
    addSemester, editSemester, removeSemester,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within an AppDataProvider");
  return ctx;
}
