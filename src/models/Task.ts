import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITaskDocument extends Document {
    userId: Types.ObjectId;
    title: string;
    status: "Pending" | "Completed";
    priority: "Low" | "Medium" | "High";
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [1, "Task title cannot be empty"],
            maxlength: [200, "Task title cannot exceed 200 characters"],
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

// Prevent re-compilation during development
const Task: Model<ITaskDocument> =
    mongoose.models.Task || mongoose.model<ITaskDocument>("Task", TaskSchema);

export default Task;

