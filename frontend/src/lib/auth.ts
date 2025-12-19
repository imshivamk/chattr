const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/";

export const signup = async (data: {
  email: string;
  name: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const jsonResponse = await res.json();
  if(!res.ok) throw new Error(
    jsonResponse.message || "Signup failed!"
  )
  return jsonResponse;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const jsonResponse = await res.json();
  if(!res.ok) throw new Error(
    jsonResponse.message || "Login failed!"
  )
  return jsonResponse;
};

export const logout = async () =>{
    const res = await fetch(`${API_BASE}/auth/logout`,{
        method: "POST",
        credentials: "include"
    });
    if(!res.ok) throw new Error("Logout failed");
}

export const checkAuth = async () =>{
    const res = await fetch(`${API_BASE}/auth/check-auth`, {
        method:"GET",
        credentials: "include"
    });
    const jsonResponse = await res.json();
    if(!res.ok) throw new Error(jsonResponse.message || "Not authenticated")
    return jsonResponse; 
}