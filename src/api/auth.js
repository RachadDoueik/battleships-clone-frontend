import axios from "axios";

const API = "http://localhost:3000/api/auth";

export async function loginUser(username, password) {
  const res = await axios.post(`${API}/login`, { username, password });
  return res.data;
}

export async function registerUser(username, password) {
  const res = await axios.post(`${API}/register`, { username, password });
  return res.data;
}