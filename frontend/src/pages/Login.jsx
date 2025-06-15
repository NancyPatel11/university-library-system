"use client"

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import bg from "../assets/images/bg.png";
import loginImg from "../assets/images/auth.jpg";
import bookicon from "../assets/icons/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '@/components/Loader';

const formSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(8).nonempty(),
});

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const endpoint = role === "admin"
                ? "http://localhost:8080/api/admin/login"
                : "http://localhost:8080/api/user/login";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Login failed. Please try again.");
                setLoading(false);
                return;
            }

            toast.success("Login successful!");

            setTimeout(() => {
                navigate(role === "student" ? "/home" : "/admin-dashboard");
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);


    return loading ? <Loader message={role === "student" ? "Logging you into Bookademia 📚" : "Loading Admin Dashboard 🖥️"} role={role} /> :
        <div
            className="h-screen bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            }}
        >
            <div className="flex max-h-screen items-center justify-between">
                <div className="w-1/2 relative">
                    <div
                        className="absolute top-[50%] left-[50%] [-ms-transform:translate(-50%,_-50%)] [transform:translate(-50%,_-50%)] px-10 py-16 shadow-lg bg-[linear-gradient(to_bottom,var(--color-dark-start),var(--color-dark-end))] w-[70%] rounded-3xl"
                    >
                        <div className='flex gap-3 items-center'>
                            <img src={bookicon} alt="book icon" className="h-8" />
                            <h3 className="text-white ibm-plex-sans-600 text-3xl">Bookademia</h3>
                        </div>

                        <h1 className='text-white ibm-plex-sans-600 text-3xl mt-16'>Welcome back to the Bookademia</h1>
                        <p className='text-light-blue ibm-plex-sans-400 mt-4'>Access the vast collection of resources, and stay updated</p>

                        <div className='mt-16'>
                            <div className="flex gap-3 mb-6">
                                <Button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`hover:cursor-pointer hover:bg-yellow-dark hover:text-black ${role === "student"
                                        ? "bg-yellow text-black"
                                        : "bg-form-field text-light-blue"
                                        }`}
                                >
                                    Student
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setRole("admin")}
                                    className={`hover:cursor-pointer hover:bg-yellow-dark hover:text-black ${role === "admin"
                                        ? "bg-yellow text-black"
                                        : "bg-form-field text-light-blue"
                                        }`}
                                >
                                    Admin
                                </Button>
                            </div>
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-light-blue ibm-plex-sans-400'>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email" {...field} className='rounded-xs text-light-blue bg-form-field border-form-field p-5 ibm-plex-sans-400 ' />
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
                                                <FormLabel className='text-light-blue ibm-plex-sans-400'>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} className='rounded-xs text-light-blue bg-form-field border-form-field p-5 ibm-plex-sans-400 ' />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-light-blue"
                                                        >
                                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" className='hover:cursor-pointer' />
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full text-black border-1 bg-yellow p-5 rounded-xs border-yellow hover:bg-transparent hover:cursor-pointer hover:text-white mt-5 ibm-plex-sans-600 ">Login</Button>
                                </form>
                            </Form>

                            <p className='text-light-blue ibm-plex-sans-500 mt-16 text-center'>
                                Don&apos;t have an account?{' '}
                                <Link to="/register" className='text-yellow underline'>
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right container for image */}
                <div className="w-1/2 h-screen">
                    <img src={loginImg} alt="Login" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
}
