import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { NavBar } from '@/components/NavBar';
import { Loader } from '@/components/Loader';
import BookCoverSvg from '@/components/BookCoverSvg';
import bg from "../assets/images/bg.png";
import profileBg from "../assets/images/profile-bg.png";
import verifiedImg from "../assets/icons/verified.svg";
import verificationPendingImg from "../assets/icons/warning.svg";
import borrowedBookImg from "../assets/icons/book-2.svg";
import CalendarImg from "../assets/icons/calendar.svg";
import userFallbackImg from "../assets/icons/user-fill.svg";

export const Profile = () => {
  const { auth } = useAuth();
  const [idCardUrl, setIdCardUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const requestUrl = `http://localhost:8080/api/user/idcard/${auth.email}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ID card");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setIdCardUrl(url);
      } catch (error) {
        console.error("Error fetching ID card:", error);
      }
    };

    fetchIdCard();
  }, [auth.email]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllBorrowedBooks = async () => {
      if (!user?.borrowedBooks?.length) return;

      try {
        const booksWithMeta = await Promise.all(
          user.borrowedBooks.map(async (borrowed) => {
            const res = await fetch(`http://localhost:8080/api/books/${borrowed.bookId}`, {
              method: "GET",
              credentials: "include",
            });

            if (!res.ok) {
              console.error(`Failed to fetch book ${borrowed.bookId}`);
              return null;
            }

            const bookData = await res.json();

            return {
              ...bookData,
              issueDate: borrowed.issueDate,
              returnDate: borrowed.returnDate,
              status: borrowed.status,
            };
          })
        );

        // Filter out nulls if any fetch fails
        setBorrowedBooks(booksWithMeta.filter(Boolean));
      } catch (error) {
        console.error("Error fetching borrowed book details:", error);
      }
    };

    fetchAllBorrowedBooks();
  }, [user]);

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

        <div className='flex gap-30'>
          <div
            className='w-1/3 bg-center bg-no-repeat rounded-lg ibm-plex-sans-600 text-white h-[965px] min-w-[750px]'
            style={{
              backgroundImage: `url(${profileBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className='px-30 mt-60'>

              <div className='flex gap-8'>
                <div className="w-25 h-25 rounded-full p-2 ring-10 ring-search-bar flex items-center justify-center overflow-hidden">
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
                  <div className='flex gap-2'>
                    {user.accountStatus === 'Verified' ? <img src={verifiedImg} alt="h-5" /> :
                      <img src={verificationPendingImg} alt="h-5" />
                    }
                    <h3 className='ibm-plex-sans-300 text-sm  block text-light-blue'>{user.accountStatus}</h3>
                  </div>

                  <div className='mt-3'>
                    <h1 className='ibm-plex-sans-500 text-xl '>{user.fullName}</h1>
                    <p className='ibm-plex-sans-300 text-lg  text-light-blue'>{user.email}</p>
                  </div>
                </div>
              </div>

              <div className='mt-10'>
                <p className='ibm-plex-sans-300 text-lg  text-light-blue'>University</p>
                <h1 className='ibm-plex-sans-500 text-2xl '>NP University</h1>
              </div>

              <div className='mt-7'>
                <p className='ibm-plex-sans-300 text-lg  text-light-blue'>Student ID</p>
                <h1 className='ibm-plex-sans-500 text-2xl '>{user.universityId}</h1>
              </div>

              {idCardUrl ? (
                <img src={idCardUrl} alt="ID Card" className='mt-10 rounded-md ' />
              ) : (
                <p>Loading ID card...</p>
              )}
            </div>
          </div>
          <div className='w2/3 mt-20 ibm-plex-sans-400'>
            <h1 className='text-3xl text-light-blue mb-10 ibm-plex-sans-600'>Borrowed Books</h1>

            <div className='flex flex-wrap gap-7 mt-5 text-white justify-start'>
              {borrowedBooks.map((book, index) => (
                <div key={index} className="bg-search-bar p-5 rounded-lg gap-4 items-center">
                  {/* Wrapper with overlay */}
                  <div className="relative px-10 py-5 rounded-lg overflow-hidden">
                    {/* Color overlay with 30% opacity */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundColor: book.color,
                        opacity: 0.5,
                      }}
                    />

                    {/* Actual content (full opacity) */}
                    <div className="relative z-10">
                      <BookCoverSvg coverColor={book.color} width={200} height={280} />
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="absolute top-0 left-4 w-[183px] h-[245px] object-fit rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Book details */}
                  <div className="mt-3 w-[270px] ibm-plex-sans-400">
                    <div className='min-h-[80px]'>
                      <h2 className="text-xl ibm-plex-sans-500">
                        {book.title} - By {book.author}
                      </h2>
                      <p className="text-sm text-light-blue italic truncate mt-2 mb-5">{book.genre}</p>
                    </div>
                    {book.status == "Borrow Request Pending" ?
                      <div className='flex gap-2 flex-wrap text-light-blue'>
                        <img src={verificationPendingImg} alt="Book Requesnt Pending" />
                        <p>{book.status}</p>
                      </div>
                      :
                      <div className='flex flex-col gap-2 text-light-blue'>
                        <div className='flex gap-2 flex-wrap'>
                          <img src={verifiedImg} alt="Borrowed" />
                          <p className='text-light-blue'>{book.status}</p>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                          <img src={borrowedBookImg} alt="Borrowed" />
                          <p>Borrowed on {book.issueDate}</p>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                          <img src={CalendarImg} alt="Borrowed" />
                          <p>To be returned on {book.returnDate}</p>
                        </div>
                      </div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};