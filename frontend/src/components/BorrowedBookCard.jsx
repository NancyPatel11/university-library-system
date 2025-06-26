import React from 'react';
import BookCoverSvg from './BookCoverSvg';
import borrowedBookImg from '../assets/icons/book-2.svg';
import CalendarImg from '../assets/icons/calendar.svg';
import verificationPendingImg from '../assets/icons/warning.svg';
import tickIcon from '../assets/icons/tick.svg';

export const BorrowedBookCard = ({ book, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-search-bar p-5 rounded-lg gap-4 items-center hover:cursor-pointer"
        >
            {/* Wrapper with overlay */}
            <div className="relative px-10 py-5 rounded-lg overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: book.color, opacity: 0.5 }}
                />
                <div className="relative z-10">
                    <BookCoverSvg coverColor={book.color} width={240} height={310} />
                    <img
                        src={book.cover}
                        alt={book.title}
                        className="absolute top-0 left-4 w-[223px] h-[274px] object-fit rounded-lg"
                    />
                </div>
            </div>

            {/* Book details */}
            <div className="mt-3 w-[320px] ibm-plex-sans-400">
                <div className="min-h-[80px]">
                    <h2 className="text-xl ibm-plex-sans-500">
                        {book.title} - By {book.author}
                    </h2>
                    <p className="text-sm text-light-blue italic truncate mt-2 mb-5">
                        {book.genre}
                    </p>
                </div>

                {book.status === "Pending" ? (
                    <div className="flex gap-2 flex-wrap text-light-blue">
                        <img src={verificationPendingImg} alt="Pending" />
                        <p>Book Request Approval Pending</p>
                    </div>
                ) : book.status === "Borrowed" ? (
                    <div className="flex flex-col gap-2 text-light-blue">
                        <div className="flex gap-2 flex-wrap">
                            <img src={borrowedBookImg} alt="Borrowed" />
                            <p>
                                Borrowed on{" "}
                                {new Date(book.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={CalendarImg} alt="Due Date" />
                            <p>
                                To be returned on{" "}
                                {new Date(book.dueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                ) : book.status === "Returned" ? (
                    <div className="flex flex-col gap-2 text-light-blue">
                        <div className="flex gap-2 flex-wrap">
                            <img src={borrowedBookImg} alt="Borrowed" />
                            <p>
                                Borrowed on{" "}
                                {new Date(book.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={tickIcon} alt="Returned" />
                            <p>
                                Returned on{" "}
                                {new Date(book.returnDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                ) : book.status === "Overdue" ? (
                    <div className="flex flex-col gap-2 text-light-blue">
                        <div className="flex gap-2 flex-wrap">
                            <img src={borrowedBookImg} alt="Borrowed" />
                            <p>
                                Borrowed on{" "}
                                {new Date(book.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={CalendarImg} alt="Due" />
                            <p>
                                Was due on{" "}
                                {new Date(book.dueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={verificationPendingImg} alt="Overdue" />
                            <p className="text-red-400">Overdue</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 text-light-blue">
                        <div className="flex gap-2 flex-wrap">
                            <img src={borrowedBookImg} alt="Borrowed" />
                            <p>
                                Borrowed on{" "}
                                {new Date(book.issueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={tickIcon} alt="Late Return" />
                            <p>
                                Returned (Late) on{" "}
                                {new Date(book.returnDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <img src={verificationPendingImg} alt="Late Return" />
                            <p className="text-red-400">Late Return</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};