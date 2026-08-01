import api from "./api.js";

export const noteService = {
  list: () => api.get("/notes").then((r) => r.data.data),
  create: (payload) => api.post("/notes", payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/notes/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/notes/${id}`).then((r) => r.data.data),
};
