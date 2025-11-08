"use client";

import { AuthContext } from "@/context/AuthContext";
import { IUser } from "@/types/auth";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

const getCurrentUser = (): IUser | null => {
    if (typeof window === "undefined") return null;
    
    try {
        const stored = sessionStorage.getItem("currentUser");
        if (!stored) return null;
        
        return JSON.parse(stored);
    } catch (error) {
        console.error("Error reading current user from sessionStorage:", error);
        return null;
    }
};

const saveCurrentUser = (user: IUser | null): void => {
    if (typeof window === "undefined") return;
    
    try {
        if (user) {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            sessionStorage.removeItem("currentUser");
        }
    } catch (error) {
        console.error("Error saving current user to sessionStorage:", error);
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(getCurrentUser);

    useEffect(() => {
        saveCurrentUser(user);
    }, [user]);

    const signup = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await apiRequest<{ user: IUser }>("/auth/signup", {
                method: "POST",
                body: JSON.stringify({ username, email, password }),
            });

            setUser(response.user);
            toast.success("Account created successfully! 🎉");
            return true;
        } catch (error: any) {
            toast.error(error.message || "Failed to create account");
            return false;
        }
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await apiRequest<{ user: IUser }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            setUser(response.user);
            toast.success(`Welcome back, ${response.user.username}! 👋`);
            return true;
        } catch (error: any) {
            toast.error(error.message || "Invalid username or password");
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        toast.success("Logged out successfully");
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
