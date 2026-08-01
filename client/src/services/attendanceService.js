import api from "./api.js";

export const attendanceService = {
  get: () => api.get("/attendance").then((r) => r.data.data),
  mark: (subject, present) => api.put(`/attendance/${encodeURIComponent(subject)}`, { present }).then((r) => r.data.data),
  remove: (subject) => api.delete(`/attendance/${encodeURIComponent(subject)}`).then((r) => r.data.data),
};
