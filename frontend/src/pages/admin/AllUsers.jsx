import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'
import { NavBar } from '@/components/NavBar'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/ui/button'
import trashIcon from '../../assets/icons/admin/trash.svg'
import denyIcon from '../../assets/icons/admin/deny.png'
import closeIcon from '../../assets/icons/admin/close.svg'

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
    const [allAdmins, setAllAdmins] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
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

                setAllAdmins(admins);
                setAllStudents(students);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    const handleDeleteUser = async (user) => {
        if (!user) return;

        const url = user.role === "admin"
            ? `http://localhost:8080/api/admin/delete/${user.email}`
            : `http://localhost:8080/api/user/delete/${user.email}`;

        try {
            const res = await fetch(url, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete user");

            if (user.role === "admin") {
                setAllAdmins(prev => prev.filter(a => a.email !== user.email));
            } else {
                setAllStudents(prev => prev.filter(s => s.email !== user.email));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (loading) {
        return <Loader message={"Loading User Stats 📊"} role={auth.userRole} />;
    }

    console.log(allStudents)
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
                    <h1 className='text-admin-primary-black text-2xl mb-6'>All Users</h1>

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
                                {allAdmins.map((admin, index) => (
                                    <tr key={index} className="border-b border-admin-bg">
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 items-center">
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <AvatarFallback name={admin.fullName} />
                                                    </div>
                                                </td>
                                                <div className='flex flex-col items-start'>
                                                    <div className=''>
                                                        {admin.fullName}
                                                    </div>
                                                    <div className='text-admin-secondary-black ibm-plex-sans-300'>
                                                        {admin.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {admin.registrationDate
                                                ? new Date(admin.registrationDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </td>
                                        <td><span className='bg-admin-green-bg text-green-600 px-3 py-1 rounded-2xl'>Admin</span></td>
                                        <td>—</td>
                                        <td>—</td>
                                        <td>—</td>
                                        <td>
                                            {auth.email !== admin.email && (
                                                <Button
                                                    className="bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                    onClick={() => {
                                                        setSelectedUser({ email: admin.email, role: "admin" });
                                                        setShowConfirm(true);
                                                    }}
                                                >
                                                    <img src={trashIcon} alt="trash" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {allStudents.map((student, index) => (
                                    <tr key={index} className="border-b border-admin-bg">
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 items-center">
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <AvatarFallback name={student.fullName} />
                                                    </div>
                                                </td>
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
                                        <td><span className='bg-admin-red-bg text-red-600 px-3 py-1 rounded-2xl'>Student</span></td>
                                        <td>{student.noBooksBorrowed}</td>
                                        <td>{student.universityId}</td>
                                        <td>ID Card</td>
                                        <td>
                                            <Button
                                                className="bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none border-none"
                                                onClick={() => {
                                                    setSelectedUser({ email: student.email, role: "student" });
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                <img src={trashIcon} alt="trash" />
                                            </Button>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
