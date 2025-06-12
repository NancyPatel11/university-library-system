import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import bg from "../assets/images/bg.png";
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';

export const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);

  // Find the book based on the bookId from search params
  useEffect(() => {
    const fetchCurrentBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }

    fetchCurrentBook();
  }, [bookId]);

  const [allBooks, setAllBooks] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
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
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  if (!allBooks || !book) {
    return <div className="text-white text-2xl px-20 py-12">Loading books...</div>;
  }


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
        <NavBar />

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
            <Button className='text-2xl bebas-neue-400 bg-yellow text-dark-end mt-10 rounded-xs border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer'>
              <FontAwesomeIcon icon={faBookOpen} /> BORROW BOOK REQUEST
            </Button>
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
              ))}</p>
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
  )
}
