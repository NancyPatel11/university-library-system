import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Loader } from '@/components/Loader';
import bg from "../assets/images/bg.png";
import profileBg from "../assets/images/profile-bg.png";
import verifiedImg from "../assets/icons/verified.svg";
import userFallbackImg from "../assets/icons/user-fill.svg";

export const Profile = () => {
  const [idCardUrl, setIdCardUrl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/idcard", {
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
  }, []);

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

  if (!user || !idCardUrl) {
    return <Loader message={"Navigating to your profile 👤"} />
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

        <div className='flex'>
          <div
            className='w-1/3 bg-center bg-no-repeat rounded-lg ibm-plex-sans-600 text-white min-h-[965px] min-w-[700px]'
            style={{
              backgroundImage: `url(${profileBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className='px-25 mt-60'>

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
                    <img src={verifiedImg} alt="h-5" />
                    <h3 className='ibm-plex-sans-300 text-sm  block text-light-blue'>Verified Student</h3>
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
          <div className='w2/3'>

          </div>
        </div>

      </div>
    </div>
  );
};