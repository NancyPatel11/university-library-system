"use client"

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import bg from "../assets/images/bg.png";
import registerImg from "../assets/images/auth.jpg";
import bookicon from "../assets/icons/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '@/components/Loader';

const studentSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    universityId: z
        .string()
        .min(1, "University ID is required")
        .refine((val) => !/\s/.test(val), {
            message: "University ID cannot contain spaces",
        }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
    idCard: z
        .any()
        .refine(
            (file) => file instanceof File && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
            { message: "ID Card must be a JPG, JPEG, or PNG image" }
        ),
});


const adminSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
    mobile: z
        .string()
        .min(10, "Mobile number must be at least 10 digits")
        .max(10, "Mobile number must be at most 10 digits")
        .regex(/^\d+$/, "Mobile number must contain only digits"),
});

export const Register = () => {
    const [role, setRole] = useState("student"); // or "admin"
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formSchema = role === "admin" ? adminSchema : studentSchema;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            universityId: "",
            idCard: null,
            mobile: ""
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();

        const requestPayload = role === "admin"
            ? {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                mobileNumber: values.mobile,
            }
            : {
                fullName: values.fullName,
                email: values.email,
                universityId: values.universityId,
                password: values.password,
            };

        formData.append("request", new Blob([JSON.stringify(requestPayload)], { type: "application/json" }));
        if (role === "student") formData.append("idCardImage", values.idCard);

        const endpoint = role === "admin"
            ? "/api/admin/register"
            : "/api/user/register";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Registration failed");
                setLoading(false);
                return;
            }

            setTimeout(() => {
                navigate(role === "student" ? "/home" : "/admin-dashboard");
            }, 1500);

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);


    return loading ? <Loader message={role ? "Registering user and logging you into Bookademia 📚" : "Loading Admin Dashboard 🖥️"} role={role} /> :
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
                        className="absolute top-[50%] left-[50%] [-ms-transform:translate(-50%,_-50%)] [transform:translate(-50%,_-50%)] p-10 shadow-lg bg-[linear-gradient(to_bottom,var(--color-dark-start),var(--color-dark-end))] w-[70%] rounded-3xl"
                    >
                        <div className='flex gap-3 items-center'>
                            <img src={bookicon} alt="book icon" className="h-8" />
                            <h3 className="text-white ibm-plex-sans-600 text-3xl">Bookademia</h3>
                        </div>

                        <h1 className='text-white ibm-plex-sans-600 text-3xl mt-10'>Create Your Library Account</h1>
                        <p className='text-light-blue ibm-plex-sans-400 mt-4'>Please complete all fields and upload a valid university ID to gain access to the library</p>

                        <div className='mt-10'>
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
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-light-blue ibm-plex-sans-400'>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        {...field}
                                                        className='rounded-xs text-light-blue bg-form-field border-form-field p-5 ibm-plex-sans-400 '
                                                    />
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
                                                <FormLabel className='text-light-blue ibm-plex-sans-400'>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email" {...field} className='rounded-xs text-light-blue bg-form-field border-form-field p-5 ibm-plex-sans-400 ' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {role === "student" &&
                                        <FormField
                                            control={form.control}
                                            name="universityId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-light-blue ibm-plex-sans-400'>University ID Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="eg: 202101491"
                                                            {...field}
                                                            className='rounded-xs text-light-blue bg-form-field border-form-field p-5 ibm-plex-sans-400 '
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-light-blue ibm-plex-sans-400'>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} className='rounded-xs text-light-blue bg-form-field border-form-field p-5' />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-light-blue ibm-plex-sans-400 "
                                                        >
                                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" className='hover:cursor-pointer' />
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {role === "admin" &&
                                        <FormField
                                            control={form.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-light-blue ibm-plex-sans-400'>Mobile Number</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type="tel"
                                                                placeholder="Enter your mobile number"
                                                                {...field}
                                                                className='rounded-xs text-light-blue bg-form-field border-form-field p-5'
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }

                                    {role === "student" &&
                                        <FormField
                                            control={form.control}
                                            name="idCard"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-light-blue ibm-plex-sans-400">
                                                        Upload University ID Card (file upload)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <label
                                                            htmlFor="idCardUpload"
                                                            className="flex items-center justify-center gap-3 cursor-pointer rounded-xs bg-form-field border-form-field p-5 text-light-blue hover:bg-gray-700 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faFileUpload} className="text-xl" />
                                                            <span className="ibm-plex-sans-400 text-light-blue">
                                                                {field.value ? field.value.name : "Upload ID card"}
                                                            </span>
                                                            <input
                                                                id="idCardUpload"
                                                                type="file"
                                                                accept=".jpg,.jpeg,.png"
                                                                onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                    <Button type="submit" className="w-full text-black border-1 bg-yellow p-5 rounded-xs border-yellow hover:bg-transparent hover:cursor-pointer hover:text-white mt-5 ibm-plex-sans-600 ">Register</Button>
                                </form>
                            </Form>

                            <p className='text-light-blue ibm-plex-sans-500 mt-10 text-center'>
                                Have an account already?{' '}
                                <Link to="/login" className='text-yellow underline'>
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right container for image */}
                <div className="w-1/2 h-screen">
                    <img src={registerImg} alt="Login" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
}
