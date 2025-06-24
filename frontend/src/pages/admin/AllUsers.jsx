import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { NavBar } from '@/components/NavBar'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import trashIcon from '../../assets/icons/admin/trash.svg'
import denyIcon from '../../assets/icons/admin/deny.png'
import closeIcon from '../../assets/icons/admin/close.svg'
import eyeIcon from '../../assets/icons/admin/eye.png'
import swapIcon from '../../assets/icons/admin/arrow-swap.png'
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

export const AllUsers = () => {
    const { auth } = useAuth();
    const [searchValue, setSearchValue] = useState("");
    const [combinedUsers, setCombinedUsers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [idCardUrl, setIdCardUrl] = useState(null);
    const [showIdCard, setShowIdCard] = useState(false);
    const [sortAZ, setSortAZ] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const [studentsRes, adminsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/user/allUsers", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }),
                    fetch("http://localhost:8080/api/admin/allAdmins", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }),
                ]);

                if (!studentsRes.ok || !adminsRes.ok) {
                    throw new Error("Failed to fetch users");
                }

                const [students, admins] = await Promise.all([
                    studentsRes.json(),
                    adminsRes.json(),
                ]);

                const taggedAdmins = admins.map(admin => ({ ...admin, role: "admin" }));
                const taggedStudents = students.map(student => ({ ...student, role: "student" }));

                const combined = [...taggedAdmins, ...taggedStudents];
                setCombinedUsers(combined);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleDeleteUser = async (user) => {
        if (!user) return;

        if (user.role === "student" && user.noBooksBorrowed > 0) {
            toast.error("Cannot delete user having active borrowed books.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/borrow-requests/all-borrow-requests", {
            method: "GET",
            credentials: "include",
        })

        if (!response.ok)
            throw new Error("Failed to fetch borrow requests");

        const borrowRequests = await response.json();
        const filteredRequests = borrowRequests.filter(request => request.studentId === user.id);

        // filter to get only pending borrowrequests
        const pendingRequests = filteredRequests.filter(request => request.status === "Pending");
        console.log("Pending Requests:", pendingRequests);

        // call delete borrow requests API for each pending request
        for (const request of pendingRequests) {
            const deleteResponse = await fetch(`http://localhost:8080/api/borrow-requests/delete-request/${request.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete borrow request");
            }

            console.log(`Deleted borrow request with ID: ${request.id}`);
        }

        const url = user.role === "admin"
            ? `http://localhost:8080/api/admin/delete/${user.email}`
            : `http://localhost:8080/api/user/delete/${user.email}`;

        try {
            const res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete user");

            toast.success("User deleted successfully.");
            setCombinedUsers(prev => prev.filter(u => u.email !== user.email));
        } catch (error) {
            console.error("Error deleting user:", error);
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
        return <Loader message={"Loading User Stats 📊"} role={auth.userRole} />;
    }


    const sortUsersAlphabetically = () => {
        const sorted = [...combinedUsers].sort((a, b) => {
            return sortAZ
                ? a.fullName.localeCompare(b.fullName)
                : b.fullName.localeCompare(a.fullName);
        });
        setCombinedUsers(sorted);
        setSortAZ(!sortAZ);
    };

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
                        <h1 className='text-admin-primary-black text-2xl'>All Users</h1>
                        <Button
                            onClick={sortUsersAlphabetically}
                            className="bg-transparent text-admin-primary-black shadow-none border-1 border-admin-dark-border hover:cursor-pointer hover:bg-admin-dark-border flex items-center gap-2"
                        >
                            {sortAZ ? "Sort A-Z" : "Sort Z-A"}
                            <img src={swapIcon} alt="sort" />
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-full text-md text-left border-collapse">
                            <thead className="text-md text-admin-primary-blue uppercase bg-admin-bg border-admin-bg">
                                <tr>
                                    <th scope="col" className="p-4">Name</th>
                                    <th scope="col">Date Joined</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Books Borrowed</th>
                                    <th scope="col">University ID</th>
                                    <th scope="col">University ID Card</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {combinedUsers.map((user, index) => (
                                    <tr key={index} className="border-b border-admin-bg">
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 items-center">
                                                <AvatarFallback name={user.fullName} />
                                                <div className='flex flex-col items-start'>
                                                    <div>{user.fullName}</div>
                                                    <div className='text-admin-secondary-black ibm-plex-sans-300'>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {user.registrationDate
                                                ? new Date(user.registrationDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </td>

                                        <td>
                                            <span className={`${user.role === "admin"
                                                ? "bg-admin-green-bg text-green-600"
                                                : "bg-admin-red-bg text-red-600"
                                                } px-3 py-1 rounded-2xl`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>

                                        <td>{user.role === "student" ? user.noBooksBorrowed : "—"}</td>
                                        <td>{user.role === "student" ? user.universityId : "—"}</td>
                                        <td>
                                            {user.role === "student" ? (
                                                <Button
                                                    className="flex items-center flex-wrap text-admin-primary-blue bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                    onClick={() => {
                                                        setSelectedUser(user.email);
                                                        fetchIdCard(user.email);
                                                        setShowIdCard(true);
                                                    }}
                                                >
                                                    <img src={eyeIcon} alt="eye" />
                                                    View Id Card
                                                </Button>
                                            ) : "—"}
                                        </td>
                                        <td>
                                            {auth.email !== user.email && (
                                                <Button
                                                    className="bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                    onClick={() => {
                                                        setSelectedUser({ email: user.email, role: user.role, noBooksBorrowed: user.noBooksBorrowed, id: user.id });
                                                        setShowConfirm(true);
                                                    }}
                                                >
                                                    <img src={trashIcon} alt="trash" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showConfirm && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg text-center w-[450px] flex flex-col items-center">

                                    <Button
                                        onClick={() => setShowConfirm(false)}
                                        className="absolute top-2 right-4 p-0 m-0 bg-transparent hover:bg-transparent shadow-none border-none hover:shadow-none focus:outline-none hover:cursor-pointer"
                                    >
                                        <img src={closeIcon} alt="close" className="h-4 w-4" />
                                    </Button>

                                    <div className='p-4 bg-admin-red-bg rounded-full'>
                                        <img src={denyIcon} alt="" className='h-15 w-15' />
                                    </div>

                                    <h1 className='mt-5'>Confirm Delete</h1>
                                    <p className='text-sm ibm-plex-sans-300 text-admin-secondary-black'>
                                        Confirming will lead to permanent deletion of the selected user account.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            handleDeleteUser(selectedUser);
                                            setShowConfirm(false);
                                        }}
                                        className="bg-admin-red mt-5 w-full p-5 hover:cursor-pointer hover:bg-admin-dark-red"
                                    >
                                        Delete User
                                    </Button>
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
