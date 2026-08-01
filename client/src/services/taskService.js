import api from "./api.js";

export const taskService = {
  list: () => api.get("/tasks").then((r) => r.data.data),
  create: (payload) => api.post("/tasks", payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data.data),
};
