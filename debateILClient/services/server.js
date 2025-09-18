import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030"
});

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}



