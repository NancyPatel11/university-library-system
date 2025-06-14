import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { NavBar } from '@/components/NavBar'
import { Button } from '@/components/ui/button';
import illustration1 from '../../assets/icons/admin/illustration1.png';
import illustration2 from '../../assets/icons/admin/illustration2.png';
import plusButton from '../../assets/icons/admin/plusButton.png';

export const AdminDashboard = () => {
  const { auth } = useAuth();
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <div className="flex">
      <NavBar />
      <div className="bg-admin-bg border-1 border-admin-border w-full ibm-plex-sans-600 px-5 rounded-xl pt-5">
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

        <div className='flex gap-5 ibm-plex-sans-600 mt-10'>
          <div className='bg-white rounded-2xl w-1/3 p-5'>
            <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Borrowed Books</p>
            <h1 className='text-3xl'>145</h1>
          </div>
          <div className='bg-white rounded-2xl w-1/3 p-5'>
            <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Total Users</p>
            <h1 className='text-3xl'>12</h1>
          </div>
          <div className='bg-white rounded-2xl w-1/3 p-5'>
            <p className='ibm-plex-sans-400 text-admin-secondary-black mb-7'>Total Books</p>
            <h1 className='text-3xl'>16</h1>
          </div>
        </div>

        <div className='flex gap-5 mt-8 mb-5'>
          <div className='w-1/2 flex flex-col gap-5'>
            <div className='bg-white p-5 rounded-2xl flex-1 flex flex-col justify-between'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Borrow Requests</h1>
                <Button className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer">
                  View All
                </Button>
              </div>
              <div className='flex flex-col items-center gap-3 my-10'>
                <img src={illustration1} alt="" className='h-[144px] w-[193px]' />
                <h1>No Pending Book Requests</h1>
                <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                  There are no borrow book requests awaiting your review at this time.
                </p>
              </div>
            </div>

            <div className='bg-white p-5 rounded-2xl flex-1 flex flex-col justify-between'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Account Requests</h1>
                <Button className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer">
                  View All
                </Button>
              </div>
              <div className='flex flex-col items-center gap-3 my-10'>
                <img src={illustration2} alt="" className='h-[144px] w-[210px]' />
                <h1>No Pending Account Requests</h1>
                <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                  There are currently no account requests awaiting approval.
                </p>
              </div>
            </div>
          </div>

          <div className='w-1/2 bg-white p-5 rounded-2xl flex flex-col'>
            <div className='flex justify-between items-center'>
              <h1 className='text-xl'>Recently Added Books</h1>
              <Button className="bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer">
                View All
              </Button>
            </div>

            <Button className="flex items-center justify-start gap-x-3 mt-5 py-10 text-xl bg-admin-bg text-admin-primary-blue hover:bg-admin-primary-blue hover:text-white hover:cursor-pointer">
              <img src={plusButton} alt="plus" className="h-10 w-10" />
              Add New Book
            </Button>

            <div className="flex-grow flex items-center justify-center">
              <div className='flex flex-col items-center gap-3'>
                <img src={illustration1} alt="" className='h-[144px] w-[193px]' />
                <h1>No New Books Added Recently</h1>
                <p className='ibm-plex-sans-300 text-admin-secondary-black text-center'>
                  There are no new books added at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}