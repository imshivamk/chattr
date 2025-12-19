// lib/user.ts
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: "GET",
    credentials: "include", // send httpOnly cookie
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Failed to load user");
  }

  const jsonResponse = await res.json();
  return jsonResponse; // { success: true, user: {...} }
};

