import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const getSummary = () => axios.get(`${API_BASE}/stats/summary`);
export const getContent = () => axios.get(`${API_BASE}/content`);
export const getContentItem = (id) => axios.get(`${API_BASE}/content/${id}`);
export const postCompare = (ids) =>
  axios.post(`${API_BASE}/compare`, { ids });
export const postChat = (query) =>
  axios.post(`${API_BASE}/chat`, { query });
