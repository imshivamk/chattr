import React, { createContext, useContext, useEffect, useState } from "react";
import { checkAuth, login as apiLogin, signup as apiSignup, logout as apiLogout } from "../lib/auth";

type User = {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  // add other safe fields that checkAuth returns
};
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}:AuthProviderProps) =>{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ask backend "who am I?"
    const askAuth = async () =>{
        try{
            const data = await checkAuth();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    // on mount, as for auth
    useEffect(()=>{
        askAuth();
    }, [])

    const signup = async (
        email: string,
        name: string,
        password: string
    ) =>{
        await apiSignup({
            email,
            name, 
            password
        })
        const data = await checkAuth();
        setUser(data.user);
    }

    const login = async (
        email: string,
        password: string
    ) =>{
        await apiLogin({
            email,
            password
        });
        const data = await checkAuth();
        setUser(data.user);
    }

    const logout = async () =>{
        await apiLogout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, signup, login,logout}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}