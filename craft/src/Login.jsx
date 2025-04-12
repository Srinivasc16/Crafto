import React, { useState, useEffect } from "react";
import { auth } from "./FirebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("email"); // "email" or "phone"
    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();

    // Clear error when input changes or tab/mode changes
    useEffect(() => {
        setError("");
    }, [email, password, phone, mode, activeTab]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email
            };

            // Send data to backend
            await fetch("http://localhost:8080/api/user/google-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const profileData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email
            };

            await fetch("http://localhost:8080/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData)
            });


            localStorage.setItem("username", user.displayName || user.email);
            localStorage.setItem("useremail", user.email);
            localStorage.setItem("Userid", user.uid);

            navigate("/");
        } catch (error) {
            console.error("Google Login Error:", error.message);
            setError(`Google sign-in failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            setError("");
            let result;
            if (mode === "login") {
                result = await signInWithEmailAndPassword(auth, email, password);
            } else {
                result = await createUserWithEmailAndPassword(auth, email, password);
            }

            console.log("Email User:", result.user);

            localStorage.setItem("username", result.user.displayName || result.user.email);
            localStorage.setItem("useremail", result.user.email);
            localStorage.setItem("Userid", result.user.uid);

            navigate("/");
        } catch (error) {
            console.error("Email Auth Error:", error.message);
            if (error.code === "auth/user-not-found") {
                setError("No account found with this email. Please sign up.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else if (error.code === "auth/email-already-in-use") {
                setError("This email is already registered. Please log in instead.");
            } else {
                setError(`Authentication failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                { size: "invisible" },
                auth
            );
        }
    };

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            setError("Please enter a valid phone number with country code");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
            setConfirmationResult(confirmation);
            setError("");
        } catch (error) {
            console.error("Phone Auth Error:", error.message);
            setError(`Failed to send OTP: ${error.message}`);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 4) {
            setError("Please enter a valid OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const result = await confirmationResult.confirm(otp);
            console.log("Phone User:", result.user);

            localStorage.setItem("username", result.user.phoneNumber);
            localStorage.setItem("Userid", result.user.uid);

            navigate("/");
        } catch (error) {
            console.error("OTP Verification Error:", error.message);
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen pt-3 bg-gray-50">
            {/* Left Image - will be responsive based on screen size */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 bg-cover bg-center relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.pexels.com/photos/967382/pexels-photo-967382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center px-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Our Platform</h1>
                        <p className="text-lg md:text-xl max-w-md mx-auto">
                            Join our community and unlock a world of possibilities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Toggle Login/Signup */}
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            className={`px-5 py-2 rounded-xl font-semibold transition duration-200 ${
                                mode === "login"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setMode("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`px-5 py-2 rounded-xl font-semibold transition duration-200 ${
                                mode === "signup"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setMode("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        {mode === "login" ? "Welcome Back!" : "Create Account"}
                    </h2>

                    {/* Authentication Method Tabs */}
                    <div className="flex border-b mb-6">
                        <button
                            className={`flex-1 py-3 font-medium transition ${
                                activeTab === "email"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("email")}
                        >
                            Email
                        </button>
                        <button
                            className={`flex-1 py-3 font-medium transition ${
                                activeTab === "phone"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("phone")}
                        >
                            Phone
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    {activeTab === "email" ? (
                        /* Email and Password Form */
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {mode === "login" && (
                                <div className="flex justify-end">
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md ${
                                    loading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                                ) : (
                                    <span>
                    {mode === "login" ? "Sign In with Email" : "Create Account"}
                  </span>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* Phone Authentication */
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="flex-1 border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
                            </div>

                            {!confirmationResult ? (
                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md ${
                                        loading
                                            ? "bg-green-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send OTP
                    </span>
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                            Verification Code
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => {
                                                setConfirmationResult(null);
                                                if (window.recaptchaVerifier) {
                                                    window.recaptchaVerifier.clear();
                                                    window.recaptchaVerifier = null;
                                                }
                                            }}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Change number?
                                        </button>
                                        <button
                                            onClick={handleSendOTP}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                            disabled={loading}
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading}
                                        className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md ${
                                            loading
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify & Login
                      </span>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-1 border-gray-200" />
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Google Auth */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl shadow-sm hover:bg-gray-50 transition"
                    >
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20H24v8h11.3c-1.1 5.4-5.9 8.8-11.3 8.8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6.1-6.1C33.7 7.1 29.1 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.3-.2-2.7-.4-4z" />
                            <path fill="#FF3D00" d="M6.3 14.7l7.1 5.2c1.8-4.7 6.3-8 11.6-8 3 0 5.8 1.1 7.9 3l6.1-6.1C33.7 7.1 29.1 5 24 5c-8.4 0-15.5 5.2-18.7 12.7z" />
                            <path fill="#4CAF50" d="M24 43c4.9 0 9.4-1.8 12.8-4.8l-6.7-5.4c-1.8 1.2-4 1.9-6.1 1.9-5.4 0-10.1-3.4-11.3-8.8L5.3 31.2C8.5 38.2 15.5 43 24 43z" />
                            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.5 2.8-2.1 5.2-4.3 6.9l6.7 5.4c4-3.7 6.2-9.1 6.2-15.4 0-1.3-.2-2.7-.4-4z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Terms and Privacy */}
                    <p className="mt-6 text-xs text-center text-gray-500">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>

                    <div id="recaptcha-container" className="mt-4"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;