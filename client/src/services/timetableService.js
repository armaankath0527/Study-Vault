import api from "./api.js";

export const timetableService = {
  list: () => api.get("/timetable").then((r) => r.data.data),
  create: (payload) => api.post("/timetable", payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/timetable/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/timetable/${id}`).then((r) => r.data.data),
};
