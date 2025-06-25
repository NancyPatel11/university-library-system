import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/authContext.jsx';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import bg from "../assets/images/bg.png";
import noBooksFoundImg from "../assets/images/no-books.png";
import { Button } from '@/components/ui/button.jsx';
import { Loader } from '@/components/Loader.jsx';
import { toast } from 'sonner';
import warningIcon from "../assets/icons/warning.svg";

export const Home = () => {
  const { auth } = useAuth();
  const [studentAccountStatus, setStudentAccountStatus] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [book1, setBook1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [borrowRequest, setBorrowRequest] = useState(null);
  const [showBorrowButton, setShowBorrowButton] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books/allBooks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        if (data.length === 0) {
          toast.error("No books available at the moment. Please check back later.");
        }
        setAllBooks(data);
        setBook1(data[0]); // Set the first book as book1

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
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // loader stops here
      }
    };

    fetchData();
  }, []);


  const checkIfBookBorrowRequested = useCallback(async () => {
    if (!book1 || auth.userRole === "admin") return;

    try {
      const payload = {
        bookId: book1.id,
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
  }, [book1, auth.userId, auth.userRole]);

  useEffect(() => {
    checkIfBookBorrowRequested();
  }, [book1, auth.email, checkIfBookBorrowRequested]);


  const handleBorrowRequest = async () => {
    if (book1.available_copies <= 0) {
      toast.error("No copies available for borrowing at the moment.");
      return;
    }

    try {
      setButtonLoading(true);
      const payload = {
        bookId: book1.id,
        bookTitle: book1.title,
        bookAuthor: book1.author,
        bookCover: book1.cover,
        bookColor: book1.color,
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
    } finally {
      setButtonLoading(false);
    }
  };

  const handleReturnBook = async (borrowRequestId) => {
    setButtonLoading(true);
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
      checkIfBookBorrowRequested(); // Refresh borrow request status
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error(error.message || "Something went wrong while returning the book.");
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return <Loader message={"Loading books... 📚"} role={auth.userRole} />;
  }

  if (allBooks.length === 0) {
    return (
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
          <div className='flex flex-col items-center justify-center h-screen ibm-plex-sans-600'>
            <img src={noBooksFoundImg} alt="No Books Found" className="max-w-md" />
            <h1 className='text-white text-4xl mt-10'>No Books in the Library Currently</h1>
            <p className='text-light-blue text-2xl mt-5'>Please check back later</p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-center bg-no-repeat"
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
            <Link to={`/bookdetails/${book1.id}`}>
              <h1 className='ibm-plex-sans-600 text-6xl'>{book1.title}</h1>
            </Link>
            <div className='flex flex-wrap items-center gap-7 text-light-blue mt-10 '>
              <p className='text-xl'>By <span className='text-yellow ibm-plex-sans-600'>{book1.author}</span></p>
              <p className='text-xl'>Category:  <span className='text-yellow ibm-plex-sans-600'>{book1.genre}</span></p>
              <p className='text-xl'><FontAwesomeIcon icon={faStar} />  <span className='text-yellow ibm-plex-sans-600'>{book1.rating}</span>/5</p>
              <p className='text-xl'>Total Books:  <span className='text-yellow ibm-plex-sans-600'>{book1.total_copies}</span></p>
              <p className='text-xl'>Available Books:  <span className='text-yellow ibm-plex-sans-600'>{book1.available_copies}</span></p>
            </div>
            <p className='text-xl text-light-blue mt-10'>{book1.description}</p>
            {studentAccountStatus === "Verification Pending" && (
              <div className='flex gap-3 mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm w-[650px] items-center justify-start'>
                <img src={warningIcon} alt="warning" />
                Book will be available for borrowing once your account is verified by admin.
              </div>
            )}
            {((showBorrowButton || borrowRequest.status === "Returned") && studentAccountStatus != "Verification Pending") &&
              <Button disabled={buttonLoading} onClick={handleBorrowRequest} className='text-2xl bebas-neue-400 bg-yellow text-dark-end mt-10 rounded-xs border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer'>
                <FontAwesomeIcon icon={faBookOpen} /> {buttonLoading ? <Loader small/> : "BORROW BOOK REQUEST"}
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
                  disabled={buttonLoading}
                  onClick={() => {
                    handleReturnBook(borrowRequest.id);
                  }}
                  className={`bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500`}>
                  {buttonLoading ? <Loader small/> : "Return Book"}
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
                  <Button
                    disabled={buttonLoading}
                    className={`bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500`}
                  >
                    {buttonLoading ? <Loader small/> : "Return Book"}
                  </Button>
                </div>
              )
            }
          </div>
          <div className='w-1/2'>
            <div className='relative'>
              <Link to={`/bookdetails/${book1.id}`}>
                {/* Blurred book (rotated and beside main book) */}
                <div className="absolute left-30 top-10 rotate-[25deg] scale-100 blur-xs opacity-90 z-0">
                  <BookCoverSvg coverColor={book1.color} width={275} height={385} />
                  <img
                    src={book1.cover}
                    alt="Blurred Shadow"
                    className="absolute top-0 left-3 w-[275px] h-[340px] object-fit"
                  />
                </div>

                {/* Foreground normal book */}
                <div className="relative z-10">
                  <BookCoverSvg coverColor={book1.color} width={275} height={385} />
                  <img
                    src={book1.cover}
                    alt="Main Book"
                    className="absolute ps-6 inset-0 w-[275px] h-[340px] object-fit rounded-xl"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className='text-white ibm-plex-sans-600 mt-18'>
          <h1 className='text-3xl text-light-blue mb-10'>Popular Books</h1>

          <div className='flex gap-7 justify-around mt-5'>
            {allBooks.slice(1, 7).map((book, index) => (
              <div key={index} className="relative">
                <Link to={`/bookdetails/${book.id}`}>
                  <BookCoverSvg coverColor={book.color} width={200} height={280} />
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="absolute top-0 left-4 w-[183px] h-[245px] object-fit rounded-lg"
                  />
                  <div className="mt-3 w-[183px]">
                    <h2 className="text-xl truncate">{book.title} - By {book.author}</h2>
                    <p className="text-sm text-light-blue italic truncate">{book.genre}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
