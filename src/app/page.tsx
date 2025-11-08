"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AddTask from "@/components/modules/tasks";
import ManageTasks from "@/components/modules/tasks/ManageTasks";
import AuthPage from "@/components/modules/auth";
import UserMenu from "@/components/modules/auth/UserMenu";
import { CheckSquare } from "lucide-react";

const HomePage = () => {
    const auth = useContext(AuthContext);

    // Show auth page if not logged in
    if (!auth?.isAuthenticated) {
        return <AuthPage />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header with User Menu */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <CheckSquare className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                            Task <span className="text-primary">Manager</span>
                        </h1>
                    </div>
                    <UserMenu />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <CheckSquare className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Welcome, <span className="text-primary">{auth.user?.username}</span>!
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
                                Manage your tasks and boost your productivity
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    <AddTask />
                    <ManageTasks />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
