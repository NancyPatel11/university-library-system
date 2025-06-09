import React from 'react'
import bg from "../assets/images/bg.png";
import bookicon from "../assets/icons/logo.svg";
import { sampleBooks } from '../assets/index.js';
import BookCoverSvg from '../components/BookCoverSvg.jsx';

export const Landing = () => {
    return (
        <div
            className="h-screen bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
            }}
        >
            <div className="flex gap-10 h-full items-center">
                <div className="px-15 h-[75vh] flex flex-col justify-between">
                    <h1 className="ibm-plex-sans-700 text-9xl text-white">
                        <span className="text-yellow">Library</span>
                        <br /> Management
                        <br /> System
                    </h1>

                    <div className="flex items-center gap-3">
                        <img src={bookicon} alt="book icon" className="h-14" />
                        <h3 className=" text-white ibm-plex-sans-500 text-5xl">Bookademia</h3>
                    </div>
                </div>

                <div className="relative h-screen overflow-hidden  pl-[150px]">
                    <div className="origin-top-left rotate-[5deg] p-8 relative -top-15">
                        <div className="space-y-6">
                            {Array.from({ length: Math.ceil(sampleBooks.length / 4) }).map((_, rowIndex) => (
                                <div key={rowIndex} className="flex gap-15 overflow-visible">
                                    {sampleBooks
                                        .slice(rowIndex * 4, rowIndex * 4 + 4)
                                        .map((book, index) => (
                                            <div key={index} className="relative flex-shrink-0 overflow-visible">
                                                <BookCoverSvg coverColor={book.color} />
                                                <img
                                                    src={book.cover}
                                                    alt="FrontPage"
                                                    className="absolute ps-3 inset-0 w-[143px] h-[175px] object-fit z-10"
                                                />
                                                <div className="flex flex-col w-[143px] mt-2">
                                                    <h2 className="text-white ibm-plex-sans-400 truncate text-sm">
                                                        {book.title}
                                                    </h2>
                                                    <p className="text-light-blue ibm-plex-sans-200-italic truncate text-xs">
                                                        {book.genre}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
