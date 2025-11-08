import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { username, password } = body;

        // Validation
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username },
                { email: username.toLowerCase() },
            ],
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Check password (in production, use bcrypt.compare)
        if (user.password !== password) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Return user data (without password)
        return NextResponse.json(
            {
                user: {
                    id: user._id!.toString(),
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

