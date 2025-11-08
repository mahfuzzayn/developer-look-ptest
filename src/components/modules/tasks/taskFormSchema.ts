import z from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Task name cannot be empty."),
    priority: z.enum(["Low", "Medium", "High"], {
        error: "Select at least one priority",
    }),
});
