import api from "./api.js";

export const dashboardService = {
  getSnapshot: () => api.get("/dashboard").then((r) => r.data.data),
};
