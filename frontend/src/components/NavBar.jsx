import React from 'react'
import bookicon from "../assets/icons/logo.svg";
import logoutSvg from "../assets/icons/logout.svg";

export const NavBar = ({ homeColor, searchColor, userColor }) => {

    return (
        <div className='flex ibm-plex-sans-400 text-white items-center justify-between'>
            <div className='flex items-center gap-3'>
                <img src={bookicon} alt="book icon" className="h-8" />
                <h3 className="ibm-plex-sans-500 text-3xl"><a href="/home">Bookademia</a></h3>
            </div>
            <div>
                <ul className='flex gap-8 text-xl'>
                    <li className={`text-${homeColor}`}><a href="/home">Home</a></li>
                    <li className={`text-${searchColor}`}><a href="/search">Search</a></li>
                    <li className={`text-${userColor}`}><a href="/profile">Profile</a></li>
                    <li><a href=""><img src={logoutSvg} alt="" className='h-7' /></a></li>
                </ul>
            </div>
        </div>
    )
}
