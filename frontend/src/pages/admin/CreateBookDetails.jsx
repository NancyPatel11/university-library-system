import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext'
import { NavBar } from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    genre: z.string().min(1, "Genre is required"),
    totalCopies: z.coerce.number().min(1, "Must be at least 1"),
    cover: z.string().url(1, "Cover is required"),
    color: z.string().min(1, "Color is required"),
    video: z.string().url("Invalid video URL"),
    description: z.string().min(1, "Description is required"),
    summary: z.string().min(1, "Summary is required"),
});

export const CreateBookDetails = () => {
    const { auth } = useAuth()
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: "",
            totalCopies: 1,
            cover: "",
            color: "",
            video: "",
            summary: "",
        },
    });

    const onSubmit = async (values) => {
        const payload = {
            title: values.title,
            author: values.author,
            genre: values.genre,
            total_copies: values.totalCopies,
            color: values.color,
            description: values.description || "",
            cover: values.cover || "",
            video: values.video || "",
            summary: values.summary || ""
        };

        try {
            const response = await fetch("http://localhost:8080/api/books/createBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to create book");
            }

            const result = await response.json();
            toast.success(result.message);
            form.reset(); // reset the form after submission
        } catch (error) {
            console.error("Error creating book:", error);
            toast.error("Something went wrong while creating the book.");
        }
    };

    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className='text-admin-primary-black text-2xl'>Welcome, {auth.name}</h1>
                        <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Create a new book entry below</p>
                    </div>
                    <div>
                        <form className="ibm-plex-sans-300 w-[350px]">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-admin-primary-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="block w-full p-3 ps-10 text-sm border border-admin-dark-border rounded-sm bg-white text-admin-secondary-black focus:outline-none caret-admin-primary-blue"
                                    placeholder="Search users, books by title, author, genre."
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <Button
                    onClick={() => navigate(-1)}
                    className={`mt-10 bg-white text-admin-primary-black shadow-none hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer `}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Go Back
                </Button>

                <div className="mt-10 rounded-lg w-[950px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Enter the book title"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="author" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Enter the author's name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="genre" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Enter the genre of the book"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="totalCopies" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Number of Books</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            className={`rounded-xs py-5 ibm-plex-sans-400 bg-white`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="cover" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Enter image URL for the book cover"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField
                                name="color"
                                render={({ field: { value, onChange, ...rest } }) => {
                                    // Valid hex check: 7 characters starting with #
                                    const isValidHex = /^#([0-9A-Fa-f]{6})$/.test(value);

                                    return (
                                        <FormItem>
                                            <FormLabel>Book Primary Color</FormLabel>
                                            <FormControl>
                                                <div className="relative w-full">
                                                    {/* Color Picker Inside Input */}
                                                    <input
                                                        type="color"
                                                        value={isValidHex ? value : "#000000"} // fallback during typing
                                                        onChange={(e) => onChange(e.target.value)}
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 border-none cursor-pointer bg-transparent"
                                                        style={{ appearance: "none" }}
                                                    />
                                                    {/* Text Input */}
                                                    <Input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => onChange(e.target.value)}
                                                        placeholder="#000000"
                                                        className="pl-12 pr-4 py-5 rounded-xs text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white"
                                                        {...rest}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField name="video" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Video URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Enter Youtube video URL for the book trailer"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className='rounded-xs py-5 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white'
                                            placeholder="Write a two-liner description of the book"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="summary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Book Summary</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={4}
                                            {...field}
                                            className={`rounded-xs py-2 text-admin-primary-black placeholder-admin-secondary-black ibm-plex-sans-400 bg-white`}
                                            placeholder="Write a brief summary of the book"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button type="submit" className="bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer w-full rounded-xs">
                                Create Book
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}