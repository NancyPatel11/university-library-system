import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { NavBar } from '@/components/NavBar';
import { Loader } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import denyIcon from '../../assets/icons/admin/deny.png'
import approveIcon from '../../assets/icons/admin/approve.png'
import closeIcon from '../../assets/icons/admin/close.svg'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

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

const statusStyles = {
    "Verified": {
        textColor: 'text-admin-green',
        bgColor: 'bg-admin-green-bg',
        icon: faCheckCircle,
    },
    "Verification Pending": {
        textColor: 'text-admin-red',
        bgColor: 'bg-admin-red-bg',
        icon: denyIcon,
    },
    "Denied": {
        textColor: 'text-admin-red',
        bgColor: 'bg-admin-red-bg',
        icon: faExclamationCircle,
    }
};


export const AccountRequest = () => {

    const { auth } = useAuth();

    const { userId } = useParams();
    console.log("User ID from params:", userId);

    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [idCardUrl, setIdCardUrl] = useState("");
    const status = student.accountStatus;
    const { textColor, bgColor, icon } = statusStyles[status] || {};

    const fetchStudent = useCallback(async (userId) => {
        try {
            const studentsRes = await fetch(`/api/user/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!studentsRes.ok) {
                throw new Error("Failed to fetch users");
            }

            const student = await studentsRes.json();
            setStudent(student);
            return student;
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users. Please try again.");
            return null;
        }
    }, []);

    const fetchIdCard = async (email) => {
        try {
            const requestUrl = `/api/user/idcard/${email}`;
            const response = await fetch(requestUrl, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ID card");
            }

            const blob = await response.blob();
            const idUrl = URL.createObjectURL(blob);
            return idUrl;
        } catch (error) {
            console.error("Error fetching ID card:", error);
            toast.error("Failed to load ID card.");
            return null;
        }
    };

    useEffect(() => {
        const loadStudentAndIdCard = async () => {
            setLoading(true);

            const studentData = await fetchStudent(userId);
            if (studentData) {
                setStudent(studentData);

                const idUrl = await fetchIdCard(studentData.email);
                if (idUrl) {
                    setIdCardUrl(idUrl);
                }
            }

            setLoading(false); // done only after both student and ID card are handled
        };

        loadStudentAndIdCard();
    }, [userId, fetchStudent]);

    const handleApproveRequest = async (userEmail) => {
        if (!userEmail) return;
        setActionLoading(true);

        const url = `/api/user/approve/${userEmail}`;

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
            await fetchStudent(userId); // Refresh the student data after approval
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
            const res = await fetch(`/api/user/deny/${userEmail}`, {
                method: "PUT",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Failed to deny user account. Please try again.");
                return;
            }

            toast.success(`Account for ${userEmail} denied successfully!`);
            await fetchStudent(userId); // Refresh the student data after denial
        } catch (error) {
            console.error("Error denying user:", error);
            toast.error("Something went wrong.");
        } finally {
            setActionLoading(false);
            setShowReject(false);
        }
    };


    if (loading) {
        return <Loader message={"Loading Account Requests Dashboard 🧾"} role={auth.userRole} />;
    }

    return (
        <div className="flex">
            <NavBar />
            <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
                <div>
                    <h1 className='text-admin-primary-black text-2xl'>Hey, {auth.name}</h1>
                    <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Manage the pending account registration awaiting your approval</p>
                </div>

                <div className="bg-white mt-10 rounded-lg py-8 px-5 ibm-plex-sans-500 flex gap-10">

                    <div className='text-admin-primary-black ibm-plex-sans-600 text-2xl'>
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
                        <h1 className='mt-8'>University Id: <span className='text-admin-primary-blue'>{student.universityId}</span></h1>
                        <h1 className='mt-2'>Registered On:
                            <span className='text-admin-primary-blue ml-1'>
                                {new Date(student.registrationDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                                )}
                            </span>
                        </h1>

                        <img src={idCardUrl} alt="ID Card" className='mt-8 h-[500px] rounded-md' />

                        <div className='flex gap-5 items-center mt-10'>
                            <div>
                                {student.accountStatus != "Verified" && student.accountStatus != "Denied" ?
                                    <div className='flex items-start gap-2'>
                                        <Button
                                            className="m-0 p-0 bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                            onClick={() => {
                                                setShowApprove(true);
                                            }}
                                        >
                                            <span className='text-lg bg-admin-green-bg text-green-600 rounded-sm ibm-plex-sans-500 py-3 px-2'>Approve Account</span>
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowReject(true);
                                            }}
                                            className="p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                        >
                                            <span className='text-lg bg-admin-red-bg text-red-500 rounded-sm ibm-plex-sans-600 py-3 px-2'>Reject Account</span>
                                        </Button>
                                    </div>
                                    :
                                    <div className='flex gap-2 items-center'>
                                        <FontAwesomeIcon icon={icon} className={`text-3xl ${textColor}`} />
                                        <span
                                            className={`rounded-sm ibm-plex-sans-500 py-2 px-2 ${bgColor} ${textColor} flex items-center gap-2`}
                                        >
                                            {student.accountStatus}
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {showApprove && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                        <Button
                            onClick={() => setShowApprove(false)}
                            className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                            disabled={actionLoading}
                        >
                            <img src={closeIcon} alt="close" className="h-4 w-4" />
                        </Button>

                        {actionLoading ? (
                            <div className="flex gap-3 items-center justify-center mt-2 mb-3">
                                <Loader small admin />
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
                                    onClick={() => handleApproveRequest(student.email)}
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
                            disabled={actionLoading}
                        >
                            <img src={closeIcon} alt="close" className="h-4 w-4" />
                        </Button>

                        {actionLoading ? (
                            <div className="flex gap-3 items-center justify-center mt-2 mb-3">
                                <Loader small admin />
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
                                        handleRejectRequest(student.email);
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

        </div>
    )
}
