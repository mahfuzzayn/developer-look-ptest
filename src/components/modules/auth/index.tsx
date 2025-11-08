"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="mt-0">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup" className="mt-0">
                        <SignupForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AuthPage;

