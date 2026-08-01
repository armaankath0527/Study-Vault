import { useEffect } from "react";

// Syncs the real <html>/<body> background to the current theme color.
// Necessary because our CSS variables are scoped to the themed root div and
// can't be read by ancestor elements - without this, short pages can show a
// flash of the browser's default white background beneath the app.
export function useBodyBackground(hex) {
  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;
    const prevMargin = document.body.style.margin;
    const prevOverflowX = document.body.style.overflowX;

    document.documentElement.style.background = hex;
    document.body.style.background = hex;
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
      document.body.style.margin = prevMargin;
      document.body.style.overflowX = prevOverflowX;
    };
  }, [hex]);
}
