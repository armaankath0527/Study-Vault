import api from "./api.js";

export const notificationService = {
  list: () => api.get("/notifications").then((r) => r.data.data),
  markAllRead: () => api.put("/notifications/read-all").then((r) => r.data),
};
