import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import bg from "../assets/images/bg.png";

export const VerifyEmail = () => {
    const { auth, setAuth } = useAuth();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const sendCode = async () => {
        const toastId = toast.loading("Sending verification code to your inbox...");
        try {
            const response = await fetch("/api/verify/send-code", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                let message = data?.message || "Failed to send verification code";

                if (response.status === 401) message = "You are not logged in";
                else if (response.status === 404) message = "User not found";
                else if (response.status === 500) message = "Server error while sending code";

                toast.error(message, { id: toastId });
                return;
            }

            toast.success(data.message || "Code sent successfully", { id: toastId });
        } catch (error) {
            console.error("Error sending verification code:", error);
            toast.error("Network error. Please try again.", { id: toastId });
        }
    };


    useEffect(() => {
        // trigger send code on mount
        sendCode();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`).focus();
        }

        if (!value && index > 0) {
            document.getElementById(`code-${index - 1}`).focus();
        }
    };

    const handleSubmit = async () => {
        const finalCode = code.join("");
        if (finalCode.length < 6) {
            toast.error("Please enter the full 6-digit code.");
            return;
        }

        setIsButtonLoading(true);
        const toastId = toast.loading("Verifying email...");
        try {
            const response = await fetch("/api/verify/verify-email", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code: finalCode })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                let message = data?.message || "Verification failed";

                if (response.status === 400) message = "Missing verification code";
                else if (response.status === 401) message = "Invalid or expired code";
                else if (response.status === 500) message = "Internal server error";

                toast.error(message, { id: toastId });
                setIsButtonLoading(false);
                return;
            }

            toast.success(data.message || "Email verified successfully", { id: toastId });
            navigate(auth.userRole === "student" ? "/home" : "/admin-dashboard");

        } catch (err) {
            console.error("Verification error:", err);
            toast.error("Something went wrong. Please try again.", { id: toastId });
        } finally {
            setIsButtonLoading(false);
        }
    };

    return (
        auth.userRole === "student" ?
            <div
                className="h-screen bg-center bg-no-repeat flex justify-center items-center"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                }}
            >
                <div className="bg-search-bar text-white p-8 rounded-2xl shadow-md w-[850px] ibm-plex-sans-600">
                    <div className="flex justify-center mb-5">
                        <FontAwesomeIcon
                            icon={faEnvelopeCircleCheck}
                            size="5x"
                            className={`transition-colors duration-300 ${code.every(d => d !== "") ? "text-yellow-dark" : "text-gray-400"}`}
                        />

                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                value={value}
                                maxLength={1}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="w-10 h-12 text-center border rounded"
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mb-4">
                        <h1 className="text-3xl text-yellow-dark">Verification Code</h1>
                    </div>
                    <h2 className="text-xl ibm-plex-sans-300 mb-6 text-light-blue">
                        We've sent a 6-digit verification code to your email address. Please check your inbox (and spam folder if you don't see it) and enter the code below to verify your account.
                    </h2>

                    <div className="flex justify-between my-2">
                        <Button
                            onClick={() => {
                                //clear the cookie
                                document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                //clear the auth context
                                setAuth({ userRole: "", email: "", name: "", userId: "" });
                                //navigate to login page
                                navigate("/login")
                            }}
                            className="p-0 ibm-plex-sans-400 text-md text-white shadow-none border-none bg-transparent hover:bg-transparent transition-colors duration-300"
                        >
                            Go back to <span className="text-yellow-dark hover:underline hover:cursor-pointer ibm-plex-sans-600">Login</span>
                        </Button>

                        <Button
                            onClick={() => sendCode()}
                            className="p-0 ibm-plex-sans-400 text-md text-white shadow-none border-none bg-transparent hover:bg-transparent transition-colors duration-300"
                        >
                            Didn't receive the code? <span className="text-yellow-dark hover:underline hover:cursor-pointer ibm-plex-sans-600">Resend</span>
                        </Button>

                    </div>

                    <Button
                        disabled={isButtonLoading || code.some(d => d === "")}
                        onClick={handleSubmit}
                        className="w-full ibm-plex-sans-700 bg-yellow-dark border-1 border-yellow-dark text-black hover:cursor-pointer hover:bg-transparent hover:text-white transition-colors duration-300"
                    >
                        {isButtonLoading ? <Loader small /> : "Verify Email"}
                    </Button>
                </div>
            </div>
            :
            <div
                className="h-screen bg-admin-bg flex justify-center items-center"
            >
                <div className="bg-white text-admin-primary-blue p-8 rounded-2xl w-[850px] ibm-plex-sans-600">
                    <div className="flex justify-center mb-5">
                        <FontAwesomeIcon
                            icon={faEnvelopeCircleCheck}
                            size="5x"
                            className={`transition-colors duration-300 ${code.every(d => d !== "") ? "text-admin-primary-blue" : "text-gray-500"}`}
                        />

                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                value={value}
                                maxLength={1}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="w-10 h-12 text-center border rounded"
                            />
                        ))}
                    </div>
                    <div className="flex justify-center mb-4">
                        <h1 className="text-3xl text-admin-primary-blue">Verification Code</h1>
                    </div>
                    <h2 className="text-xl ibm-plex-sans-300 mb-6 text-admin-secondary-black">
                        We've sent a 6-digit verification code to your email address. Please check your inbox (and spam folder if you don't see it) and enter the code below to verify your account.
                    </h2>

                    <div className="flex justify-between my-2">
                        <Button
                            onClick={() => {
                                //clear the cookie
                                document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                //clear the auth context
                                setAuth({ userRole: "", email: "", name: "", userId: "" });
                                //navigate to login page
                                navigate("/login")
                            }}
                            className="p-0 ibm-plex-sans-400 text-md text-admin-primary-black shadow-none border-none bg-transparent hover:bg-transparent transition-colors duration-300"
                        >
                            Go back to <span className="text-admin-primary-blue hover:underline hover:cursor-pointer ibm-plex-sans-600">Login</span>
                        </Button>

                        <Button
                            onClick={() => sendCode()}
                            className="p-0 ibm-plex-sans-400 text-md text-admin-primary-black shadow-none border-none bg-transparent hover:bg-transparent transition-colors duration-300"
                        >
                            Didn't receive the code? <span className="text-admin-primary-blue hover:underline hover:cursor-pointer ibm-plex-sans-600">Resend</span>
                        </Button>

                    </div>

                    <Button
                        disabled={isButtonLoading || code.some(d => d === "")}
                        onClick={handleSubmit}
                        className="w-full ibm-plex-sans-700 bg-admin-primary-blue border-1 border-admin-primary-blue text-white hover:cursor-pointer hover:bg-transparent hover:text-admin-primary-blue transition-colors duration-300"
                    >
                        {isButtonLoading ? <Loader small admin /> : "Verify Email"}
                    </Button>
                </div>
            </div>
    );
};
