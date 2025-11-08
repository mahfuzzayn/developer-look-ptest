"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { formSchema } from "./taskFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ITask } from "@/types";
import { useContext } from "react";
import { TaskContext } from "@/context/TasksContext";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, Sparkles } from "lucide-react";

type FormType = z.infer<typeof formSchema>;

const AddTask = () => {
    const manager = useContext(TaskContext);

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            priority: "Low",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const toastId = toast.loading("Adding Task...");

        const task: Omit<ITask, "id"> = {
            title: values.title.trim(),
            status: "Pending",
            priority: values.priority,
        };

        try {
            await manager?.addTask(task as ITask);
            toast.success("Task added successfully! 🎉", { id: toastId });
            form.reset();
        } catch (error) {
            toast.error("Failed to add task", { id: toastId });
        }
    };

    return (
        <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Create New Task</CardTitle>
                        <CardDescription className="mt-1">
                            Add a new task to your list and manage your productivity
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-[1fr_180px_auto] md:items-end">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-base font-medium">
                                            Task Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                placeholder="Enter task name..."
                                                className="h-11 text-base"
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-base font-medium">
                                            Priority
                                        </FormLabel>
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
                            <Button
                                type="submit"
                                className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                size="lg"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddTask;
