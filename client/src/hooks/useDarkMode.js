import { useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { profileService } from "../services/profileService.js";

// Shared dark-mode toggle logic used by both the Topbar and the Profile page,
// with an optimistic update that rolls back if the save fails.
export function useDarkMode() {
  const { user, updateUserLocal } = useAuth();
  const darkMode = !!user?.darkMode;

  const toggleDarkMode = useCallback(async () => {
    const next = !darkMode;
    updateUserLocal({ darkMode: next });
    try {
      await profileService.update({ darkMode: next });
    } catch (e) {
      updateUserLocal({ darkMode: !next });
      throw e;
    }
  }, [darkMode, updateUserLocal]);

  return { darkMode, toggleDarkMode };
}
