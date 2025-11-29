import axios from "axios";

// --- Универсальная и стабильная схема адреса ---
// 1) При разработке: используем proxy → /api (без портов)
// 2) При продакшене: можно задать адрес через .env
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

// Создаём общий axios-инстанс
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ---------------------------
//        SUMMARY STATS      
// ---------------------------
export const getSummary = () => api.get("/stats/summary");

// ---------------------------
//        CONTENT
// ---------------------------
export const getContent = () => api.get("/content");
export const getContentById = (id) => api.get(`/content/${id}`);

// ---------------------------
//        COMPARE
// ---------------------------
export const compareItems = (ids) =>
  api.post("/compare", { ids });

// Старое имя для совместимости
export const postCompare = (ids) => compareItems(ids);

// ---------------------------
//         CHAT (LLM)
// ---------------------------
export const askLLM = (query) =>
  api.post("/chat", { query });

// Старое имя для совместимости
export const postChat = (query) => askLLM(query);

// ---------------------------
//         AUTH
// ---------------------------
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const getProfile = (email) =>
  api.get("/user/profile", { params: { email } });

export const updateProfile = (req) =>
  api.put("/user/profile", req);

// ---------------------------
//       AVATAR UPLOAD
// ---------------------------
export const uploadAvatar = (email, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/user/avatar", formData, {
    params: { email },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
