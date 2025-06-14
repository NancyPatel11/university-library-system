import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const [authState, setAuthState] = useState({ loading: true, authorized: false });
    const { setAuth } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/check-token", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message || "Authentication failed. Please log in again.");
                    setAuthState({ loading: false, authorized: false });
                    return;
                }

                const userRole = data.role;
                const email = data.email;
                const name = data.name;
                setAuth({ userRole, email , name });

                if (allowedRoles && !allowedRoles.includes(userRole)) {
                    toast.error("Unauthorized: Access denied");
                    setAuthState({ loading: false, authorized: false });
                    return;
                }

                // All good
                setAuthState({ loading: false, authorized: true });
            } catch (err) {
                console.error("Error during auth check:", err);
                toast.error("Could not verify authentication.");
                setAuthState({ loading: false, authorized: false });
            }
        };

        checkAuth();
    }, [allowedRoles, setAuth]);

    if (authState.loading) return <Loader message={"Authenticating... 🔒"} />;

    if (!authState.authorized) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};