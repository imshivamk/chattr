import { create } from "zustand";
import type { AuthState } from "../types/types";
import { checkAuth, signup as apiSignUp, login as apiLogin, logout as apiLogout } from "../lib/auth";

export const useAuthStore = create<AuthState>((set, get)=>({
    user: null,
    loading: true,
    isLoggedIn: false,

    authenticate: async () => {
        set({loading: true});
        try {
            const data = await checkAuth();
            set({user:data.user, loading:false})
        } catch (error) {
            set({user: null, loading:false})
        }
    },
    
    signup: async (email, name, password) => {
        await apiSignUp({email, name, password});
        await get().authenticate();
    },
    login: async (email, password) => {
        await apiLogin({email, password});
        await get().authenticate();
    },
    logout: async () => {
        await apiLogout();
        set({user:null,  loading: false})
    }

}))