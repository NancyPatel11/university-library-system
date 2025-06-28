import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Error401 } from "@/pages/Error401";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const [authState, setAuthState] = useState({ loading: true, authorized: false });
    const { auth, setAuth } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check-token", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    toast.error(data.message || "Authentication failed. Please log in again.");
                    setAuthState({ loading: false, authorized: false });
                    return;
                }

                const { role, email, name, userId } = data;
                setAuth({ userRole: role, email, name, userId });

                if (allowedRoles && !allowedRoles.includes(role)) {
                    setAuthState({ loading: false, authorized: false });
                    return;
                }

                setAuthState({ loading: false, authorized: true });
            } catch (err) {
                console.error("Error during auth check:", err);
                toast.error("Could not verify authentication.");
                setAuthState({ loading: false, authorized: false });
            }
        };

        checkAuth();
    }, [allowedRoles, setAuth]);

    if (authState.loading) {
        return <Loader role={auth.userRole} message={"Authenticating... 🔒"} />;
    }

    if (!authState.authorized) {
        if (auth.userRole && !allowedRoles.includes(auth.userRole)) {
            return <Error401 role={auth.userRole} />;
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};
