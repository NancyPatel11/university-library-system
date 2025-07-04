import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from '@/components/Loader'
import { NavBar } from '@/components/NavBar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const formSchema = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    genre: z.string().min(1),
    totalCopies: z.coerce.number().min(1),
    cover: z.string().url(),
    color: z.string().min(1),
    video: z.string().url(),
    description: z.string().min(1),
    summary: z.string().min(1),
});

export const EditBookDetails = () => {
    const { bookId } = useParams(); // Book ID from route
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: "",
            totalCopies: 1,
            cover: "",
            color: "#000000",
            video: "",
            description: "",
            summary: "",
        },
    });

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
                    credentials: "include"
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch book details");
                }

                form.reset({
                    title: data.title,
                    author: data.author,
                    genre: data.genre,
                    totalCopies: data.total_copies,
                    cover: data.cover,
                    color: data.color,
                    video: data.video,
                    description: data.description,
                    summary: data.summary,
                });
            } catch (error) {
                console.error("Error fetching book details:", error);
                toast.error(error.message || "Failed to load book details");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId, form]);

    const onSubmit = async (values) => {
        try {
            setButtonLoading(true);
            const payload = {
                title: values.title,
                author: values.author,
                genre: values.genre,
                total_copies: values.totalCopies,
                color: values.color,
                description: values.description,
                cover: values.cover,
                video: values.video,
                summary: values.summary
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update book details");
            }

            toast.success(result.message);
            navigate("/bookdetails/" + bookId);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong while updating the book");
        } finally {
            setButtonLoading(false);
        }
    };

    if (loading) {
        return <Loader message={`Preparing book editor... 📝 `} />;
    }

    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div>
                    <h1 className='text-admin-primary-black text-2xl'>Hey, {auth.name}</h1>
                    <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Edit this book's details to keep your library up-to-date</p>
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

                            <Button
                                disabled={buttonLoading}
                                type="submit"
                                className="bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer w-full rounded-xs"
                            >
                                {buttonLoading ? <Loader small admin /> : "Update Book"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}