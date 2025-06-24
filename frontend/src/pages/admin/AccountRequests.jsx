import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { NavBar } from '@/components/NavBar'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import denyIcon from '../../assets/icons/admin/deny.png'
import approveIcon from '../../assets/icons/admin/approve.png'
import closeIcon from '../../assets/icons/admin/close.svg'
import closeCircleIcon from '../../assets/icons/admin/close-circle.svg'
import eyeIcon from '../../assets/icons/admin/eye.png'
import swapIcon from '../../assets/icons/admin/arrow-swap.png'
import illustration2 from '../../assets/icons/admin/illustration2.png'
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

const Spinner = ({ size = "sm" }) => (
    <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${size === "sm" ? "h-4 w-4" : "h-6 w-6"
            } border-admin-primary-blue`}
    ></div>
);

export const AccountRequests = () => {
    const { auth } = useAuth();
    const [searchValue, setSearchValue] = useState("");
    const [allStudents, setAllStudents] = useState([]);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [idCardUrl, setIdCardUrl] = useState(null);
    const [showIdCard, setShowIdCard] = useState(false);
    const [sortOldestFirst, setSortOldestFirst] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const studentsRes = await fetch("http://localhost:8080/api/user/allUsers", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!studentsRes.ok) {
                throw new Error("Failed to fetch users");
            }

            const students = await studentsRes.json();
            setAllStudents(students);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users. Please try again.");
        }
    };

    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            await fetchStudents();
            setLoading(false);
        };

        loadStudents();
    }, []);

    const handleApproveRequest = async (userEmail) => {
        if (!userEmail) return;
        setActionLoading(true);

        const url = `http://localhost:8080/api/user/approve/${userEmail}`;

        try {
            const res = await fetch(url, {
                method: "PUT",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Failed to approve user account. Please try again.");
                return;
            }

            toast.success(`Account for ${userEmail} approved successfully!`);
            await fetchStudents();
        } catch (error) {
            console.error("Error approving user:", error);
        } finally {
            setActionLoading(false);
            setShowApprove(false);
        }
    };

    const handleRejectRequest = async (userEmail) => {
        if (!userEmail) return;
        setActionLoading(true);

        try {
            const res = await fetch(`http://localhost:8080/api/user/deny/${userEmail}`, {
                method: "PUT",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Failed to deny user account. Please try again.");
                return;
            }

            toast.success(`Account for ${userEmail} denied successfully!`);
            await fetchStudents();
        } catch (error) {
            console.error("Error denying user:", error);
            toast.error("Something went wrong.");
        } finally {
            setActionLoading(false);
            setShowReject(false);
        }
    };


    const fetchIdCard = async (email) => {
        try {
            const requestUrl = `http://localhost:8080/api/user/idcard/${email}`;
            const response = await fetch(requestUrl, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ID card");
            }

            const blob = await response.blob();
            const idUrl = URL.createObjectURL(blob);
            setIdCardUrl(idUrl);
        } catch (error) {
            console.error("Error fetching ID card:", error);
        }
    };

    if (loading) {
        return <Loader message={"Loading Account Requests Dashboard 🧾"} role={auth.userRole} />;
    }

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
                        <h1 className='text-admin-primary-black text-2xl'>Account Registration Requests</h1>
                        <Button
                            className="bg-transparent text-admin-primary-black shadow-none border-1 border-admin-dark-border hover:cursor-pointer hover:bg-admin-dark-border flex items-center gap-2"
                            onClick={() => {
                                const sortedStudents = [...allStudents].sort((a, b) => {
                                    return sortOldestFirst
                                        ? new Date(a.registrationDate) - new Date(b.registrationDate) // Oldest to Recent
                                        : new Date(b.registrationDate) - new Date(a.registrationDate); // Recent to Oldest
                                });
                                setAllStudents(sortedStudents);
                                setSortOldestFirst(!sortOldestFirst);
                            }}
                        >
                            {sortOldestFirst ? "Oldest to Recent" : "Recent to Oldest"}
                            <img src={swapIcon} alt="sort" />
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg">
                        {allStudents.length > 0 ?
                            <div className="h-[calc(100vh-275px)] overflow-y-scroll rounded-md">
                                <table className="min-w-full text-md text-left border-collapse">
                                    <thead className="sticky top-0 z-10 text-md text-admin-primary-blue uppercase bg-admin-bg border-admin-bg">
                                        <tr>
                                            <th scope="col" className="p-4">Name</th>
                                            <th scope="col" className="">Date Joined</th>
                                            <th scope="col" className="">University ID</th>
                                            <th scope="col" className="">University ID Card</th>
                                            <th scope="col" className="">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {allStudents.map((student, index) => (
                                            <tr key={index} className="border-b border-admin-bg">
                                                <td className="p-4">
                                                    <div className="flex gap-3 items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <AvatarFallback name={student.fullName} />
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col items-start'>
                                                            <div className=''>
                                                                {student.fullName}
                                                            </div>
                                                            <div className='text-admin-secondary-black ibm-plex-sans-300'>
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {student.registrationDate
                                                        ? new Date(student.registrationDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        : "—"}
                                                </td>
                                                <td>{student.universityId}</td>
                                                <td>
                                                    <Button
                                                        className="flex items-center flex-wrap text-admin-primary-blue bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                        onClick={() => {
                                                            setSelectedUser(student.email);
                                                            fetchIdCard(student.email);
                                                            setShowIdCard(true);
                                                        }}
                                                    >
                                                        <img src={eyeIcon} alt="eye" />
                                                        View Id Card
                                                    </Button>
                                                </td>
                                                <td>
                                                    {student.accountStatus != "Verified" && student.accountStatus != "Denied" ?
                                                        <div className='flex items-start gap-2'>
                                                            <Button
                                                                className="m-0 p-0 bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                                onClick={() => {
                                                                    setSelectedUser(student.email);
                                                                    setShowApprove(true);
                                                                }}
                                                            >
                                                                <span className='bg-admin-green-bg text-green-600 rounded-sm ibm-plex-sans-600 py-3 px-2'>Approve Account</span>
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedUser(student.email);
                                                                    setShowReject(true);
                                                                }}
                                                                className="p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                                            >
                                                                <img src={closeCircleIcon} alt="close" className="h-6 w-8" />
                                                            </Button>
                                                        </div>
                                                        :
                                                        <span
                                                            className={`rounded-sm ibm-plex-sans-600 py-3 px-2 ${student.accountStatus === "Verified"
                                                                ? "bg-admin-green-bg text-green-600"
                                                                : "bg-admin-red-bg text-red-600"
                                                                }`}
                                                        >
                                                            {student.accountStatus}
                                                        </span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className='flex flex-col items-center gap-3 my-10 h-[720px] justify-center'>
                                <img src={illustration2} alt="" className='h-[144px] w-[210px] mb-4' />
                                <h1>No Pending Account Requests</h1>
                                <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                                    There are currently no account requests awaiting approval.
                                </p>
                            </div>
                        }

                        {showApprove && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowApprove(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    {actionLoading ? (
                                        <div className="flex flex-col items-center py-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-admin-primary-blue border-t-transparent mb-4" />
                                            <p className="text-admin-primary-blue font-medium">Approving student...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='p-4 bg-admin-green-bg rounded-full'>
                                                <img src={approveIcon} alt="" className='h-15 w-15' />
                                            </div>

                                            <h1 className='mt-5'>Approve Student Account</h1>
                                            <p className='text-sm ibm-plex-sans-300 text-admin-secondary-black'>
                                                Approve the student's account request and grant access. A confirmation email will be sent upon approval.
                                            </p>

                                            <Button
                                                onClick={() => handleApproveRequest(selectedUser)}
                                                className="bg-admin-green mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-green"
                                            >
                                                Approve & Send Confirmation
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {showReject && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowReject(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    {actionLoading ? (
                                        <div className="flex flex-col items-center py-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-admin-primary-blue border-t-transparent mb-4" />
                                            <p className="text-admin-primary-blue font-medium">Rejecting student...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='p-4 bg-admin-red-bg rounded-full'>
                                                <img src={denyIcon} alt="" className='h-15 w-15' />
                                            </div>

                                            <h1 className='mt-5'>Deny Account Request</h1>
                                            <p className='text-sm ibm-plex-sans-300 text-admin-secondary-black'>
                                                Denying this request will notify the student they're not eligible due to unsuccessful ID card verification.
                                            </p>

                                            <Button
                                                onClick={() => {
                                                    handleRejectRequest(selectedUser);
                                                }}
                                                className="bg-admin-red mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-red"
                                            >
                                                Deny & Notify Student
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {showIdCard && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[600px]">
                                    <Button
                                        onClick={() => {
                                            setIdCardUrl(null);
                                            setShowIdCard(false)
                                        }
                                        }
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>
                                    <h1 className='text-xl mb-4 text-admin-primary-black'>ID Card</h1>
                                    {idCardUrl ? (
                                        <img src={idCardUrl} alt="ID Card" className='w-full h-auto rounded-md' />
                                    ) : (
                                        <div className='flex items-center gap-4 justify-center'>
                                            <div className="w-10 h-10 border-4 border-admin-primary-blue border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm text-admin-secondary-black mt-2">Loading ID Card...</p>
                                        </div>

                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
