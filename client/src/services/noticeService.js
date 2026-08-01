import api from "./api.js";

export const noticeService = {
  list: () => api.get("/notices").then((r) => r.data.data),
  create: (payload) => api.post("/notices", payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/notices/${id}`).then((r) => r.data.data),
};
