// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/check-token", {
                    method: "GET",
                    credentials: "include",
                });

                // ✅ 204 No Content = logged out, do NOT show error toast
                if (response.status === 204) {
                    setIsAuthenticated(false);
                    toast.success("Logged out successfully! 👋");
                    return;
                }

                const data = await response.json();

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    toast.error(data.message || "Authentication failed. Please log in again.");
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <Loader message={"Authenticating... 🔒"} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
