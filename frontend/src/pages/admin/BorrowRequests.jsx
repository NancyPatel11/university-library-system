import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { NavBar } from '@/components/NavBar'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import BookCoverSvg from '@/components/BookCoverSvg'
import closeIcon from '../../assets/icons/admin/close.svg'
import swapIcon from '../../assets/icons/admin/arrow-swap.png'
import approveIcon from '../../assets/icons/admin/approve.png'
import receiptIcon from '../../assets/icons/admin/receipt.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'sonner'

const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const initials = parts[0][0] + (parts[1]?.[0] || "");
    return initials.toUpperCase();
};

const AvatarFallback = ({ name }) => {
    const initials = getInitials(name);
    const { bg, text, border } = { bg: "bg-blue-200", text: "text-blue-700", border: "border-blue-700" }

    return (
        <div
            className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${bg} ${text} ${border} border`}
        >
            {initials}
        </div>
    );
};

export const BorrowRequests = () => {
    const { auth } = useAuth();
    const [searchValue, setSearchValue] = useState("");
    const [allBooks, setAllBooks] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [allBorrowRequests, setAllBorrowRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sortOldestFirst, setSortOldestFirst] = useState(true);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("Failed to load books. Please try again later.");
        }
    }

    const fetchStudents = async () => {
        try {
            const studentsRes = await fetch("http://localhost:8080/api/user/allUsers", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })

            if (!studentsRes.ok) {
                throw new Error("Failed to fetch users");
            }

            const students = await studentsRes.json()
            setAllStudents(students);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const fetchBorrowRequests = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/borrow-requests/all-borrow-requests", {
                method: "GET",
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to fetch borrow requests");
            }

            const data = await response.json();
            console.log("Borrow Requests Data:", data);
            setAllBorrowRequests(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching borrow requests:", error);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchBorrowRequests();
    }, []);


    useEffect(() => {
        setLoading(true);
        fetchStudents();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchBooks();
    }, []);

    const handleApproveRequest = async (request) => {
        try {
            const book = allBooks.find((b) => b.id === request.bookId);

            if (!book || book.available_copies <= 0) {
                toast.error("Can't issue this book to the student. No copies available right now. Check back later.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/borrow-requests/approve-request/${request.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to approve request");
            }

            const data = await response.json();
            console.log("Approval Response:", data);
            toast.success("Request approved successfully!");

            setAllBorrowRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === data.id ? data : req
                )
            );
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Failed to approve request. Please try again later.");
        }
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
                        <h1 className='text-admin-primary-black text-2xl'>Borrow Books Requests</h1>
                        <Button
                            className="bg-transparent text-admin-primary-black shadow-none border-1 border-admin-dark-border hover:cursor-pointer hover:bg-admin-dark-border flex items-center gap-2"
                            onClick={() => {
                                const sortedRequests = [...allBorrowRequests].sort((a, b) => {
                                    return sortOldestFirst
                                        ? new Date(a.requestDate) - new Date(b.requestDate) // Oldest to Recent
                                        : new Date(b.requestDate) - new Date(a.requestDate); // Recent to Oldest
                                });
                                setAllBorrowRequests(sortedRequests);
                                setSortOldestFirst(!sortOldestFirst);
                            }}
                        >
                            {sortOldestFirst ? "Oldest to Recent" : "Recent to Oldest"}
                            <img src={swapIcon} alt="sort" />
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-full text-md text-left border-collapse">
                            <thead className="text-md text-admin-primary-blue uppercase bg-admin-bg border-admin-bg">
                                <tr>
                                    <th scope="col" className="p-4">Book</th>
                                    <th scope="col">Requested By</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Request Date</th>
                                    <th scope="col">Borrowed Date</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Return Date</th>
                                    <th scope="col">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {allBorrowRequests.length > 0 ? allBorrowRequests.map((request) => {
                                    const book = allBooks.find(book => book.id === request.bookId);
                                    const student = allStudents.find(student => student.email === request.studentEmail);

                                    if (!book || !student) return null;

                                    return (
                                        <tr key={request.id} className="border-b hover:bg-admin-light-blue transition-colors duration-200">
                                            <td className="p-4 flex items-center gap-4">
                                                <div className="relative">
                                                    <BookCoverSvg coverColor={book.color} width={45} height={60} />
                                                    <img
                                                        src={book.cover}
                                                        alt={book.title}
                                                        className="absolute top-0 left-1 w-[41px] h-[53px] object-fit rounded-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className='text-admin-primary-black'>{book.title}</h3>
                                                    <p className='text-admin-secondary-black text-sm'>{book.author}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2 items-center">
                                                    <AvatarFallback name={student.fullName} />
                                                    <div className='flex flex-col items-start'>
                                                        <div>{student.fullName}</div>
                                                        <div className='text-admin-secondary-black ibm-plex-sans-300'>{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {request.status === "Pending"
                                                    ? <Button
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setShowApprovalModal(true);
                                                        }}

                                                        className={`py-1 bg-admin-green-bg shadow-none text-green-700 hover:bg-green-200 hover:cursor-pointer`}
                                                    >
                                                        Approve request
                                                        <FontAwesomeIcon icon={faCircleCheck} className="text-green-700 " />
                                                    </Button>
                                                    : <span className={`${request.status === "Borrowed"
                                                        ? "bg-light-blue text-admin-primary-blue"
                                                        : request.status === "Returned"
                                                            ? "bg-admin-green-bg text-green-700"
                                                            :
                                                            "bg-admin-red-bg text-red-700"

                                                        } px-3 py-1 rounded-sm`}>
                                                        {request.status}
                                                    </span>
                                                }
                                            </td>
                                            <td>
                                                {new Date(request.requestDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                })}
                                            </td>
                                            <td
                                                className={
                                                    request.status != "Pending"
                                                        ? "text-admin-primary-black"
                                                        : "text-admin-secondary-black italic"
                                                }
                                            >
                                                {request.status !== "Pending"
                                                    ? new Date(request.issueDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "2-digit",
                                                    })
                                                    : "Approval Pending"}
                                            </td>
                                            <td
                                                className={
                                                    request.status != "Pending"
                                                        ? "text-admin-primary-black"
                                                        : "text-admin-secondary-black italic"
                                                }
                                            >
                                                {request.status != "Pending" ? new Date(request.dueDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                }) : "Approval Pending"}
                                            </td>
                                            <td
                                                className={
                                                    request.status === "Borrowed" || request.status === "Overdue"
                                                        ? "text-admin-dark-red"
                                                        :
                                                        request.status != "Pending"
                                                            ? "text-admin-primary-black"
                                                            : "text-admin-secondary-black italic"
                                                }
                                            >
                                                {request.returnDate ? new Date(request.returnDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                }) : request.status === "Pending" ? "Approval Pending" : "Not Returned Yet"}
                                            </td>
                                            <td className="text-center align-middle">
                                                <img src={receiptIcon} alt="receipt" className="h-6 mx-auto" />
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-6 text-admin-secondary-black">No borrow requests available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>


                        {showApprovalModal && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowApprovalModal(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    <div className='p-4 bg-admin-green-bg rounded-full'>
                                        <img src={approveIcon} alt="" className='h-15 w-15' />
                                    </div>

                                    <h1 className='mt-5'>Approve Book Request</h1>
                                    <p className='text-sm ibm-plex-sans-300 text-admin-secondary-black'>
                                        Approve the student's request to borrow this book. A confirmation email will be sent upon approval.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            handleApproveRequest(selectedRequest);
                                            setShowApprovalModal(false);
                                        }}
                                        className="bg-admin-green mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-green"
                                    >
                                        Approve & Send Confirmation
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
