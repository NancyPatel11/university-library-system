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
import receiptBg from '../../assets/images/receipt-bg.png'
import bookicon from "../../assets/icons/logo.svg";
import illustration1 from '../../assets/icons/admin/illustration1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'sonner'
import html2canvas from 'html2canvas-pro'

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
    const [allBooks, setAllBooks] = useState([]);
    const [allBorrowRequests, setAllBorrowRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sortOldestFirst, setSortOldestFirst] = useState(true);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedReceiptRequest, setSelectedReceiptRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);


    const downloadReceiptAsPNG = () => {
        const receiptElement = document.getElementById("receipt");
        if (!receiptElement) {
            console.error("Receipt element not found");
            return;
        }

        html2canvas(receiptElement, { scale: 2 })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = "receipt.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            })
            .catch((error) => {
                console.error("Error generating image:", error);
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [booksRes, borrowRequestsRes] = await Promise.all([
                    fetch("/api/books/allBooks", {
                        method: "GET",
                        credentials: "include",
                    }),
                    fetch("/api/borrow-requests/all-borrow-requests", {
                        method: "GET",
                        credentials: "include",
                    }),
                ]);

                if (!booksRes.ok || !borrowRequestsRes.ok) {
                    throw new Error("One or more fetches failed");
                }

                const [books, borrowRequests] = await Promise.all([
                    booksRes.json(),
                    borrowRequestsRes.json(),
                ]);

                setAllBooks(books);

                const sortedBorrowRequests = borrowRequests.sort((a, b) => {
                    return new Date(b.requestDate) - new Date(a.requestDate); // Sort by recent to oldest
                });
                setAllBorrowRequests(sortedBorrowRequests);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Something went wrong while loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApproveRequest = async (request) => {
        setApproving(true);
        try {
            const book = allBooks.find((b) => b.id === request.bookId);

            if (!book || book.available_copies <= 0) {
                toast.error("Can't issue this book to the student. No copies available right now. Check back later.");
                return;
            }

            const response = await fetch(`/api/borrow-requests/approve-request/${request.id}`, {
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
        } finally {
            setApproving(false);
            setShowApprovalModal(false);
        }
    };


    if (loading) {
        return <Loader message={"Loading Book Borrow Requests 📚"} role={auth.userRole} />;
    }

    console.log("All Books:", allBooks);
    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div>
                    <h1 className='text-admin-primary-black text-2xl'>Hey, {auth.name}</h1>
                    <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Review and manage all student book borrow requests here</p>
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
                        {allBorrowRequests.length > 0 ?
                            <div className="h-[calc(100vh-275px)] overflow-y-scroll rounded-md">
                                <table className="min-w-full text-md text-left border-collapse">
                                    <thead className="sticky top-0 z-10 text-md text-admin-primary-blue uppercase bg-admin-bg border-admin-bg">
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
                                        {allBorrowRequests.map((request) => {
                                            return (
                                                <tr key={request.id} className="border-b hover:bg-admin-light-blue transition-colors duration-200">
                                                    <td className="p-4 flex items-center gap-4">
                                                        <div className="relative">
                                                            <BookCoverSvg coverColor={request.bookColor} width={45} height={60} />
                                                            <img
                                                                src={request.bookCover}
                                                                alt={request.bookTitle}
                                                                className="absolute top-0 left-1 w-[41px] h-[53px] object-fit rounded-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className='text-admin-primary-black'>{request.bookTitle}</h3>
                                                            <p className='text-admin-secondary-black text-sm'>{request.bookAuthor}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-2 items-center">
                                                            <AvatarFallback name={request.studentFullName} />
                                                            <div className='flex flex-col items-start'>
                                                                <div>{request.studentFullName}</div>
                                                                <div className='text-admin-secondary-black ibm-plex-sans-300'>{request.studentEmail}</div>
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
                                                        {request.status !== "Pending" &&
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedReceiptRequest(request);
                                                                    setShowReceiptModal(true);
                                                                }}
                                                                className="hover:opacity-80 hover:cursor-pointer text-admin-primary-blue flex gap-1 bg-admin-bg p-2 rounded-sm"
                                                            >
                                                                <img src={receiptIcon} alt="receipt" className="h-6 mx-auto" />
                                                                <p>Generate</p>
                                                            </button>
                                                        }

                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className='flex flex-col items-center gap-3 my-10 h-[720px] justify-center'>
                                <img src={illustration1} alt="" className='h-[144px] w-[193px] mb-4' />
                                <h1>No Book Requests</h1>
                                <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                                    There are no borrow book requests awaiting your review at this time.
                                </p>
                            </div>
                        }

                        {showApprovalModal && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowApprovalModal(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                        disabled={approving}
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    {approving ? (
                                        <div className="flex gap-3 items-center justify-center mt-2 mb-3">
                                            <Loader small admin />
                                            <p className='text-admin-primary-blue font-medium'>Approving request, please wait...</p>
                                        </div>
                                    ) : (
                                        <>
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
                                                }}
                                                className="bg-admin-green mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-green"
                                            >
                                                Approve & Send Confirmation
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {showReceiptModal && selectedReceiptRequest && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                                <div
                                    className="relative bg-white w-[625px] p-8 rounded-lg shadow-lg"
                                >
                                    <Button
                                        onClick={() => setShowReceiptModal(false)}
                                        className="absolute top-1 right-0 bg-transparent hover:bg-gray-100 shadow-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-3 w-3" />
                                    </Button>

                                    <div
                                        id="receipt"
                                        className='bg-admin-receipt-bg p-5'
                                    >
                                        <div
                                            className="h-full bg-center bg-no-repeat p-8 text-white"
                                            style={{
                                                backgroundImage: `url(${receiptBg})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'top',
                                            }}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <img src={bookicon} alt="book icon" className="h-8" />
                                                <h3 className="ibm-plex-sans-500 text-3xl">
                                                    <a href="/home">Bookademia</a>
                                                </h3>
                                            </div>

                                            <div>
                                                <h1 className='text-2xl mt-6'>Borrow Receipt</h1>
                                                <p className='text-lg ibm-plex-sans-300 mt-2'>
                                                    Date Issued:
                                                    <span className='ps-2 ibm-plex-sans-500 text-yellow'>
                                                        {new Date().toLocaleDateString("en-GB")}
                                                    </span>
                                                </p>
                                                <p className='text-lg ibm-plex-sans-300 mt-2'>
                                                    Issued for:
                                                    <span className='ps-2 ibm-plex-sans-500 text-yellow'>
                                                        {selectedReceiptRequest.studentFullName} ({selectedReceiptRequest.studentEmail})
                                                    </span>
                                                </p>
                                            </div>

                                            <hr className='my-5' style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                                            <div className='text-gray-300 ibm-plex-sans-300'>
                                                <h1 className='text-xl text-white mb-2 ibm-plex-sans-500'>Book Details</h1>
                                                <div className="space-y-1 pl-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white ">•</span>
                                                        <span>Title: <span className="ibm-plex-sans-500 text-white">{selectedReceiptRequest.bookTitle}</span></span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        <span>Author: <span className="ibm-plex-sans-500 text-white">{selectedReceiptRequest.bookAuthor}</span></span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        <span>Borrowed On: <span className="ibm-plex-sans-500 text-white"> {new Date(selectedReceiptRequest.issueDate).toLocaleDateString()}</span></span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        <span>Due Date: <span className="ibm-plex-sans-500 text-white"> {new Date(selectedReceiptRequest.dueDate).toLocaleDateString()}</span></span>
                                                    </div>

                                                </div>
                                            </div>

                                            <hr className='my-5' style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                                            <div className='text-gray-300 ibm-plex-sans-300'>
                                                <h1 className='text-xl text-white mb-2 ibm-plex-sans-500'>Terms</h1>
                                                <div className="space-y-1 pl-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        Ensure the book is returned by the due date.
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        Late returns may incur fines.
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        Lost or damaged books may incur replacement costs.
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-white">•</span>
                                                        Contact us for any issues or concerns.
                                                    </div>
                                                </div>
                                            </div>

                                            <hr className='my-5' style={{ border: "none", height: "1px", backgroundColor: "#D6E0FF1A" }} />

                                            <div className='text-gray-300 ibm-plex-sans-300'>
                                                <p>Thank you for using <span className='ibm-plex-sans-500 text-white'>Bookademia!</span></p>
                                                <p>Website: <span className='ibm-plex-sans-500 text-white'>bookademia.example.com</span></p>
                                                <p>Email: <span className='ibm-plex-sans-500 text-white'>nancypatel5757@gmail.com</span></p>
                                            </div>


                                        </div>

                                    </div>

                                    <Button
                                        onClick={downloadReceiptAsPNG}
                                        className="mt-6 w-full bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer"
                                    >
                                        Download Receipt
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >
    )
}
