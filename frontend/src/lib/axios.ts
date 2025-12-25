import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/";

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
      "Content-Type":"application/json"
    }
});
