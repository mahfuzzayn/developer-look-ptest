import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { TaskProvider } from "@/providers/TasksProvider";

const interSans = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Task Manager - Multi-User",
    description: "Manage your tasks with multi-user support",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${interSans.variable} antialiased`}>
                <AuthProvider>
                    <TaskProvider>
                        {children}
                    </TaskProvider>
                </AuthProvider>
                <Toaster richColors={true} />
            </body>
        </html>
    );
}
