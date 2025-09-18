import axios from "axios";
const DEBATES_PREFIX = "/api/debates";
const api = axios.create({
  baseURL:  import.meta?.env?.VITE_API_BASE || "http://localhost:3030"
});

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}



export async function getDebates() {
  try {
    const { data } = await api.get(DEBATES_PREFIX); // בלי params
    // מצפה ל- { success, debates }
    return data?.debates ?? [];
  } catch (err) {
    // אם הסרבר מחזיר 404 כשאין תוצאות – נחזיר [] כדי שה-UI לא יקרוס
    if (err?.response?.status === 404) return [];
    throw normalizeError(err);
  }
}

export async function getLiveDebates() {
  return getDebates({ status: "live" });
}

export async function getDebate(id) {
  try {
    const { data } = await api.get(`${DEBATES_PREFIX}/${id}`);
    // מצפה ל- { success, debate }
    return data?.debate;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getDebateStats() {
  try {
    const { data } = await api.get(`${DEBATES_PREFIX}/stats`);
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export { api };
