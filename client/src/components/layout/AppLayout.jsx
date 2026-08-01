import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import Topbar from "./Topbar.jsx";
import Toast from "../common/Toast.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useNotifications } from "../../hooks/useNotifications.js";
import { useToast } from "../../hooks/useToast.js";
import { useBodyBackground } from "../../hooks/useBodyBackground.js";
import { useDarkMode } from "../../hooks/useDarkMode.js";

import Dashboard from "../../pages/Dashboard.jsx";
import Timetable from "../../pages/Timetable.jsx";
import Tasks from "../../pages/Tasks.jsx";
import Attendance from "../../pages/Attendance.jsx";
import Notices from "../../pages/Notices.jsx";
import Notes from "../../pages/Notes.jsx";
import GpaCalculator from "../../pages/GpaCalculator.jsx";
import Faculty from "../../pages/Faculty.jsx";
import Profile from "../../pages/Profile.jsx";

export default function AppLayout() {
  const { data } = useAppData();
  const [tab, setTab] = useState("dashboard");
  const notifications = useNotifications();
  const { toast, showToast } = useToast();
  const { darkMode, toggleDarkMode } = useDarkMode();

  useBodyBackground(darkMode ? "#000000" : "#F3F5F1");

  const handleToggleDarkMode = async () => {
    try { await toggleDarkMode(); }
    catch { showToast("Could not save theme preference"); }
  };

  const pageProps = { data, showToast };

  return (
    <div className="sv-root min-h-screen" data-theme={darkMode ? "dark" : "light"}>
      <Toast toast={toast} />
      <div className="flex">
        <Sidebar tab={tab} setTab={setTab} />
        <div className="flex-1 min-w-0 sv-content-pad">
          <Topbar tab={tab} darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} notifications={notifications} setTab={setTab} />
          <div className="p-5 max-w-5xl">
            {tab === "dashboard" && <Dashboard {...pageProps} />}
            {tab === "timetable" && <Timetable {...pageProps} />}
            {tab === "tasks" && <Tasks {...pageProps} />}
            {tab === "attendance" && <Attendance {...pageProps} />}
            {tab === "notices" && <Notices {...pageProps} />}
            {tab === "notes" && <Notes {...pageProps} />}
            {tab === "gpa" && <GpaCalculator {...pageProps} />}
            {tab === "faculty" && <Faculty />}
            {tab === "profile" && <Profile {...pageProps} />}
          </div>
        </div>
      </div>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
