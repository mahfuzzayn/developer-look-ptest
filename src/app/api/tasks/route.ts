import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { Types } from "mongoose";

// GET - Fetch all tasks for a user
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const userId = request.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }

        const tasks = await Task.find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .lean();

        const formattedTasks = tasks.map((task) => ({
            id: task._id.toString(),
            title: task.title,
            status: task.status,
            priority: task.priority,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }));

        return NextResponse.json({ tasks: formattedTasks }, { status: 200 });
    } catch (error: any) {
        console.error("Get tasks error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const userId = request.headers.get("x-user-id");
        const body = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }

        const { title, priority = "Low", status = "Pending" } = body;

        if (!title || title.trim().length === 0) {
            return NextResponse.json(
                { error: "Task title is required" },
                { status: 400 }
            );
        }

        if (!["Low", "Medium", "High"].includes(priority)) {
            return NextResponse.json(
                { error: "Invalid priority level" },
                { status: 400 }
            );
        }

        if (!["Pending", "Completed"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const task = await Task.create({
            userId: new Types.ObjectId(userId),
            title: title.trim(),
            priority,
            status,
        });

        return NextResponse.json(
            {
                task: {
                    id: task._id,
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create task error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

