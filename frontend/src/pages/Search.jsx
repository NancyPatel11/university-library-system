import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button.jsx';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from 'sonner';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import bg from "../assets/images/bg.png";
import noBooksFoundImg from "../assets/images/no-books.png";

export const Search = () => {
    const { auth } = useAuth();
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [flag, setFlag] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 7;
    const totalPages = Math.ceil(allBooks.length / booksPerPage);

    const fetchBooks = async () => {
        setFlag(false); // Reset flag before fetching books
        try {
            const response = await fetch("http://localhost:8080/api/books/allBooks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }

            const data = await response.json();

            const sortedData = data.sort((a, b) => {
                // Sort by title alphabetically
                return a.title.localeCompare(b.title);
            });

            setAllBooks(sortedData);
            if (data.length === 0) {
                toast.error("No books available at the moment. Please check back later.");
                setFlag(true); // Set flag to true if no books found
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false); // loader stops here
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent page reload on submit
        setFlag(false); // Reset flag before searching

        if (!searchValue.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/books/search/${searchValue}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Search failed");

            const data = await response.json();
            if (data.length === 0) {
                toast.error("No books found for your search query.");
                setFlag(true);
                return;
            }
            toast.success("Books found!");
            setAllBooks(data); // Update the state with search results
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };


    if (loading) {
        return <Loader message={"Navigating you to search... 🔎"} role={auth.userRole} />;
    }

    if (allBooks.length === 0) {
        return (
            <div
                className="h-full bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                }}
            >
                <div className='px-20 py-12'>
                    <NavBar searchColor={'yellow'} />
                    <div className='flex flex-col items-center justify-center h-screen ibm-plex-sans-600'>
                        <img src={noBooksFoundImg} alt="No Books Found" className="max-w-md" />
                        <h1 className='text-white text-4xl mt-10'>No Books in the Library Currently</h1>
                        <p className='text-light-blue text-2xl mt-5'>Please check back later</p>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen h-full bg-center bg-no-repeat`}
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            }}
        >
            <div className='px-20 py-12'>
                <NavBar searchColor={'yellow'} />
                <div className='text-center'>
                    <h1 className='ibm-plex-sans-400 text-md mt-14 text-light-blue'>DISCOVER YOUR NEXT GREAT READ:</h1>
                    <h1 className='ibm-plex-sans-600 text-6xl mt-5 text-white'>Explore and Search for <br /> <span className='text-yellow'>Any Book</span> in our Library</h1>

                    <form onSubmit={handleSearch} className="max-w-md mx-auto ibm-plex-sans-400 mt-10">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-yellow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="block w-full p-2 ps-10 text-sm border border-search-bar rounded-sm bg-search-bar 
                       text-light-blue focus:outline-none focus:border-yellow caret-yellow"
                                    placeholder="Search books by name, author, genre..."
                                />

                                <Button
                                    type="submit"
                                    className="text-md ibm-plex-sans-600 bg-yellow text-dark-end rounded-sm border-2 border-yellow 
                       hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {flag == true ?
                    <div className='flex flex-col items-center justify-center mt-18 ibm-plex-sans-400'>
                        <img src={noBooksFoundImg} alt="No Books Found" className="max-w-md" />
                        <h1 className='text-white text-3xl mt-10 ibm-plex-sans-500'>No Results Found</h1>
                        <p className='text-light-blue text-lg mt-3'>We couldn't find any books matching your search.</p>
                        <p className='text-light-blue text-lg'>Try using different keywords or check for typos.</p>

                        <Button className="text-md px-13 mt-3 ibm-plex-sans-600 bg-yellow text-dark-end rounded-xs 
                       hover:bg-yellow-dark hover:cursor-pointer" onClick={() => {
                                setSearchValue("");     // clear search bar
                                fetchBooks();           // fetch all books again
                                setCurrentPage(1); // reset to first page
                                toast.success("Search cleared, showing all books.");
                            }}>
                            Clear Search
                        </Button>

                    </div>
                    :
                    <div className='text-white ibm-plex-sans-500 mt-18'>
                        <h1 className='text-3xl text-light-blue mb-10'>Search Results</h1>
                        <div className='flex flex-wrap gap-10 justify-start mt-5'>
                            {allBooks
                                .slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)
                                .map((book, index) => (
                                    <div key={index} className="relative h-[400px]">
                                        <Link to={`/bookdetails/${book.id}`}>
                                            <BookCoverSvg coverColor={book.color} width={200} height={280} />
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="absolute top-0 left-4 w-[183px] h-[245px] object-fit rounded-lg"
                                            />
                                            <div className="mt-3 w-[183px]">
                                                <h2 className="text-lg w-[183px]">{book.title} - By {book.author}</h2>
                                                <p className="text-sm text-light-blue italic truncate">{book.genre}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                        <div className='flex flex-wrap gap-3 items-baseline justify-between mt-14'>
                            <Button
                                className="text-md px-13 ibm-plex-sans-600 bg-yellow text-dark-end rounded-xs 
        hover:bg-yellow-dark hover:cursor-pointer"
                                onClick={() => {
                                    setSearchValue("");
                                    fetchBooks();
                                    setCurrentPage(1); // Reset to first page
                                    toast.success("Search cleared, showing all books.");
                                }}
                            >
                                Clear Search
                            </Button>
                            <Pagination className="text-light-blue">
                                <PaginationContent>
                                    {/* Previous */}
                                    <PaginationItem className="bg-search-bar rounded-sm">
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                                            }}
                                        />
                                    </PaginationItem>

                                    {/* Pages logic */}
                                    {totalPages <= 5 ? (
                                        // Case: Show all pages when totalPages is 5 or fewer
                                        [...Array(totalPages)].map((_, index) => (
                                            <PaginationItem key={index} className="bg-search-bar rounded-sm">
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(index + 1);
                                                    }}
                                                    className={currentPage === index + 1 ? "bg-yellow border-yellow text-black" : ""}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))
                                    ) : (
                                        // Case: totalPages > 5
                                        <>
                                            {/* First page always */}
                                            <PaginationItem className="bg-search-bar rounded-sm">
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(1);
                                                    }}
                                                    className={currentPage === 1 ? "bg-yellow border-yellow text-black" : ""}
                                                >
                                                    1
                                                </PaginationLink>
                                            </PaginationItem>

                                            {/* Ellipsis after 1 if currentPage > 2 */}
                                            {currentPage > 2 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {/* Show current page if not 1 or totalPages */}
                                            {currentPage !== 1 && currentPage !== totalPages && (
                                                <PaginationItem className="bg-search-bar rounded-sm">
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(currentPage);
                                                        }}
                                                        className="bg-yellow border-yellow text-black"
                                                    >
                                                        {currentPage}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}

                                            {/* Ellipsis before last page if currentPage < totalPages - 1 */}
                                            {currentPage < totalPages - 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {/* Last page always */}
                                            <PaginationItem className="bg-search-bar rounded-sm">
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(totalPages);
                                                    }}
                                                    className={currentPage === totalPages ? "bg-yellow border-yellow text-black" : ""}
                                                >
                                                    {totalPages}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}

                                    {/* Next */}
                                    <PaginationItem className="bg-search-bar rounded-sm">
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
