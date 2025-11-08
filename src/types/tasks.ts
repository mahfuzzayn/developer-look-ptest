export interface ITask {
    id: string;
    title: string;
    status: "Pending" | "Completed";
    priority: "Low" | "Medium" | "High";
}

export interface ITasksContext {
    tasks: ITask[] | [] | null;
    addTask: (payload: ITask) => void;
    deleteTask: (id: string) => void;
    updateTaskStatus: (id: string, status: "Pending" | "Completed") => void;
    updateTaskPriority: (
        id: string,
        priority: "Low" | "Medium" | "High"
    ) => void;
    editTask: (id: string, payload: Partial<ITask>) => void;
    sortTasks: (dir: "desc" | "asc") => void;
}
