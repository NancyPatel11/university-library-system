import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { toast } from 'sonner';
import bookicon from "../assets/icons/logo.svg";
import logoutSvg from "../assets/icons/logout.svg";
import homeSvg from "../assets/icons/admin/home.svg";
import allUsersSvg from "../assets/icons/admin/users.svg";
import userSvg from "../assets/icons/admin/user.svg";
import bookSvg from "../assets/icons/admin/book.svg";
import bookMarkSvg from "../assets/icons/admin/bookmark.svg";
import userFallBackImg from "../assets/icons/user.svg";

export const NavBar = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Home"); // default active

    const handleLogout = async () => {
        try {
            const endpoint = auth.userRole === "student" ? "http://localhost:8080/api/user/logout" : "http://localhost:8080/api/admin/logout";
            const response = await fetch(endpoint, {
                method: "GET",
                credentials: "include",
            });

            setAuth({ userRole: null, email: null });
            if (response.status === 204 || response.ok) {
                toast.success("Logged out successfully 👋");
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    if (auth.userRole === "student") {
        return (
            <div className='flex ibm-plex-sans-400 text-white items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <img src={bookicon} alt="book icon" className="h-8" />
                    <h3 className="ibm-plex-sans-500 text-3xl">
                        <a href="/home">Bookademia</a>
                    </h3>
                </div>
                <ul className='flex gap-8 text-xl'>
                    <li className='text-admin-primary-blue'><a href="/home">Home</a></li>
                    <li><a href="/search">Search</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li onClick={handleLogout}><img src={logoutSvg} alt="logout" className='h-7 cursor-pointer' /></li>
                </ul>
            </div>
        );
    }

    return (
        <div className="h-screen w-64 bg-white text-admin-primary-black flex flex-col">
            <div className="flex items-center gap-3 p-6 border-b">
                <div className="h-10 w-10 rounded-full bg-admin-primary-blue flex items-center justify-center">
                    <img src={bookicon} alt="book icon" className="h-6 w-6 object-contain" />
                </div>
                <h3 className="text-2xl font-semibold text-admin-primary-blue">Bookademia</h3>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-3 text-lg ibm-plex-sans-500">
                <AdminNavItem icon={homeSvg} to="/admin-dashboard" label="Home" active={activeTab === "Home"} onClick={() => setActiveTab("Home")} />
                <AdminNavItem icon={allUsersSvg} to="/all-users" label="All Users" active={activeTab === "All Users"} onClick={() => setActiveTab("All Users")} />
                <AdminNavItem icon={bookSvg} to="/all-books" label="All Books" active={activeTab === "All Books"} onClick={() => setActiveTab("All Books")} />
                <AdminNavItem icon={bookMarkSvg} to="/borrow-requests" label="Borrow Requests" active={activeTab === "Borrow Requests"} onClick={() => setActiveTab("Borrow Requests")} />
                <AdminNavItem icon={userSvg} to="/account-requests" label="Account Requests" active={activeTab === "Account Requests"} onClick={() => setActiveTab("Account Requests")} />
            </nav>
            <div className="p-4 m-5 border border-gray-200 rounded-full ibm-plex-sans-400">
                <button onClick={handleLogout} className="flex items-center gap-2 text-admin-primary-blue">
                    <img src={userFallBackImg} alt="" className='bg-gray-200 p-1 rounded-full' />
                    <div className='truncate'>{auth.email}</div>
                    <img src={logoutSvg} alt="logout" className='h-7 cursor-pointer' />
                </button>
            </div>
        </div>
    );
};

const AdminNavItem = ({ to, icon, label, onClick, active }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer 
        ${active ? 'bg-admin-primary-blue text-white' : 'hover:bg-admin-primary-blue hover:text-white'}`}
    >
        <img src={icon} alt={label} />
        {label}
    </NavLink>
);