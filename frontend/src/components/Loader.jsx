import React, { useEffect } from 'react'
import bg from "../assets/images/bg.png";

export const Loader = ({ role, message, small = false, admin = false }) => {

    useEffect(() => {
        // Inject keyframes only once
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes flip {
            0%   { transform: rotateY(0deg); opacity: 1; }
            50%  { transform: rotateY(-120deg); opacity: 0.6; }
            100% { transform: rotateY(-180deg); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
    }, []);

    const pageBaseStyle = {
        width: '100%',
        height: '100%',
        backgroundColor: '#facc15',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        transformOrigin: 'left center',
        animationName: 'flip',
        animationDuration: '1.2s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
    };

    if (small) {
        return admin ?
            <div className={`animate-spin h-5 w-5 border-2 border-t-transparent rounded-full border-admin-primary-blue`}></div>
            :
            <div className={`animate-spin h-5 w-5 border-2 border-t-transparent rounded-full border-white`}></div>
    }

    if (role === "student") {
        return (
            <div
                className="h-screen bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                }}
            >
                <div className="flex flex-col items-center justify-center h-screen ibm-plex-sans-500">

                    <div className="flex items-end justify-center mt-4 gap-15 text-white">
                        <h2 className="text-5xl font-semibold my-4 text-white inline">Flipping pages</h2>
                        <div className=" w-14 h-18 content-end inline" style={{ perspective: '600px' }}>

                            <div
                                className="relative w-full h-full"
                                style={{ transform: 'rotateX(10deg)', position: 'relative' }}
                            >
                                <div
                                    style={{
                                        ...pageBaseStyle,
                                        zIndex: 3,
                                        animationDelay: '0s',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        ...pageBaseStyle,
                                        zIndex: 2,
                                        animationDelay: '0.2s',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        ...pageBaseStyle,
                                        zIndex: 1,
                                        animationDelay: '0.4s',
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg text-light-blue mt-4">{message}</p>



                    <p className="text-sm italic text-light-blue">
                        Organizing your bookshelf...
                    </p>

                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-admin-bg text-admin-primary-blue ibm-plex-sans-600">
            <div className="relative flex justify-center items-center mb-4">
                <div className="w-16 h-16 border-4 border-admin-primary-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl">{message}</h2>
            <p className="text-admin-secondary-black text-sm mt-1 italic">Preparing your data...</p>
        </div>
    );
}
