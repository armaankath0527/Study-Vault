import React, { useState } from "react";
import Field from "../components/common/Field.jsx";
import { SUBJECT_COLORS } from "../utils/constants.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useDarkMode } from "../hooks/useDarkMode.js";
import { profileService } from "../services/profileService.js";

export default function Profile({ showToast }) {
  const { user, updateUserLocal } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [year, setYear] = useState(user?.year || "");
  const [semester, setSemester] = useState(user?.semester || "");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await profileService.update({ name, email, year, semester });
      updateUserLocal(updated);
      showToast("Profile updated");
    } catch (e) {
      showToast(e.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const setAvatarColor = async (hex) => {
    updateUserLocal({ avatarColor: hex });
    try { await profileService.update({ avatarColor: hex }); }
    catch (e) { showToast(e.message || "Could not update avatar color"); }
  };

  const changePassword = async () => {
    if (!curPw || !newPw) { showToast("Fill in both password fields."); return; }
    if (newPw.length < 6) { showToast("New password must be at least 6 characters."); return; }
    try {
      await profileService.changePassword({ currentPassword: curPw, newPassword: newPw });
      setCurPw(""); setNewPw("");
      showToast("Password changed successfully");
    } catch (e) {
      showToast(e.message || "Could not change password");
    }
  };

  const handleToggleDarkMode = async () => {
    try { await toggleDarkMode(); }
    catch { showToast("Could not save theme preference"); }
  };

  return (
    <div className="sv-anim grid md:grid-cols-2 gap-5">
      <div className="sv-card p-5">
        <p className="text-sm font-semibold mb-4">Profile details</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: user?.avatarColor || "#2F6F4E" }}>
            {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div className="flex gap-1.5">
            {SUBJECT_COLORS.concat([{ hex: "#2F6F4E" }]).map((c) => (
              <button key={c.hex} onClick={() => setAvatarColor(c.hex)} className="w-6 h-6 rounded-full" style={{ background: c.hex, outline: user?.avatarColor === c.hex ? "2px solid var(--ink)" : "none", outlineOffset: 2 }} />
            ))}
          </div>
        </div>
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        <Field label="Year / branch"><input value={year} onChange={(e) => setYear(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" /></Field>
        <Field label="Current semester"><input value={semester} onChange={(e) => setSemester(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" placeholder="e.g. Semester 6" /></Field>
        <button onClick={saveProfile} disabled={saving} className="sv-btn-primary w-full py-2.5 text-sm mt-1" style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="sv-card p-5">
          <p className="text-sm font-semibold mb-4">Change password</p>
          <Field label="Current password"><input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" /></Field>
          <Field label="New password"><input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" /></Field>
          <button onClick={changePassword} className="sv-btn-primary w-full py-2.5 text-sm mt-1">Update password</button>
        </div>
        <div className="sv-card p-5">
          <p className="text-sm font-semibold mb-4">Preferences</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Dark mode</span>
            <button onClick={handleToggleDarkMode} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: darkMode ? "var(--primary)" : "var(--border)" }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: darkMode ? 22 : 2 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
