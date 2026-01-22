import { create } from "zustand";
import type { AuthState } from "../types/types";
import {
  checkAuth,
  signup as apiSignUp,
  login as apiLogin,
  logout as apiLogout,
} from "../lib/auth";
import toast from "react-hot-toast";
import { api, API_BASE } from "../lib/axios";
import { io } from "socket.io-client";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isLoggedIn: false,
  socket: null,
  onlineUsers: [],

  authenticate: async () => {
    set({ loading: true });
    try {
      const data = await checkAuth();
      get().connectSocket();
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },

  signup: async (email, name, password) => {
    await apiSignUp({ email, name, password });
    await get().authenticate();
    get().connectSocket();
  },

  login: async (email, password) => {
    await apiLogin({ email, password });
    await get().authenticate();
    get().connectSocket();

  },

  logout: async () => {
    await apiLogout();
    get().disconnectSocket();
    set({ user: null, loading: false });
  },

  updateProfile: async (data) => {
    try {
        const res = await api.put("/auth/update-profile", data);
        set({user: res.data});
        toast.success("Profile updated successfully");

    } catch (error: any) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const {user} = get();
    if(!user || get().socket?.connected) return;

    const socketUrl = "http://localhost:3000";
    console.log("Connecting to socket at:", socketUrl);
    
    const socket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
    })

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    set({socket: socket});

    socket.on("getOnlineUsers", (userIds: []) => {
        console.log("Online users updated:", userIds);
        set({onlineUsers: userIds})
    });

  },

  disconnectSocket: () => {
    const {socket} = get();
    if(socket?.connected) socket.disconnect();
  },
}));
