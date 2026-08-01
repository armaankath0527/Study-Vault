import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AppDataProvider } from "./context/AppDataContext.jsx";
import LoadingScreen from "./components/common/LoadingScreen.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

function Root() {
  const { user, authLoading } = useAuth();
  const [screen, setScreen] = useState("landing"); // landing | auth

  if (authLoading) return <LoadingScreen />;
  if (user) {
    return (
      <AppDataProvider>
        <AppLayout />
      </AppDataProvider>
    );
  }
  if (screen === "auth") return <AuthPage />;
  return <LandingPage onEnter={() => setScreen("auth")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
