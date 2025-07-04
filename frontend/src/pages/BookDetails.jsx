import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext.jsx';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen, faArrowLeft, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
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
  const [showBorrowButton, setShowBorrowButton] = useState(true);
  const [borrowRequest, setBorrowRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch current book by ID
      const bookRes = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
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
      const allBooksRes = await fetch(`${import.meta.env.VITE_API_URL}/books/allBooks`, {
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

      const sortedBooks = allBooksData.sort((a, b) => {
        return b.rating - a.rating; // Sort by rating in descending order
      });

      setAllBooks(sortedBooks);

      // Fetch student account status
      if (auth.userRole !== "student") return; // Only fetch for students
      const studentResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/accountStatus`, {
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
      toast.error(error.message || "Something went wrong while fetching book details.");
      console.error("Error fetching book or books:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId, auth.userRole]);

  useEffect(() => {
    fetchData();
  }, [bookId, auth.userRole, fetchData]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/borrow-requests/check-status`, {
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
        throw new Error(data.message);
      }

      setBorrowRequest(data);
      setShowBorrowButton(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong while checking borrow request status.");
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
    setButtonLoading(true);
    try {
      const payload = {
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.cover,
        bookColor: book.color,
        studentEmail: auth.email,
        studentId: auth.userId,
        studentFullName: auth.name,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/borrow-requests/create`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/borrow-requests/return-book/${borrowRequestId}`, {
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
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const payload = {
        bookId: book.id,
        rating: rating,
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/books/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        toast.error("You have already rated this book.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating");
      }

      if (response.ok) {
        setRating(0); // Reset rating after submission
        toast.success("Rating submitted!");
        await fetchData();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong while submitting the rating.");
      console.error("Rating error:", err);
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

        <div className="flex mt-14 ibm-plex-sans-400 text-white justify-between items-center gap-50">
          <div className='w-2/3'>
            <h1 className='ibm-plex-sans-600 text-6xl'>{book.title}</h1>
            <div className='flex flex-wrap items-center gap-7 text-light-blue mt-10 '>
              <p className='text-xl'>By <span className='text-yellow ibm-plex-sans-600'>{book.author}</span></p>
              <p className='text-xl'>Category:  <span className='text-yellow ibm-plex-sans-600'>{book.genre}</span></p>
              <p className='text-xl'><FontAwesomeIcon icon={regularStar} />  <span className='text-yellow ibm-plex-sans-600'>{book.rating}</span>/5</p>
              <p className='text-xl'>Rated by: <span className='text-yellow ibm-plex-sans-600'>{book.ratedBy ? Object.keys(book.ratedBy).length : 0}</span> user(s)</p>
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
            {studentAccountStatus === "Denied" && (
              <div className='flex gap-3 mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm w-[650px] items-center justify-start'>
                <img src={warningIcon} alt="warning" />
                Your account has been denied by admin. Please contact admin for more details. Book borrowing is not allowed for denied accounts.
              </div>
            )}
            {((showBorrowButton || borrowRequest.status === "Returned" || borrowRequest.status === "Late Return") && studentAccountStatus == "Verified") &&
              <Button disabled={buttonLoading} onClick={handleBorrowRequest} className='text-2xl bebas-neue-400 bg-yellow text-dark-end mt-10 rounded-xs border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer'>
                <FontAwesomeIcon icon={faBookOpen} /> {buttonLoading ? <Loader small /> : "BORROW BOOK REQUEST"}
              </Button>
            }
            {borrowRequest && borrowRequest?.status === "Pending" && (
              <div className='flex mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm w-[325px] items-center justify-around'>
                <img src={warningIcon} alt="warning" />
                Book Request Approval Pending
              </div>
            )}
            {borrowRequest && borrowRequest.status === "Borrowed" && (
              <div className='flex flex-col gap-5'>
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
                    {buttonLoading ? <Loader small /> : "Return Book"}
                  </Button>
                </div>

                <BookRatingSection
                  book={book}
                  auth={auth}
                  rating={rating}
                  setRating={setRating}
                  hovered={hovered}
                  setHovered={setHovered}
                  handleRatingSubmit={handleRatingSubmit}
                />

              </div>
            )}
            {
              borrowRequest && borrowRequest.status === "Overdue" && (
                <div className='flex flex-col gap-5'>
                  <div className='flex mt-5 text-lg ibm-plex-sans-300 bg-search-bar p-3 rounded-sm items-center justify-between gap-3'>
                    <div className='flex gap-3'>
                      <img src={warningIcon} alt="warning" />
                      <span className='text-yellow ibm-plex-sans-600'>Your book is overdue!</span>
                    </div>
                    <Button
                      disabled={buttonLoading}
                      onClick={() => {
                        handleReturnBook(borrowRequest.id);
                      }}
                      className={`bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500`}
                    >
                      {buttonLoading ? <Loader small /> : "Return Book"}
                    </Button>
                  </div>

                  <BookRatingSection
                    book={book}
                    auth={auth}
                    rating={rating}
                    setRating={setRating}
                    hovered={hovered}
                    setHovered={setHovered}
                    handleRatingSubmit={handleRatingSubmit}
                  />

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
              {allBooks
                .filter(book => book.id !== bookId)
                .slice(0, 6)
                .map((book, index) => (
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
        <div>
          <h1 className='text-admin-primary-black text-2xl'>Hey, {auth.name}</h1>
          <p className='text-admin-secondary-black ibm-plex-sans-300 mt-2'>Everything you need to know about this book in one place</p>
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
              <p className='text-admin-secondary-black ibm-plex-sans-300'>{new Date(book.createdAt).toLocaleDateString()}</p>
            </div>
            <h1 className='text-4xl'>{book.title}</h1>
            <h1 className='text-2xl'>{book.author}</h1>
            <p className='text-lg text-admin-secondary-black ibm-plex-sans-300'>{book.genre}</p>

            {
              book.ratedBy &&
              <div className='flex gap-10'>
                <p className='text-lg text-admin-secondary-black ibm-plex-sans-300'>
                  <FontAwesomeIcon icon={solidStar} className='text-admin-primary-blue' />
                  <span className='text-admin-primary-blue ibm-plex-sans-600 mx-1'>{book.rating}</span>/ 5
                </p>
                <p className='text-lg text-admin-secondary-black ibm-plex-sans-300'>
                  Rated by:
                  <span className='text-admin-primary-blue ibm-plex-sans-600 mx-1'>{book.ratedBy ? Object.keys(book.ratedBy).length : 0}</span>
                  user(s)
                </p>
              </div>
            }

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

const BookRatingSection = ({ book, auth, rating, setRating, hovered, setHovered, handleRatingSubmit }) => {
  const hasRated = book.ratedBy && book.ratedBy[auth.userId] != null;

  if (hasRated) {
    return (
      <div className='text-light-blue ibm-plex-sans-400 text-xl mt-5'>
        You've rated this book:
        <span className="text-yellow ml-1">
          {book.ratedBy[auth.userId]}
          <FontAwesomeIcon icon={solidStar} className="text-yellow ml-1" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-5">
      <div className="flex space-x-1 text-2xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= (hovered || rating) ? solidStar : regularStar}
            className="cursor-pointer transition-colors"
            color={star <= (hovered || rating) ? "gold" : "gray"}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          />
        ))}
      </div>
      <button
        onClick={handleRatingSubmit}
        disabled={rating === 0}
        className="p-2 rounded-sm text-sm bg-yellow-dark text-black hover:cursor-pointer hover:bg-yellow ibm-plex-sans-500"
      >
        Submit Rating
      </button>
    </div>
  );
};
