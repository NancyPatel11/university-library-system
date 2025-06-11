import React from 'react'
import { NavBar } from '@/components/NavBar';
import { sampleBooks } from '../assets/index.js';
import BookCoverSvg from '../components/BookCoverSvg.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import bg from "../assets/images/bg.png";
import { Button } from '@/components/ui/button.jsx';

export const Home = () => {
  const book1 = sampleBooks[0];

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
            <h1 className='ibm-plex-sans-600 text-6xl'>{book1.title}</h1>
            <div className='flex flex-wrap items-center gap-7 text-light-blue mt-10 '>
              <p className='text-xl'>By <span className='text-yellow ibm-plex-sans-600'>{book1.author}</span></p>
              <p className='text-xl'>Category:  <span className='text-yellow ibm-plex-sans-600'>{book1.genre}</span></p>
              <p className='text-xl'><FontAwesomeIcon icon={faStar} />  <span className='text-yellow ibm-plex-sans-600'>{book1.rating}</span>/5</p>
              <p className='text-xl'>Total Books:  <span className='text-yellow ibm-plex-sans-600'>{book1.total_copies}</span></p>
              <p className='text-xl'>Available Books:  <span className='text-yellow ibm-plex-sans-600'>{book1.available_copies}</span></p>
            </div>
            <p className='text-xl text-light-blue mt-10'>{book1.summary}</p>
            <Button className='text-2xl bebas-neue-400 bg-yellow text-dark-end mt-10 rounded-xs border-2 border-yellow hover:bg-yellow-dark hover:border-yellow-dark hover:cursor-pointer'>
              <FontAwesomeIcon icon={faBookOpen} /> BORROW BOOK REQUEST
            </Button>
          </div>
          <div className='w-1/2'>
            <div className='relative'>
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
            </div>
          </div>
        </div>

        <div className='text-white ibm-plex-sans-600 mt-18'>
          <h1 className='text-3xl text-light-blue mb-10'>Popular Books</h1>

          <div className='flex gap-7 justify-around mt-5'>
            {sampleBooks.slice(1, 7).map((book, index) => (
              <div key={index} className="relative">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
