export interface ITask {
    id: string;
    title: string;
    status: "Pending" | "Completed";
    priority: "Low" | "Medium" | "High";
}

export interface ITasksContext {
    tasks: ITask[] | [] | null;
    addTask: (payload: ITask | Omit<ITask, "id">) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateTaskStatus: (id: string, status: "Pending" | "Completed") => Promise<void>;
    updateTaskPriority: (
        id: string,
        priority: "Low" | "Medium" | "High"
    ) => Promise<void>;
    editTask: (id: string, payload: Partial<ITask>) => Promise<void>;
    sortTasks: (dir: "desc" | "asc") => void;
}
