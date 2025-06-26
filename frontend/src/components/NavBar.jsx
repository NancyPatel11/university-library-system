import React from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
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
            className={`h-13 w-13 rounded-full flex items-center justify-center font-semibold text-lg ${bg} ${text} ${border} border`}
        >
            {initials}
        </div>
    );
};

export const NavBar = ({ homeColor, searchColor, userColor }) => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = async () => {
        try {
            const endpoint = auth.userRole === "student" ? "/api/user/logout" : "/api/admin/logout";
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
                    <li className={`text-${homeColor}`}><Link to="/home">Home</Link></li>
                    <li className={`text-${searchColor}`}><Link to="/search">Search</Link></li>
                    <li><Link to="/profile"><img src={userFallBackImg} alt="" className={`p-1 rounded-full h-7 ${userColor ? `bg-${userColor}` : 'bg-gray-100'}`} /></Link></li>
                    <li onClick={handleLogout}><img src={logoutSvg} alt="logout" className='h-7 cursor-pointer' /></li>
                </ul>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen min-w-85 bg-white text-admin-primary-black flex flex-col">
            <div className="flex items-center gap-3 p-6 border-b">
                <div className="h-10 w-10 rounded-full bg-admin-primary-blue flex items-center justify-center">
                    <img src={bookicon} alt="book icon" className="h-6 w-6 object-contain" />
                </div>
                <h3 className="text-2xl font-semibold text-admin-primary-blue">Bookademia</h3>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-3 text-lg ibm-plex-sans-500">
                <AdminNavItem icon={homeSvg} to="/admin-dashboard" label="Home" active={location.pathname === "/admin-dashboard"} />
                <AdminNavItem icon={allUsersSvg} to="/all-users" label="All Users" active={location.pathname === "/all-users"} />
                <AdminNavItem icon={bookSvg} to="/all-books" label="All Books" active={location.pathname === "/all-books"} />
                <AdminNavItem icon={bookMarkSvg} to="/borrow-requests" label="Borrow Requests" active={location.pathname === "/borrow-requests"} />
                <AdminNavItem icon={userSvg} to="/account-requests" label="Account Requests" active={location.pathname === "/account-requests"} />
            </nav>
            <div className="p-2 m-12 border border-gray-200 rounded-full ibm-plex-sans-400">
                <div className='flex items-center gap-2 text-admin-primary-blue justify-between'>
                    <div className="relative">
                        <AvatarFallback name={auth.name} />
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className='flex flex-col items-start overflow-hidden w-[120px]'>
                        <div className='text-admin-primary-black truncate'>
                            {auth.name}
                        </div>
                        <div className='text-admin-secondary-black truncate'>
                            {auth.email}
                        </div>
                    </div>
                    <button onClick={handleLogout}>
                        <img src={logoutSvg} alt="logout" className='h-7 cursor-pointer' />
                    </button>
                </div>
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