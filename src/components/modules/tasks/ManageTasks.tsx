"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TaskContext } from "@/context/TasksContext";
import { ITask } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Edit2,
    Trash2,
    CheckCircle2,
    Circle,
    ArrowUpDown,
    Clock,
    CheckCircle,
    AlertCircle,
    Filter,
} from "lucide-react";
import clsx from "clsx";

const formSchema = z.object({
    title: z.string().min(1, "Minimum 1 characters needed."),
    priority: z.enum(["Low", "Medium", "High"], {
        error: "Select at least one priority",
    }),
});

const priorityConfig = {
    Low: {
        color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
        dot: "bg-orange-500",
        label: "Low",
    },
    Medium: {
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        dot: "bg-purple-500",
        label: "Medium",
    },
    High: {
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        dot: "bg-blue-500",
        label: "High",
    },
};

type PriorityFilter = "All" | "High" | "Medium" | "Low";

const ManageTasks = () => {
    const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
    const [sortDirection, setSortDirection] = useState<"Asc" | "Desc">("Asc");
    const manager = useContext(TaskContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: selectedTask?.title || "",
            priority: selectedTask?.priority || "Low",
        },
    });

    useEffect(() => {
        form.reset({
            title: selectedTask?.title || "",
            priority: selectedTask?.priority || "Low",
        });
    }, [selectedTask, form]);

    const handleUpdateSubmit = (data: z.infer<typeof formSchema>) => {
        if (selectedTask) {
            const toastId = toast.loading("Updating Task...");
            if (
                data.title.trim() !== selectedTask.title ||
                data.priority !== selectedTask.priority
            ) {
                manager?.editTask(selectedTask.id, {
                    title: data.title.trim(),
                    priority: data.priority,
                });

                toast.success("Task updated successfully! ✨", { id: toastId });

                setSelectedTask(null);
                setUpdateModalOpen(false);
                form.reset();
            } else {
                toast.warning("No changes were detected", { id: toastId });
                setSelectedTask(null);
                setUpdateModalOpen(false);
            }
        }
    };

    const handleDelete = () => {
        if (selectedTask) {
            manager?.deleteTask(selectedTask.id);
            toast.success("Task deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedTask(null);
        }
    };

    const handleSortChange = (value: "Asc" | "Desc") => {
        setSortDirection(value);
        toast.success(`Tasks sorted ${value === "Asc" ? "Low to High" : "High to Low"}`);
    };

    const handlePriorityFilterChange = (value: PriorityFilter) => {
        setPriorityFilter(value);
        toast.success(
            value === "All" 
                ? "Showing all priorities" 
                : `Filtering by ${value} priority`
        );
    };

    const handleStatusToggle = (task: ITask) => {
        const newStatus = task.status === "Pending" ? "Completed" : "Pending";
        manager?.updateTaskStatus(task.id, newStatus);
        toast.success(
            `Task marked as ${newStatus.toLowerCase()}!`,
            { icon: newStatus === "Completed" ? "✅" : "⏳" }
        );
    };

    // Filter and sort tasks
    const filterTasksByPriority = (tasks: ITask[]): ITask[] => {
        if (priorityFilter === "All") return tasks;
        return tasks.filter((task) => task.priority === priorityFilter);
    };

    const allTasks = manager?.tasks || [];
    const filteredTasks = filterTasksByPriority(allTasks);
    
    // Apply sorting
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aw = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 0;
        const bw = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 0;
        return sortDirection === "Asc" ? aw - bw : bw - aw;
    });

    const pendingTasks = sortedTasks.filter(
        (task) => task.status === "Pending"
    );
    const completedTasks = sortedTasks.filter(
        (task) => task.status === "Completed"
    );

    return (
        <div className="space-y-8">
            {/* Sort and Filter Section */}
            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Filter className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Filter & Sort Tasks</CardTitle>
                                <CardDescription>
                                    Filter by priority and organize tasks
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Filter by Priority</SelectLabel>
                                        <SelectItem value="All">All Priorities</SelectItem>
                                        <SelectItem value="High">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                High
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="Medium">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                                                Medium
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="Low">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                                Low
                                            </span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select value={sortDirection} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Sort by Priority</SelectLabel>
                                        <SelectItem value="Asc">Low to High</SelectItem>
                                        <SelectItem value="Desc">High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Pending Tasks */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Pending Tasks
                    </h2>
                    {pendingTasks.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {pendingTasks.length}
                        </Badge>
                    )}
                </div>

                {pendingTasks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingTasks.map((task) => (
                            <Card
                                key={task.id}
                                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold line-clamp-2">
                                                {task.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            className={clsx(
                                                "border",
                                                priorityConfig[task.priority].color
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    "h-2 w-2 rounded-full mr-2",
                                                    priorityConfig[task.priority].dot
                                                )}
                                            ></span>
                                            {task.priority}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-primary/10"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setUpdateModalOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-destructive/10"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Checkbox
                                            checked={task.status === "Completed"}
                                            onCheckedChange={() => handleStatusToggle(task)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                        <label
                                            className="text-sm font-medium cursor-pointer flex-1"
                                            onClick={() => handleStatusToggle(task)}
                                        >
                                            Mark as completed
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <Empty>
                                <EmptyMedia variant="icon">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyHeader>
                                    <EmptyTitle>No pending tasks</EmptyTitle>
                                    <EmptyDescription>
                                        You're all caught up! Add a new task to get started.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Completed Tasks */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Completed Tasks
                    </h2>
                    {completedTasks.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {completedTasks.length}
                        </Badge>
                    )}
                </div>

                {completedTasks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedTasks.map((task) => (
                            <Card
                                key={task.id}
                                className="group hover:shadow-lg transition-all duration-300 border-2 opacity-75 hover:opacity-100"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold line-through text-muted-foreground line-clamp-2">
                                                {task.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            className={clsx(
                                                "border opacity-60",
                                                priorityConfig[task.priority].color
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    "h-2 w-2 rounded-full mr-2",
                                                    priorityConfig[task.priority].dot
                                                )}
                                            ></span>
                                            {task.priority}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-destructive/10"
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Checkbox
                                            checked={task.status === "Completed"}
                                            onCheckedChange={() => handleStatusToggle(task)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                        <label
                                            className="text-sm font-medium cursor-pointer flex-1 text-muted-foreground"
                                            onClick={() => handleStatusToggle(task)}
                                        >
                                            Mark as pending
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <Empty>
                                <EmptyMedia variant="icon">
                                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyHeader>
                                    <EmptyTitle>No completed tasks</EmptyTitle>
                                    <EmptyDescription>
                                        Complete some tasks to see them here.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Update Task Modal */}
            <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Task</DialogTitle>
                        <DialogDescription>
                            Update the task details below
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleUpdateSubmit)}
                            className="space-y-6 mt-4"
                        >
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Task Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Enter task name..."
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="priority"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Priority</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Priority Level</SelectLabel>
                                                        <SelectItem value="Low">
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                                                                Low
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="Medium">
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                                                                Medium
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="High">
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                                High
                                                            </span>
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setUpdateModalOpen(false);
                                        setSelectedTask(null);
                                        form.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-primary">
                                    Update Task
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task
                            "{selectedTask?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedTask(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ManageTasks;
