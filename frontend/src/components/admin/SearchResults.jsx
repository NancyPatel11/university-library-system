import { Link, useNavigate } from "react-router-dom";
import BookCoverSvg from "../BookCoverSvg";
import calendarImg from "../../assets/icons/admin/calendar.svg";
import noBooksFoundImg from "../../assets/images/no-books.png";

const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const initials = parts[0][0] + (parts[1]?.[0] || "");
    return initials.toUpperCase();
};

const AvatarFallback = ({ name, height, width, textSize }) => {
    const initials = getInitials(name);
    const { bg, text, border } = { bg: "bg-blue-200", text: "text-blue-700", border: "border-blue-700" }

    return (
        <div
            className={`h-${height} w-${width} rounded-full flex items-center justify-center font-semibold ${textSize} ${bg} ${text} ${border} border`}
        >
            {initials}
        </div>
    );
};


export const SearchResults = ({ query, books, borrowRequests }) => {

    const navigate = useNavigate();

    const q = query.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q)
    );

    const filteredBorrowRequests = borrowRequests.filter(request =>
        request.bookTitle.toLowerCase().includes(q) ||
        request.studentFullName.toLowerCase().includes(q) ||
        request.studentEmail.toLowerCase().includes(q)
    );

    return (
        <div className="mt-10 space-y-6">
            <h2 className="text-2xl text-admin-primary-black font-semibold">Search Results for: <span className="text-admin-primary-blue">{query}</span></h2>
            {
                filteredBooks.length > 0 &&
                <div className="mt-10 mb-5">
                    <h3 className="text-admin-primary-black text-2xl font-medium mb-2">Books</h3>
                    <div className="flex flex-wrap gap-7">
                        {filteredBooks.map((book, index) => (
                            <div key={index} className="relative">
                                <Link to={`/bookdetails/${book.id}`}>
                                    <BookCoverSvg coverColor={book.color} width={150} height={210} />
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="absolute top-0 left-4 w-[133px] h-[185px] object-fit rounded-lg"
                                    />
                                    <div className="mt-3 w-[150px]">
                                        <h2 className="text-lg truncate">{book.title} - By {book.author}</h2>
                                        <p className="text-sm text-admin-secondary-black italic truncate">{book.genre}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}

                    </div>
                </div>
            }

            {
                filteredBorrowRequests.length > 0 &&
                <div className="mt-10 mb-5">
                    <h3 className="text-admin-primary-black text-2xl font-medium mb-2">Borrow Requests</h3>
                    <div className="flex flex-col gap-4">
                        {filteredBorrowRequests.map((request, index) => {
                            const book = books.find(book => book.id === request.bookId)
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg p-3 flex gap-3 items-center text-center ibm-plex-sans-500 text-admin-primary-black hover:cursor-pointer"
                                    onClick={
                                        () => navigate(`/borrow-request/${request.id}`)
                                    }
                                >
                                    <div className="relative">
                                        <BookCoverSvg coverColor={book.color} width={60} height={85} />
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="absolute top-0 left-1 w-[56px] h-[75px] object-fit rounded-xs"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 items-start'>
                                        <h1>{book.title}</h1>
                                        <p className='text-admin-secondary-black ibm-plex-sans-300 text-sm'>By {book.author} · {book.genre}</p>
                                        <div className='flex flex-wrap gap-5 mt-2 items-center'>
                                            <div className='flex gap-1 items-center'>
                                                <AvatarFallback name={request.studentFullName} height={6} width={6} textSize="text-xs" />
                                                <p className='ibm-plex-sans-300 text-admin-secondary-black text-[15px]'>{request.studentFullName}</p>
                                            </div>
                                            <div className='flex gap-1 items-center'>
                                                <img src={calendarImg} alt="calendar" className='h-6 w-6' />
                                                <p className='ibm-plex-sans-300 text-admin-secondary-black text-[15px]'>
                                                    {new Date(request.requestDate).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }

            {
                filteredBooks.length === 0 && filteredBorrowRequests.length === 0 &&
                <div className='flex flex-col items-center justify-center mt-18 ibm-plex-sans-400 h-[750px]'>
                    <img src={noBooksFoundImg} alt="No Books Found" className="max-w-md" />
                    <h1 className='text-admin-primary-blue text-3xl mt-10 ibm-plex-sans-500'>No Results Found</h1>
                    <p className='text-admin-secondary-black text-lg mt-3'>We couldn't find any books or borrow requests matching your search.</p>
                    <p className='text-admin-secondary-black text-lg'>Try using different keywords or check for typos.</p>
                </div>
            }

        </div>
    );
};