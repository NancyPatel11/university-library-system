import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext.jsx'
import { NavBar } from '@/components/NavBar'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import BookCoverSvg from '@/components/BookCoverSvg'
import trashIcon from '../../assets/icons/admin/trash.svg'
import editIcon from '../../assets/icons/admin/edit.svg'
import plusBlackIcon from '../../assets/icons/admin/plusBlack.svg'
import closeIcon from '../../assets/icons/admin/close.svg'
import swapIcon from '../../assets/icons/admin/arrow-swap.png'
import denyIcon from '../../assets/icons/admin/deny.png'
import { toast } from 'sonner'

export const AllBooks = () => {
    const { auth } = useAuth();
    const [searchValue, setSearchValue] = useState("");
    const [allBooks, setAllBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sortAZ, setSortAZ] = useState(true);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const sortBooksAlphabetically = () => {
        const sorted = [...allBooks].sort((a, b) => {
            return sortAZ
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        setAllBooks(sorted);
        setSortAZ(!sortAZ);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8080/api/books/allBooks", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }

                const data = await response.json();
                setAllBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
                toast.error("Failed to load books. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);

    const handleDeleteBook = async (bookId) => {
        try {
            console.log("Deleting book with ID:", bookId);
            const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to delete book");
                throw new Error("Failed to delete book");
            }

            toast.success(data.message);
            setAllBooks(allBooks.filter(book => book.id !== bookId));
        } catch (error) {
            console.error("Error deleting book:", error);
            toast.error("Failed to delete book. Please try again later.");
        }
        setSelectedBook(null);
    };


    if (loading) {
        return <Loader message={"Loading All Books 📚"} role={auth.userRole} />;
    }

    console.log("All Books:", allBooks);
    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className='text-admin-primary-black text-2xl'>Welcome, {auth.name}</h1>
                        <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Monitor all of your projects and tasks here</p>
                    </div>
                    <div>
                        <form className="ibm-plex-sans-300 w-[350px]">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-admin-primary-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="block w-full p-3 ps-10 text-sm border border-admin-dark-border rounded-sm bg-white 
                       text-admin-secondary-black focus:outline-none caret-admin-primary-blue"
                                    placeholder="Search users, books by title, author, genre."
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <div className='bg-white mt-10 rounded-lg py-8 px-5 ibm-plex-sans-500'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-admin-primary-black text-2xl'>All Books</h1>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={sortBooksAlphabetically}
                                className="bg-transparent text-admin-primary-black shadow-none border-1 border-admin-dark-border hover:cursor-pointer hover:bg-admin-dark-border flex items-center gap-2"
                            >
                                {sortAZ ? "Sort A-Z" : "Sort Z-A"}
                                <img src={swapIcon} alt="sort" />
                            </Button>
                            <Button className="group flex items-center justify-start gap-3 border-admin-dark-border border-1 text-admin-bg bg-admin-primary-blue hover:text-admin-primary-blue hover:bg-admin-bg hover:cursor-pointer">
                                <div className="rounded-full bg-admin-primary-blue group-hover:bg-admin-bg transition-all">
                                    <img
                                        src={plusBlackIcon}
                                        alt="plus"
                                        className="invert group-hover:block h-3 w-3 group-hover:invert-0 "
                                    />
                                </div>
                                Create a New Book
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-full text-md text-left border-collapse">
                            <thead className="text-md text-admin-primary-blue uppercase bg-admin-bg border-admin-bg">
                                <tr>
                                    <th scope="col" className="p-4">Book Title</th>
                                    <th scope="col" className="">Author</th>
                                    <th scope="col" className="">Genre</th>
                                    <th scope="col" className="">Date Created</th>
                                    <th scope="col" className="">Action</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {allBooks.map((book, index) => (
                                    <tr key={index} className="border-b border-admin-bg">
                                        <td className="p-4 font-medium text-admin-primary-black">
                                            <div
                                                className='flex items-center gap-2 hover:cursor-pointer'
                                                onClick={
                                                    () => {
                                                        // Navigate to book details page
                                                        navigate(`/bookdetails/${book.id}`)
                                                    }
                                                }
                                            >
                                                <div className="relative">
                                                    <BookCoverSvg coverColor={book.color} width={45} height={60} />
                                                    <img
                                                        src={book.cover}
                                                        alt={book.title}
                                                        className="absolute top-0 left-1 w-[41px] h-[53px] object-fit rounded-xs"
                                                    />
                                                </div>
                                                {book.title}
                                            </div>
                                        </td>
                                        <td>{book.author}</td>
                                        <td>{book.genre}</td>
                                        <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex gap-2 items-center">
                                                <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none" onClick={() => {

                                                }}>
                                                    <img src={editIcon} alt="edit" />
                                                </Button>
                                                <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none" onClick={() => {
                                                    setSelectedBook(book);
                                                    setShowDeleteModal(true);
                                                }}>
                                                    <img src={trashIcon} alt="trash" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showDeleteModal && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    <div className='p-4 bg-admin-red-bg rounded-full'>
                                        <img src={denyIcon} alt="" className='h-15 w-15' />
                                    </div>

                                    <h1 className='mt-5'>Delete Book</h1>
                                    <p className='text-sm ibm-plex-sans-300 text-admin-secondary-black'>
                                        Deleting this book will remove it from the library and notify the student who borrowed it. Are you sure you want to proceed?
                                    </p>

                                    <Button
                                        onClick={() => {
                                            handleDeleteBook(selectedBook.id);
                                            setShowDeleteModal(false);
                                        }}
                                        className="bg-admin-red mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-red"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
