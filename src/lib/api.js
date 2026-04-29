const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";

function getToken() {
  return localStorage.getItem("atheno_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  signup: (email, password) => request("POST", "/auth/signup", { email, password }),
  login:  (email, password) => request("POST", "/auth/login",  { email, password }),
  logout: ()                => request("POST", "/auth/logout"),
  me:     ()                => request("GET",  "/auth/me"),

  // Notes
  getNotes: (from, to) => request("GET", `/notes?from=${from}&to=${to}`),
  createNote: (note)   => request("POST", "/notes", note),
  updateNote: (id, patch) => request("PATCH", `/notes/${id}`, patch),
  deleteNote: (id)     => request("DELETE", `/notes/${id}`),

  // Token helpers
  saveToken: (token) => localStorage.setItem("atheno_token", token),
  clearToken: ()     => localStorage.removeItem("atheno_token"),
  getToken,
};
