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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    username: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormType = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginFormType) => {
        if (!auth) return;
        
        setIsLoading(true);
        const success = auth.login(values.username, values.password);
        setIsLoading(false);
        
        if (!success) {
            form.reset();
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-2">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <LogIn className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                    Sign in to your account to manage your tasks
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Enter your username or email"
                                                className="pl-10 h-11"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Enter your password"
                                                className="pl-10 h-11"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;

