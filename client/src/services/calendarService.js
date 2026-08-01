import api from "./api.js";

export const calendarService = {
  list: () => api.get("/calendar").then((r) => r.data.data),
  create: (payload) => api.post("/calendar", payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/calendar/${id}`).then((r) => r.data.data),
};
