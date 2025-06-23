import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext.jsx';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import bg from "../assets/images/bg.png";
import { Button } from '@/components/ui/button.jsx';
import { Loader } from '@/components/Loader.jsx';
import { toast } from 'sonner';
import calendarIcon from "../assets/icons/admin/calendar.svg";
import editIcon from "../assets/icons/admin/edit.svg";
import warningIcon from "../assets/icons/warning.svg";

export const BookDetails = () => {
  const { auth } = useAuth();
  const { bookId } = useParams();
  const [studentAccountStatus, setStudentAccountStatus] = useState(null);
  const [book, setBook] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showBorrowButton, setShowBorrowButton] = useState(true);
  const [borrowRequest, setBorrowRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current book by ID
        const bookRes = await fetch(`http://localhost:8080/api/books/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!bookRes.ok) {
          throw new Error("Failed to fetch book details");
        }

        const bookData = await bookRes.json();
        setBook(bookData);

        // Fetch all books
        const allBooksRes = await fetch("http://localhost:8080/api/books/allBooks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!allBooksRes.ok) {
          throw new Error("Failed to fetch books");
        }

        const allBooksData = await allBooksRes.json();

        if (allBooksData.length === 0) {
          toast.error("No books available at the moment. Please check back later.");
        }

        setAllBooks(allBooksData);

        // Fetch student account status
        if( auth.userRole !== "student") return; // Only fetch for students
        const studentResponse = await fetch(`http://localhost:8080/api/user/accountStatus`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const studentData = await studentResponse.json();

        if (!studentResponse.ok) {
          throw new Error(studentData.message || "Failed to fetch student account status");
        }

        setStudentAccountStatus(studentData.accountStatus);
      } catch (error) {
        console.error("Error fetching book or books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, auth.userRole]);

  useEffect(() => {
    setBook(null);
    setBorrowRequest(null);
    setShowBorrowButton(true);
  }, [bookId]);

  const checkIfBookBorrowRequested = useCallback(async () => {
    if (!book || auth.userRole === "admin") return;

    try {
      const payload = {
        bookId: book.id,
        studentId: auth.userId
      };
      const response = await fetch(`http://localhost:8080/api/borrow-requests/check-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 204) {
        // If no borrow request found, reset state
        setBorrowRequest(null);
        setShowBorrowButton(true);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check borrow request status");
      }

      setBorrowRequest(data);
      setShowBorrowButton(false);
    } catch (error) {
      console.error("Error checking borrow request status:", error);
      setBorrowRequest(null);
      setShowBorrowButton(true);
    }
  }, [book, auth.userId, auth.userRole]);

  useEffect(() => {
    checkIfBookBorrowRequested();
  }, [book, auth.email, checkIfBookBorrowRequested]);

  const [allBooks, setAllBooks] = useState(null);


  const handleBorrowRequest = async () => {
    if (book.available_copies <= 0) {
      toast.error("No copies available for borrowing at the moment.");
      return;
    }

    try {
      const payload = {
        bookId: book.id,
        studentEmail: auth.email,
        studentId: auth.userId,
        studentFullName: auth.name,
      };

      const response = await fetch(`http://localhost:8080/api/borrow-requests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send borrow request");
      }

      const result = await response.text(); // response is just a string, not JSON
      toast.success(result || "Borrow request sent successfully!");
      checkIfBookBorrowRequested(); // Refresh borrow request status
    } catch (error) {
      console.error("Error sending borrow request:", error);
      toast.error(error.message || "Something went wrong while sending the borrow request.");
    }
  };

  const handleReturnBook = async (borrowRequestId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/borrow-requests/return-book/${borrowRequestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to return book");
      }

      const result = await response.text(); // response is just a string, not JSON
      toast.success(result || "Book returned successfully!");
      setBorrowRequest(prev => ({
        ...prev,
        status: "Returned"
      })); // Update borrow request status in state
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error(error.message || "Something went wrong while returning the book.");
    }
  };

  if (loading) {
    return <Loader message={"Loading book details... 📘"} role={auth.userRole} />;
  }


  return auth.userRole === "student" ?
    <div
      className="h-full bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
    >
      <div className='px-20 py-12'>
        <NavBar homeColor={'yellow'} />

        <div className="flex mt-14 ibm-plex-sans-400 text-white justify-between items-center gap-100">
          <div className='w-1/2'>
            <h1 className='ibm-plex-sans-600 text-6xl'>{book.title}</h1>
            <div className='flex flex-wrap items-center gap-7 text-light-blue mt-10 '>
              <p className='text-xl'>By <span className='text-yellow ibm-plex-sans-600'>{book.author}</span></p>
              <p className='text-xl'>Category:  <span className='text-yellow ibm-plex-sans-600'>{book.genre}</span></p>
              <p className='text-xl'><FontAwesomeIcon icon={faStar} />  <span className='text-yellow ibm-plex-sans-600'>{book.rating}</span>/5</p>
              <p className='text-xl'>Total Books:  <span className='text-yellow ibm-plex-sans-600'>{book.total_copies}</span></p>
              <p className='text-xl'>Available Books:  <span className='text-yellow ibm-plex-sans-600'>{book.available_copies}</span></p>
            </div>
            <p className='text-xl text-light-blue mt-10'>{book.description}</p>
            {studentAccountStatus === "Verification Pending" && (
              <div className='flex gap-3 mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm w-[650px] items-center justify-start'>
                <img src={warningIcon} alt="warning" />
                Book will be available for borrowing once your account is verified by admin.
              </div>
            )}
            {((showBorrowButton || borrowRequest.status === "Returned") && studentAccountStatus != "Verification Pending") &&
              <Button onClick={handleBorrowRequest} className='text-2xl bebas-neue-400 bg-yellow text-dark-end mt-10 rounded-xs border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer'>
                <FontAwesomeIcon icon={faBookOpen} /> BORROW BOOK REQUEST
              </Button>
            }
            {borrowRequest && borrowRequest?.status === "Pending" && (
              <div className='flex mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm w-[325px] items-center justify-around'>
                <img src={warningIcon} alt="warning" />
                Book Request Approval Pending
              </div>
            )}
            {borrowRequest && borrowRequest.status === "Borrowed" && (
              <div className='flex mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm items-center justify-between gap-3'>
                <div className='flex gap-3'>
                  <img src={warningIcon} alt="warning" />

                  Due Date:
                  <span className='text-yellow ibm-plex-sans-600'>
                    {
                      new Date(borrowRequest.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    }
                  </span>
                </div>
                <Button
                  onClick={() => {
                    handleReturnBook(borrowRequest.id);
                  }}
                  className={`bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500`}>
                  Return Book
                </Button>
              </div>
            )}
            {
              borrowRequest && borrowRequest.status === "Overdue" && (
                <div className='flex mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm items-center justify-between gap-3'>
                  <div className='flex gap-3'>
                    <img src={warningIcon} alt="warning" />
                    <span className='text-yellow ibm-plex-sans-600'>Your book is overdue!</span>
                  </div>
                  <Button className={`bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500`}>
                    Return Book
                  </Button>
                </div>
              )
            }
          </div>
          <div className='w-1/2'>
            <div className='relative'>
              {/* Blurred book (rotated and beside main book) */}
              <div className="absolute left-30 top-10 rotate-[25deg] scale-100 blur-xs opacity-90 z-0">
                <BookCoverSvg coverColor={book.color} width={275} height={385} />
                <img
                  src={book.cover}
                  alt="Blurred Shadow"
                  className="absolute top-0 left-3 w-[275px] h-[340px] object-fit"
                />
              </div>

              {/* Foreground normal book */}
              <div className="relative z-10">
                <BookCoverSvg coverColor={book.color} width={275} height={385} />
                <img
                  src={book.cover}
                  alt="Main Book"
                  className="absolute ps-6 inset-0 w-[275px] h-[340px] object-fit rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className='text-white ibm-plex-sans-600 mt-25 flex gap-15'>
          <div className='w-3/5'>
            <h1 className='text-2xl text-light-blue mb-10'>Video</h1>
            {/* Add video player */}
            <iframe
              width="900" height="575"
              src={`${book.video}`}
            >
            </iframe>
            <p className='text-xl text-light-blue mt-10 ibm-plex-sans-400 w-10/11'>
              {book.summary.split("\n\n").map((para, i) => (
                <span key={i}>
                  {para}
                  <br /><br />
                </span>
              ))}
            </p>
          </div>
          <div className='w-2/5'>
            <h1 className='text-2xl text-light-blue mb-10'>Popular Books</h1>

            <div className='flex flex-wrap gap-6 justify-start'>
              {allBooks.slice(1, 7).map((book, index) => (
                <div key={index} className="relative">
                  <Link to={`/bookdetails/${book.id}`}>
                    <BookCoverSvg coverColor={book.color} width={160} height={220} />
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="absolute top-0 left-4 w-[143px] h-[193px] object-fit rounded-lg"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    :
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

        <Button
          onClick={() => navigate(-1)}
          className={`mt-10 bg-white text-admin-primary-black shadow-none hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer `}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Go Back
        </Button>

        <div className='flex mt-10 ibm-plex-sans-600 gap-7'>
          <div className="relative px-25 py-8 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: book.color,
                opacity: 0.5,
              }}
            />
            <div className="relative z-10">
              <BookCoverSvg coverColor={book.color} width={150} height={200} />
              <img
                src={book.cover}
                alt={book.title}
                className="absolute top-0 left-4 w-[133px] h-[175px] object-fit rounded-lg"
              />
            </div>
          </div>
          <div className='w-1/3 flex flex-col gap-3 justify-between'>
            <div className='flex gap-2'>
              <p className='text-admin-secondary-black ibm-plex-sans-300'>Created at:  </p>
              <img src={calendarIcon} alt="" />
              <p className='text-admin-secondary-black ibm-plex-sans-300'>{book.createdAt}</p>
            </div>
            <h1 className='text-4xl'>{book.title}</h1>
            <h1 className='text-2xl'>{book.author}</h1>
            <p className='text-lg text-admin-secondary-black ibm-plex-sans-300'>{book.genre}</p>
            <Button
              className="py-6 text-lg w-full border-admin-dark-border border-1 text-admin-bg bg-admin-primary-blue hover:bg-admin-tertiary-blue hover:cursor-pointer"
              onClick={() => navigate(`/edit-book-details/${book.id}`)}
            >
              <img
                src={editIcon}
                alt="plus"
              />
              Edit Book
            </Button>
          </div>
        </div>
        <div className='flex gap-5 mt-10'>
          <div>
            <h1 className='text-lg'>Summary</h1>
            <p className='mt-5 text-lg text-admin-secondary-black ibm-plex-sans-300'>
              {book.summary.split("\n\n").map((para, i) => (
                <span key={i}>
                  {para}
                  <br /><br />
                </span>
              ))}
            </p>
          </div>
          <div>
            <h1 className="text-lg">Video</h1>
            {/* Add video player */}
            <iframe
              width="600" height="350"
              src={`${book.video}`}
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>

}
