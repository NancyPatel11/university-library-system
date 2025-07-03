import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Error401 } from "@/pages/Error401";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const [authState, setAuthState] = useState({ loading: true, authorized: false });
    const [redirectingToVerify, setRedirectingToVerify] = useState(false);
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-token`, {
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

                const url = role === "student"
                    ? `${import.meta.env.VITE_API_URL}/user/check-email-verification`
                    : `${import.meta.env.VITE_API_URL}/admin/check-email-verification`;

                try {
                    const emailVerifiedResponse = await fetch(url, {
                        method: "GET",
                        credentials: "include",
                    });
                    const emailVerifiedData = await emailVerifiedResponse.json();

                    if (!emailVerifiedResponse.ok || !emailVerifiedData.isVerified) {
                        toast.warning("Please verify your email to continue.");
                        setRedirectingToVerify(true);
                        navigate("/verify", { replace: true, state: { from: location } });
                        return;
                    }

                } catch (emailErr) {
                    console.error("Error checking email verification:", emailErr);
                    toast.error("Could not verify email status.");
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
    }, [allowedRoles, setAuth, location, navigate]);

    if (redirectingToVerify || authState.loading) {
        return <Loader role={auth.userRole} message={"Authenticating... 🔒"} />;
    }

    if (!authState.authorized) {
        if (auth.userRole && !allowedRoles.includes(auth.userRole)) {
            return <Error401 role={auth.userRole} />;
        }

        return navigate("/login", {
            replace: true,
            state: { from: location },
        });
    }

    return children;
};
