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
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormType = z.infer<typeof signupSchema>;

const SignupForm = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignupFormType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: SignupFormType) => {
        if (!auth) return;
        
        setIsLoading(true);
        const success = await auth.signup(values.username, values.email, values.password);
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
                        <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                    Sign up to start managing your tasks
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
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Choose a username"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Enter your email"
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
                                                placeholder="Create a password"
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
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Confirm your password"
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
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SignupForm;

