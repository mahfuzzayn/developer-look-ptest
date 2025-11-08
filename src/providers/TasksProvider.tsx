"use client";

import { TaskContext } from "@/context/TasksContext";
import { ITask } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Store tasks per user: { userId: ITask[] }
const getAllUserTasks = (): Record<string, ITask[]> => {
    if (typeof window === "undefined") return {};
    
    try {
        const stored = localStorage.getItem("userTasks");
        if (!stored) return {};
        
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
            return parsed;
        }
        return {};
    } catch (error) {
        console.error("Error reading user tasks from localStorage:", error);
        return {};
    }
};

const saveAllUserTasks = (allTasks: Record<string, ITask[]>): void => {
    if (typeof window === "undefined") return;
    
    try {
        localStorage.setItem("userTasks", JSON.stringify(allTasks));
    } catch (error) {
        console.error("Error saving user tasks to localStorage:", error);
    }
};

const getUserTasks = (userId: string): ITask[] => {
    const allTasks = getAllUserTasks();
    return allTasks[userId] || [];
};

const saveUserTasks = (userId: string, tasks: ITask[]): void => {
    const allTasks = getAllUserTasks();
    allTasks[userId] = tasks;
    saveAllUserTasks(allTasks);
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const [tasks, setTasks] = useState<ITask[]>([]);

    // Load tasks when user changes
    useEffect(() => {
        if (auth?.user) {
            const userTasks = getUserTasks(auth.user.id);
            setTasks(userTasks);
        } else {
            setTasks([]);
        }
    }, [auth?.user?.id]);

    // Save tasks when they change
    useEffect(() => {
        if (auth?.user && tasks.length >= 0) {
            saveUserTasks(auth.user.id, tasks);
        }
    }, [tasks, auth?.user?.id]);

    const addTask = useCallback((payload: ITask) => {
        if (!auth?.user) {
            console.warn("Cannot add task: User not authenticated");
            return;
        }

        setTasks((prev) => {
            // Check for duplicate IDs
            if (prev.some((task) => task.id === payload.id)) {
                console.warn("Task with this ID already exists");
                return prev;
            }
            return [...prev, payload];
        });
    }, [auth?.user]);

    const editTask = useCallback((id: string, payload: Partial<ITask>) => {
        if (!auth?.user) {
            console.warn("Cannot edit task: User not authenticated");
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...payload } : task
            )
        );
    }, [auth?.user]);

    const deleteTask = useCallback((id: string) => {
        if (!auth?.user) {
            console.warn("Cannot delete task: User not authenticated");
            return;
        }

        setTasks((prev) => prev.filter((task) => task.id !== id));
    }, [auth?.user]);

    const updateTaskStatus = useCallback((id: string, status: "Pending" | "Completed") => {
        if (!auth?.user) {
            console.warn("Cannot update task status: User not authenticated");
            return;
        }

        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status } : task))
        );
    }, [auth?.user]);

    const updateTaskPriority = useCallback((
        id: string,
        priority: "Low" | "Medium" | "High"
    ) => {
        if (!auth?.user) {
            console.warn("Cannot update task priority: User not authenticated");
            return;
        }

        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, priority } : task))
        );
    }, [auth?.user]);

    const sortTasks = useCallback((dir: "desc" | "asc" = "desc") => {
        if (!auth?.user) {
            console.warn("Cannot sort tasks: User not authenticated");
            return;
        }

        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        setTasks((prev) =>
            [...prev].sort((a, b) => {
                const aw = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 0;
                const bw = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 0;
                return dir === "desc" ? bw - aw : aw - bw;
            })
        );
    }, [auth?.user]);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                editTask,
                deleteTask,
                updateTaskStatus,
                updateTaskPriority,
                sortTasks,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};
