import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ReceiptModal } from '@/components/ReceiptModal'
import { Loader } from '@/components/Loader'
import { NavBar } from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import BookCoverSvg from '@/components/BookCoverSvg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import calendarIcon from '@/assets/icons/calendar.svg'
import receiptIcon from '@/assets/icons/receipt.svg'
import approveIcon from '../../assets/icons/admin/approve.png'
import closeIcon from '../../assets/icons/admin/close.svg'
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
            className={`h-15 w-15 rounded-full flex items-center justify-center font-semibold text-2xl ${bg} ${text} ${border} border`}
        >
            {initials}
        </div>
    );
};

export const BorrowRequest = () => {
    const { borrowRequestId } = useParams();
    console.log("Borrow Request ID:", borrowRequestId);

    const { auth } = useAuth();
    const navigate = useNavigate();

    const [borrowRequest, setBorrowedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedReceiptRequest, setSelectedReceiptRequest] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchBorrowRequest = async () => {
            try {
                const response = await fetch(`/api/borrow-requests/${borrowRequestId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch borrow request");
                }

                setBorrowedRequest(data);
            } catch (error) {
                toast.error(error.message || "Failed to fetch borrow request");
                console.error('Error fetching borrow request:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowRequest();
    }, [borrowRequestId]);

    const handleApproveRequest = async (request) => {
        setApproving(true);
        try {
            const response = await fetch(`/api/borrow-requests/approve-request/${request.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.status === 409) {
                const data = await response.json();
                toast.error(data.message || "Book not available for borrowing.");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to approve request");
            }

            toast.success("Request approved successfully!");

            setBorrowedRequest((prevRequest) => ({
                ...prevRequest,
                status: "Borrowed",
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Set due date to 14 days from now
            }));
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error(error.message || "Failed to approve request");
        } finally {
            setApproving(false);
            setShowApprovalModal(false);
        }
    };

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


    if (loading) {
        return <Loader role={auth.userRole} message={"Loading borrow request details..."} />
    }

    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div>
                    <h1 className='text-admin-primary-black text-2xl'>Hey, {auth.name}</h1>
                    <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Review and manage this student book borrow request here</p>
                </div>

                <Button
                    onClick={() => navigate(-1)}
                    className={`mt-10 bg-white text-admin-primary-black shadow-none hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer `}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Go Back
                </Button>

                <div className='flex flex-col mt-10 ibm-plex-sans-600 gap-7'>
                    <h1 className='text-4xl'>Borrow Request </h1>
                    <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Book Requested: </h1>
                    <div className='flex gap-5'>
                        <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden">
                            {/* Background */}
                            <div
                                className="absolute inset-0 z-0 rounded-xs"
                                style={{
                                    backgroundColor: borrowRequest.bookColor,
                                    opacity: 0.5,
                                }}
                            />

                            {/* Book SVG + Image */}
                            <div className="relative z-10 flex justify-center items-center w-full h-full">
                                <div className="relative">
                                    <BookCoverSvg coverColor={borrowRequest.bookColor} width={90} height={120} />
                                    <img
                                        src={borrowRequest.bookCover}
                                        alt={borrowRequest.bookTitle}
                                        className="absolute top-0 left-2 w-[82px] h-[106px] object-fit rounded-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 justify-around'>
                            <h1 className='text-4xl'>{borrowRequest.bookTitle}</h1>
                            <h1 className='text-2xl'>By {borrowRequest.bookAuthor}</h1>
                            <div className='flex gap-2 items-center'>
                                <h1 className='text-2xl text-admin-secondary-black ibm-plex-sans-300'>Status: </h1>
                                <h1
                                    className={`text-2xl px-3 py-1 rounded-sm inline-block ${borrowRequest.status === 'Borrowed'
                                        ? 'bg-light-blue text-admin-primary-blue'
                                        : borrowRequest.status === 'Returned'
                                            ? 'bg-admin-green-bg text-admin-dark-green'
                                            : 'bg-admin-red-bg text-admin-dark-red'
                                        }`}
                                >
                                    {borrowRequest.status}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-3 justify-around'>
                        <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Requested By: </h1>
                        <div className='flex gap-4 items-center text-xl'>
                            <AvatarFallback name={borrowRequest.studentFullName} />
                            <div className='flex flex-col items-start'>
                                <div>{borrowRequest.studentFullName}</div>
                                <div className='text-admin-secondary-black ibm-plex-sans-300'>{borrowRequest.studentEmail}</div>
                            </div>
                        </div>
                    </div>


                    <div className='flex gap-2 items-center'>
                        <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Requested On: </h1>
                        <div className='flex gap-2 text-xl items-center'>
                            <img src={calendarIcon} alt="" />
                            <p>{new Date(borrowRequest.requestDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {borrowRequest.issueDate && <div className='flex gap-2 items-center'>
                        <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Issued On: </h1>
                        <div className='flex gap-2 text-xl items-center'>
                            <img src={calendarIcon} alt="" />
                            <p>{new Date(borrowRequest.issueDate).toLocaleDateString()}</p>
                        </div>
                    </div>}
                    {borrowRequest.dueDate && <div className='flex gap-2 items-center'>
                        <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Due On: </h1>
                        <div className='flex gap-2 text-xl items-center'>
                            <img src={calendarIcon} alt="" />
                            <p>{new Date(borrowRequest.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>}
                    {borrowRequest.status != "Pending" && <div className='flex gap-2 items-center'>
                        <h1 className='text-xl text-admin-secondary-black ibm-plex-sans-300'>Returned On: </h1>
                        {
                            borrowRequest.returnDate ?
                                <div className='flex gap-2 text-xl items-center'>
                                    <img src={calendarIcon} alt="" />
                                    <p>{new Date(borrowRequest.returnDate).toLocaleDateString()}</p>
                                </div>
                                :
                                <p className='text-xl text-admin-dark-red ibm-plex-sans-300'>Not Returned Yet</p>
                        }

                    </div>}
                    {borrowRequest.status === "Pending" && (
                        <Button
                            className="mt-5 w-[800px] bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer"
                            onClick={
                                () => {
                                    setShowApprovalModal(true);
                                }
                            }
                            disabled={approving}
                        >
                            {approving ? "Approving..." : "Approve Request"}
                        </Button>
                    )}
                    {
                        borrowRequest.status != "Pending" && (
                            <Button
                                className="mt-5 w-[800px] bg-admin-primary-blue text-white hover:bg-admin-tertiary-blue hover:cursor-pointer"
                                onClick={
                                    () => {
                                        setSelectedReceiptRequest(borrowRequest);
                                        setShowReceiptModal(true);
                                    }
                                }
                            >
                                <img src={receiptIcon} alt="receipt" className="h-6 mx-3" />
                                <p>Generate Receipt</p>
                            </Button>
                        )
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
                                                handleApproveRequest(borrowRequest);
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
                        <ReceiptModal
                            selectedReceiptRequest={selectedReceiptRequest}
                            onClose={() => setShowReceiptModal(false)}
                            downloadReceiptAsPNG={downloadReceiptAsPNG}
                        />
                    )}

                </div>
            </div>
        </div >
    )
}
