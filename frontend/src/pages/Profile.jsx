import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { NavBar } from '@/components/NavBar';
import { Loader } from '@/components/Loader';
import { BorrowedBookCard } from '@/components/BorrowedBookCard';
import { toast } from 'sonner';
import bg from "../assets/images/bg.png";
import profileBg from "../assets/images/profile-bg.png";
import verifiedImg from "../assets/icons/verified.svg";
import verificationPendingImg from "../assets/icons/warning.svg";
import userFallbackImg from "../assets/icons/user-fill.svg";

export const Profile = () => {
  const { auth } = useAuth();
  const [idCardUrl, setIdCardUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const requestUrl = `${import.meta.env.VITE_API_URL}/user/idcard/${auth.email}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch ID card");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setIdCardUrl(url);
      } catch (error) {
        toast.error(error.message || "Failed to fetch ID card");
        console.error("Error fetching ID card:", error);
      }
    };

    fetchIdCard();
  }, [auth.email]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch user profile");
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllBorrowedBooksIDs = async () => {
      if (auth.userRole !== 'student') return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/borrow-requests/my-borrowed-books`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch borrowed books");
        }

        const data = await response.json();

        const bookDetails = await Promise.all(
          data.map(async (borrowRequest) => {
            const bookId = borrowRequest.bookId;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Failed to fetch book details");
            }

            const bookData = await res.json();

            return {
              ...bookData,
              studentEmail: borrowRequest.studentEmail,
              issueDate: borrowRequest.issueDate,
              dueDate: borrowRequest.dueDate,
              returnDate: borrowRequest.returnDate,
              status: borrowRequest.status,
            };
          })
        );

        const sortedBorrowedBooks = bookDetails.sort((a, b) => {
          // if status is pending, put it at the start
          if (a.status === "Pending") return -1;

          const dateA = new Date(a.issueDate);
          const dateB = new Date(b.issueDate);
          return dateB - dateA; // Sort by issueDate in descending order
        });

        setBorrowedBooks(sortedBorrowedBooks);
      } catch (error) {
        toast.error(error.message || "Failed to fetch borrowed book details");
        console.error("Error fetching borrowed book details:", error);
      }
    };

    fetchAllBorrowedBooksIDs();
  }, [auth.userRole, user?.borrowedBooks]);


  if (!user || !idCardUrl) {
    return <Loader message={"Navigating to your profile 👤"} role={auth.userRole} />
  }

  return (
    <div
      className="min-h-screen h-full bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
    >
      <div className='px-20 py-12'>
        <NavBar userColor={'yellow'} />

        <div className='flex gap-10 justify-center mt-20'>
          <div
            className='bg-center bg-no-repeat rounded-4xl ibm-plex-sans-600 text-white h-[1185px] w-[1130px]'
            style={{
              backgroundImage: `url(${profileBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className='px-15 mt-50'>
              <div className='flex gap-8 items-center'>
                <div className="w-50 h-50 rounded-full p-2 ring-10 ring-search-bar flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={userFallbackImg}
                      alt="Default Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <div>
                  <div className='flex gap-2 items-center'>
                    {user.accountStatus === 'Verified' ? <img src={verifiedImg} alt="" className='h-10' /> :
                      <img src={verificationPendingImg} alt="" className='h-10' />
                    }
                    <h3 className='ibm-plex-sans-300 text-2xl  block text-light-blue'>{user.accountStatus}</h3>
                  </div>
                  <div className='mt-3 flex gap-2 ibm-plex-sans-300 text-xl'>
                    <h3 className='text-light-blue'>Registered on</h3>
                    <p className='text-yellow'>
                      {new Date(user.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className='mt-8'>
                    <h1 className='ibm-plex-sans-500 text-3xl '>{user.fullName}</h1>
                    <p className='mt-3 ibm-plex-sans-300 text-2xl  text-light-blue'>{user.email}</p>
                  </div>
                </div>
              </div>

              <div className='mt-15'>
                <p className='ibm-plex-sans-300 text-3xl  text-light-blue'>University</p>
                <h1 className='mt-3 ibm-plex-sans-500 text-4xl '>NP University</h1>
              </div>

              <div className='mt-7'>
                <p className='ibm-plex-sans-300 text-3xl  text-light-blue'>Student ID</p>
                <h1 className='mt-3 ibm-plex-sans-500 text-4xl '>{user.universityId}</h1>
              </div>

              {idCardUrl ? (
                <img src={idCardUrl} alt="ID Card" className='mt-15 rounded-md' />
              ) : (
                <p>Loading ID card...</p>
              )}
            </div>
          </div>
          <div className='w-2/3 ibm-plex-sans-400'>
            <h1 className='text-4xl text-light-blue ibm-plex-sans-600'>Borrowed Books</h1>
            <div className='flex flex-wrap gap-7 mt-5 text-white justify-start'>
              {borrowedBooks.length != 0 ? (

                borrowedBooks.slice(0, 4).map((book, index) => (
                  <BorrowedBookCard
                    key={index}
                    book={book}
                    onClick={() => navigate(`/bookdetails/${book.id}`)}
                  />
                )))
                :
                <h1 className='text-xl text-yellow'>Your requested, borrowed, returned books will be displayed here.</h1>
              }
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-7 mt-7 text-white justify-end px-10'>
          {borrowedBooks.length > 4 && (
            borrowedBooks.slice(4).map((book, index) => (
              <BorrowedBookCard
                key={index}
                book={book}
                onClick={() => navigate(`/bookdetails/${book.id}`)}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};