import api from "./api.js";

export const gpaService = {
  list: () => api.get("/gpa").then((r) => r.data.data),
  create: (payload) => api.post("/gpa", payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/gpa/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/gpa/${id}`).then((r) => r.data.data),
};
