// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/check-token", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // or a loader component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
