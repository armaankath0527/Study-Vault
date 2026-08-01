export const todayISO = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function getNextClass(timetable) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let offset = 0; offset <= 7; offset++) {
    const d = new Date(now); d.setDate(now.getDate() + offset);
    const dow = d.getDay();
    if (dow === 0) continue;
    const dayName = DAYS[dow - 1];
    const classesThatDay = timetable.filter((c) => c.day === dayName).sort((a, b) => a.start.localeCompare(b.start));
    for (const c of classesThatDay) {
      if (offset === 0 && toMinutes(c.start) <= nowMinutes) continue;
      const target = new Date(now); target.setDate(now.getDate() + offset);
      const [h, m] = c.start.split(":").map(Number); target.setHours(h, m, 0, 0);
      const diffMin = Math.max(0, Math.round((target - now) / 60000));
      return { class: c, offset, diffMin };
    }
  }
  return null;
}

export function formatCountdown(info) {
  if (!info) return null;
  const { class: c, offset, diffMin } = info;
  if (offset === 0) {
    if (diffMin < 60) return `Starts in ${diffMin} minute${diffMin === 1 ? "" : "s"}`;
    const h = Math.floor(diffMin / 60), m = diffMin % 60;
    return `Starts in ${h}h ${m}m`;
  }
  if (offset === 1) return `Tomorrow at ${c.start}`;
  return `${c.day} at ${c.start}`;
}
