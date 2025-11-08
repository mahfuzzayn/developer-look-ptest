"use client";

import { TaskContext } from "@/context/TasksContext";
import { ITask } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(false);

    // Load tasks when user changes
    useEffect(() => {
        const loadTasks = async () => {
            if (!auth?.user?.id) {
                setTasks([]);
                return;
            }

            setLoading(true);
            try {
                const response = await apiRequest<{ tasks: ITask[] }>(
                    "/tasks",
                    { method: "GET" },
                    auth.user.id
                );
                setTasks(response.tasks || []);
            } catch (error: any) {
                console.error("Error loading tasks:", error);
                toast.error("Failed to load tasks");
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [auth?.user?.id]);

    const addTask = useCallback(async (payload: ITask | Omit<ITask, "id">) => {
        if (!auth?.user?.id) {
            console.warn("Cannot add task: User not authenticated");
            toast.error("Please log in to add tasks");
            return;
        }

        try {
            const response = await apiRequest<{ task: ITask }>(
                "/tasks",
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: payload.title,
                        priority: payload.priority,
                        status: payload.status,
                    }),
                },
                auth.user.id
            );

            setTasks((prev) => [...prev, response.task]);
        } catch (error: any) {
            console.error("Error adding task:", error);
            throw error; // Re-throw to let component handle toast
        }
    }, [auth?.user?.id]);

    const editTask = useCallback(async (id: string, payload: Partial<ITask>) => {
        if (!auth?.user?.id) {
            console.warn("Cannot edit task: User not authenticated");
            toast.error("Please log in to edit tasks");
            return;
        }

        try {
            const response = await apiRequest<{ task: ITask }>(
                `/tasks/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                },
                auth.user.id
            );

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? response.task : task))
            );
        } catch (error: any) {
            console.error("Error editing task:", error);
            toast.error(error.message || "Failed to update task");
        }
    }, [auth?.user?.id]);

    const deleteTask = useCallback(async (id: string) => {
        if (!auth?.user?.id) {
            console.warn("Cannot delete task: User not authenticated");
            toast.error("Please log in to delete tasks");
            return;
        }

        try {
            await apiRequest(
                `/tasks/${id}`,
                { method: "DELETE" },
                auth.user.id
            );

            setTasks((prev) => prev.filter((task) => task.id !== id));
            toast.success("Task deleted successfully");
        } catch (error: any) {
            console.error("Error deleting task:", error);
            toast.error(error.message || "Failed to delete task");
        }
    }, [auth?.user?.id]);

    const updateTaskStatus = useCallback(async (id: string, status: "Pending" | "Completed") => {
        if (!auth?.user?.id) {
            console.warn("Cannot update task status: User not authenticated");
            return;
        }

        try {
            const response = await apiRequest<{ task: ITask }>(
                `/tasks/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                },
                auth.user.id
            );

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? response.task : task))
            );
        } catch (error: any) {
            console.error("Error updating task status:", error);
            toast.error(error.message || "Failed to update task status");
        }
    }, [auth?.user?.id]);

    const updateTaskPriority = useCallback(async (
        id: string,
        priority: "Low" | "Medium" | "High"
    ) => {
        if (!auth?.user?.id) {
            console.warn("Cannot update task priority: User not authenticated");
            return;
        }

        try {
            const response = await apiRequest<{ task: ITask }>(
                `/tasks/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ priority }),
                },
                auth.user.id
            );

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? response.task : task))
            );
        } catch (error: any) {
            console.error("Error updating task priority:", error);
            toast.error(error.message || "Failed to update task priority");
        }
    }, [auth?.user?.id]);

    const sortTasks = useCallback((dir: "desc" | "asc" = "desc") => {
        // Sorting is now handled client-side in ManageTasks component
        // This function is kept for backward compatibility but doesn't modify server state
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        setTasks((prev) =>
            [...prev].sort((a, b) => {
                const aw = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 0;
                const bw = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 0;
                return dir === "desc" ? bw - aw : aw - bw;
            })
        );
    }, []);

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
