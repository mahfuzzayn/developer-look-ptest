import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { Types } from "mongoose";

// GET - Get a single task
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const userId = request.headers.get("x-user-id");
        const { id } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const task = await Task.findOne({
            _id: new Types.ObjectId(id),
            userId: new Types.ObjectId(userId),
        }).lean();

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                task: {
                    id: task._id.toString(),
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get task error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Update a task
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const userId = request.headers.get("x-user-id");
        const { id } = await params;
        const body = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        console.log(id, userId);

        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const updateData: any = {};

        if (body.title !== undefined) {
            if (!body.title || body.title.trim().length === 0) {
                return NextResponse.json(
                    { error: "Task title cannot be empty" },
                    { status: 400 }
                );
            }
            updateData.title = body.title.trim();
        }

        if (body.priority !== undefined) {
            if (!["Low", "Medium", "High"].includes(body.priority)) {
                return NextResponse.json(
                    { error: "Invalid priority level" },
                    { status: 400 }
                );
            }
            updateData.priority = body.priority;
        }

        if (body.status !== undefined) {
            if (!["Pending", "Completed"].includes(body.status)) {
                return NextResponse.json(
                    { error: "Invalid status" },
                    { status: 400 }
                );
            }
            updateData.status = body.status;
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
                userId: new Types.ObjectId(userId),
            },
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                task: {
                    id: task._id.toString(),
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update task error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a task
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const userId = request.headers.get("x-user-id");
        const { id } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const task = await Task.findOneAndDelete({
            _id: new Types.ObjectId(id),
            userId: new Types.ObjectId(userId),
        }).lean();

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete task error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

