import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'
import { Loader } from '@/components/Loader';
import { NavBar } from '@/components/NavBar'
import { Button } from '@/components/ui/button';
import illustration1 from '../../assets/icons/admin/illustration1.png';
import illustration2 from '../../assets/icons/admin/illustration2.png';
import plusButton from '../../assets/icons/admin/plusButton.png';
import BookCoverSvg from '@/components/BookCoverSvg';
import calendarImg from '../../assets/icons/admin/calendar.svg';
import { SearchBar } from '@/components/admin/SearchBar';
import { SearchResults } from '@/components/admin/SearchResults';

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

export const AdminDashboard = () => {
  const { auth } = useAuth();
  const [allStudents, setAllStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allBorrowRequests, setAllBorrowRequests] = useState([]);
  const [pendingBorrowRequests, setPendingBorrowRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const showSearchResults = searchQuery.trim().length > 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [booksRes, usersRes, requestsRes] = await Promise.all([
          fetch("/api/books/allBooks", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch("/api/user/allUsers", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch("/api/borrow-requests/all-borrow-requests", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!booksRes.ok || !usersRes.ok || !requestsRes.ok) {
          throw new Error("One or more fetches failed");
        }

        const [books, users, borrowRequests] = await Promise.all([
          booksRes.json(),
          usersRes.json(),
          requestsRes.json(),
        ]);

        const sortedBooks = books.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // Sort by most recent date first
        })

        setAllBooks(sortedBooks);

        setAllStudents(users);
        const pendingStudents = users.filter((student) => student.accountStatus === "Verification Pending");
        const sortedPendingStudents = pendingStudents.sort((a, b) => {
          const dateA = new Date(a.registrationDate);
          const dateB = new Date(b.registrationDate);
          return dateB - dateA; // Sort by most recent date first
        });
        setPendingStudents(sortedPendingStudents);

        setAllBorrowRequests(borrowRequests);
        const pendingBorrowRequests = borrowRequests.filter((request) => request.status === "Pending");
        const sortedRequests = sortBorrowRequests(pendingBorrowRequests);

        setPendingBorrowRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortBorrowRequests = (requests) => {
    return requests.sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return dateB - dateA; // Sort by most recent date first
    });
  };


  if (loading) {
    return <Loader message={"Loading Admin Dashboard 🖥️"} role={auth.userRole} />;
  }

  return (
    <div className="flex">
      <NavBar />
      <div className="h-full min-h-screen bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className='text-admin-primary-black text-2xl'>Welcome, {auth.name}</h1>
            <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Get a quick overview of recent activity across the platform</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {showSearchResults ? (
          <SearchResults query={searchQuery} books={allBooks} borrowRequests={allBorrowRequests} />
        ) : (
          <>
            <div className='flex gap-5 ibm-plex-sans-600 mt-10'>
              <div className='bg-white rounded-2xl w-1/3 p-5'>
                <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Borrowed Books</p>
                <h1 className='text-3xl'>
                  {
                    allBooks.reduce((borrowed, book) => {
                      const total = book.total_copies || 0;
                      const available = book.available_copies || 0;
                      return borrowed + (total - available);
                    }, 0)
                  }
                </h1>
              </div>
              <div className='bg-white rounded-2xl w-1/3 p-5'>
                <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Total Students</p>
                <h1 className='text-3xl'>{allStudents.length}</h1>
              </div>
              <div className='bg-white rounded-2xl w-1/3 p-5'>
                <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Total Books</p>
                <h1 className='text-3xl'>
                  {allBooks.reduce((total, book) => total + (book.total_copies || 0), 0)}
                </h1>
              </div>
            </div>

            <div className='flex gap-5 mt-8 mb-5'>
              <div className='w-1/2 flex flex-col gap-5'>
                <div className='bg-white p-5 rounded-2xl flex-1 flex flex-col justify-start'>
                  <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>Borrow Requests</h1>
                    <Button
                      onClick={() => navigate('/borrow-requests')}
                      className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer"
                    >
                      View All
                    </Button>
                  </div>
                  {pendingBorrowRequests.length > 0 ?
                    <div className="flex flex-wrap justify-start mt-5 gap-3 flex-col">
                      {pendingBorrowRequests.slice(0, 3).map((request, index) => {

                        const book = allBooks.find(book => book.id === request.bookId);
                        const student = allStudents.find(student => student.email === request.studentEmail);

                        if (!book || !student) return null;

                        return (
                          <div
                            key={index}
                            className="bg-admin-bg rounded-lg p-3 flex gap-3 items-center text-center ibm-plex-sans-500 text-admin-primary-black hover:cursor-pointer"
                            onClick={() => navigate(`/borrow-request/${request.id}`)}
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
                                  <AvatarFallback name={student.fullName} height={6} width={6} textSize="text-xs" />
                                  <p className='ibm-plex-sans-300 text-admin-secondary-black text-[15px]'>{student.fullName}</p>
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
                    :
                    <div className='flex flex-col items-center gap-3 my-10'>
                      <img src={illustration1} alt="" className='h-[144px] w-[193px]' />
                      <h1>No Pending Book Requests</h1>
                      <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                        There are no borrow book requests awaiting your review at this time.
                      </p>
                    </div>}

                </div>

                <div className='bg-white p-5 rounded-2xl flex-1 flex flex-col'>
                  <div className='flex justify-between items-center'>
                    <h1 className='text-xl'>Account Requests</h1>
                    <Button
                      onClick={() => navigate('/account-requests')}
                      className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer"
                    >
                      View All
                    </Button>
                  </div>
                  {pendingStudents.length > 0 ?
                    <div className="flex flex-wrap justify-start mt-5 gap-3">
                      {pendingStudents.map((student, index) => (
                        <div
                          key={index}
                          className="hover:cursor-pointer basis-[32%] flex-none bg-admin-bg rounded-lg p-5 flex flex-col items-center text-center ibm-plex-sans-500 text-admin-primary-black"
                          onClick={() => navigate(`/account-request/${student.id}`)}
                        >
                          <div className="mb-3">
                            <AvatarFallback name={student.fullName} height={14} width={14} textSize={"text-2xl"} />
                          </div>
                          <h2 className="text-lg">{student.fullName}</h2>
                          <p className="text-sm text-admin-secondary-black ibm-plex-sans-300">{student.email}</p>
                        </div>
                      ))}
                    </div>
                    :
                    <div className='flex flex-col items-center gap-3 my-10'>
                      <img src={illustration2} alt="" className='h-[144px] w-[210px]' />
                      <h1>No Pending Account Requests</h1>
                      <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                        There are currently no account requests awaiting approval.
                      </p>
                    </div>}

                </div>
              </div>

              <div className='w-1/2 bg-white p-5 rounded-2xl flex flex-col'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl'>Recently Added Books</h1>
                  <Button
                    onClick={() => navigate('/all-books')}
                    className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer"
                  >
                    View All
                  </Button>
                </div>

                <Button
                  onClick={() => navigate('/create-book-details')}
                  className="flex items-center justify-start gap-x-3 mt-5 py-10 text-xl bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer"
                >
                  <img src={plusButton} alt="plus" className="h-10 w-10" />
                  Add New Book
                </Button>
                {allBooks.length > 0 ?
                  <div className='flex flex-col mt-8 gap-2'>
                    {allBooks.slice(0, 6).map((book, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg flex items-center gap-4 hover:cursor-pointer"
                        onClick={
                          () => {
                            // Navigate to book details page
                            navigate(`/bookdetails/${book.id}`)
                          }
                        }
                      >
                        <div className="relative">
                          <BookCoverSvg coverColor={book.color} width={50} height={70} />
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="absolute top-0 left-1 w-[46px] h-[62px] object-fit rounded-xs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-lg text-admin-primary-black">{book.title}</h2>
                          <div className='flex gap-2 items-center'>
                            <p className="text-sm text-admin-secondary-black ibm-plex-sans-300">{book.author}</p>
                            <p>·</p>
                            <p className="text-sm text-admin-secondary-black ibm-plex-sans-300">{book.genre}</p>
                          </div>
                          <div className='flex gap-2 items-center justify-start mt-1'>
                            <img src={calendarImg} alt="calendar icon" />
                            <p className="text-sm text-admin-secondary-black ibm-plex-sans-300"> {new Date(book.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  :
                  <div className="flex-grow flex items-center justify-center">
                    <div className='flex flex-col items-center gap-3'>
                      <img src={illustration1} alt="" className='h-[144px] w-[193px]' />
                      <h1>No Books to Display</h1>
                      <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                        There are no books in the library currently. Add new books to get started.
                      </p>
                    </div>
                  </div>}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}