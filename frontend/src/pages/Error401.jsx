import React from 'react'
import { Button } from '@/components/ui/button';
import bg from "../assets/images/bg.png";
import err401 from "../assets/images/err401.png";

export const Error401 = ({ role }) => {

    return role === 'admin' ? (
        <div className="h-screen bg-admin-bg">
            <div className='flex flex-col items-center justify-start h-full'>
                <img src={err401} alt="" className='h-[875px] w-auto' />
                <h1 className='text-6xl bebas-neue-400 text-admin-primary-blue mb-2'>UNAUTHORIZED</h1>
                <p className='text-2xl ibm-plex-sans-500 text-admin-primary-blue mb-5'>You do not have the permission to visit this page.</p>
                <Button
                    className='p-3 text-lg ibm-plex-sans-400 border-1 border-admin-primary-blue bg-admin-primary-blue text-white hover:cursor-pointer hover:text-admin-primary-blue hover:bg-white'
                    variant="outline"
                    onClick={() => window.location.href = '/admin-dashboard'}
                >
                    Go back to Admin Dashboard
                </Button>
            </div>
        </div>
    ) : (
        <div
            className="h-screen bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            }}
        >
            <div className='flex flex-col items-center justify-start h-full'>
                <img src={err401} alt="" className='h-[875px] w-auto' />
                <h1 className='text-6xl bebas-neue-400 text-yellow mb-2'>UNAUTHORIZED</h1>
                <p className='text-2xl ibm-plex-sans-500 text-yellow mb-5'>You do not have the permission to visit this page.</p>
                <Button
                    className='p-3 text-lg ibm-plex-sans-400 border-1 border-yellow bg-yellow text-dark-end hover:cursor-pointer hover:text-white hover:bg-dark-end'
                    onClick={() => window.location.href = '/home'}
                >
                    Go back to Home
                </Button>
            </div>
        </div>
    )

}
