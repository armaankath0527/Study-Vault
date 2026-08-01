import api from "./api.js";

export const profileService = {
  get: () => api.get("/profile").then((r) => r.data.data),
  update: (payload) => api.put("/profile", payload).then((r) => r.data.data),
  changePassword: (payload) => api.put("/profile/password", payload).then((r) => r.data),
};
