import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { username, email, password } = body;

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email: email.toLowerCase() }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error:
                        existingUser.username === username
                            ? "Username already exists"
                            : "Email already exists",
                },
                { status: 409 }
            );
        }

        // Create new user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password, // In production, hash this with bcrypt
        });

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
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Username or email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

