import React, { useEffect, useState } from 'react';

export const Profile = () => {
  const [idCardUrl, setIdCardUrl] = useState(null);

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

  return (
    <div>
      <h1>Welcome to Profile Page</h1>
      {idCardUrl ? (
        <img src={idCardUrl} alt="ID Card" style={{ maxWidth: '300px' }} />
      ) : (
        <p>Loading ID card...</p>
      )}
    </div>
  );
};