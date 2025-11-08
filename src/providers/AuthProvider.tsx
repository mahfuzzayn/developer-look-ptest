"use client";

import { AuthContext } from "@/context/AuthContext";
import { IUser } from "@/types/auth";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface StoredUser {
    id: string;
    username: string;
    email: string;
    password: string; // In production, this should be hashed
    createdAt: string;
}

const getStoredUsers = (): StoredUser[] => {
    if (typeof window === "undefined") return [];
    
    try {
        const stored = localStorage.getItem("users");
        if (!stored) return [];
        
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch (error) {
        console.error("Error reading users from localStorage:", error);
        return [];
    }
};

const saveUsersToStorage = (users: StoredUser[]): void => {
    if (typeof window === "undefined") return;
    
    try {
        localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
        console.error("Error saving users to localStorage:", error);
    }
};

const getCurrentUser = (): IUser | null => {
    if (typeof window === "undefined") return null;
    
    try {
        const stored = localStorage.getItem("currentUser");
        if (!stored) return null;
        
        return JSON.parse(stored);
    } catch (error) {
        console.error("Error reading current user from localStorage:", error);
        return null;
    }
};

const saveCurrentUser = (user: IUser | null): void => {
    if (typeof window === "undefined") return;
    
    try {
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUser");
        }
    } catch (error) {
        console.error("Error saving current user to localStorage:", error);
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(getCurrentUser);

    useEffect(() => {
        saveCurrentUser(user);
    }, [user]);

    const signup = useCallback((username: string, email: string, password: string): boolean => {
        const users = getStoredUsers();
        
        // Check if username already exists
        if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
            toast.error("Username already exists");
            return false;
        }
        
        // Check if email already exists
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            toast.error("Email already exists");
            return false;
        }
        
        // Validate password length
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        
        // Create new user
        const newUser: StoredUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username,
            email,
            password, // In production, hash this
            createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        saveUsersToStorage(users);
        
        // Auto-login after signup
        const userData: IUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
        };
        
        setUser(userData);
        toast.success("Account created successfully! 🎉");
        return true;
    }, []);

    const login = useCallback((username: string, password: string): boolean => {
        const users = getStoredUsers();
        
        const foundUser = users.find(
            (u) =>
                (u.username.toLowerCase() === username.toLowerCase() ||
                    u.email.toLowerCase() === username.toLowerCase()) &&
                u.password === password
        );
        
        if (!foundUser) {
            toast.error("Invalid username or password");
            return false;
        }
        
        const userData: IUser = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            createdAt: foundUser.createdAt,
        };
        
        setUser(userData);
        toast.success(`Welcome back, ${foundUser.username}! 👋`);
        return true;
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

