import React, { useState } from "react";
import { auth } from "./FirebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [mode, setMode] = useState("login");
    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();

    const handleGoogleLogin = async () => {
        try {
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

            localStorage.setItem("username", user.displayName || user.email);
            localStorage.setItem("useremail", user.email);
            localStorage.setItem("Userid", user.uid);

            navigate(`/home/${user.uid}`); // Correct route
        } catch (error) {
            console.error("Google Login Error:", error.message);
        }
    };



    const handleEmailAuth = async () => {
        if (!email.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            let result;
            if (mode === "login") {
                result = await signInWithEmailAndPassword(auth, email, password);
            } else {
                result = await createUserWithEmailAndPassword(auth, email, password);
            }
            console.log("Email User:", result.user);
            alert(`${mode === "login" ? "Logged in" : "Signed up"} with Email!`);
        } catch (error) {
            console.error("Email Auth Error:", error.message);
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
            alert("Please enter a valid phone number with country code");
            return;
        }

        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
            setConfirmationResult(confirmation);
            alert("OTP sent!");
        } catch (error) {
            console.error("Phone Auth Error:", error.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            console.log("Phone User:", result.user);
            alert("Phone verification successful!");
        } catch (error) {
            console.error("OTP Verification Error:", error.message);
        }
    };

    return (
        <div className="flex min-h-screen pt-20">
            {/* Left Image */}
            <div
                className="w-3/5 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.pexels.com/photos/967382/pexels-photo-967382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
                }}
            />

            {/* Right Form */}
            <div className="w-2/5 bg-gradient-to-br from-white via-blue-50 to-purple-100 p-10 flex flex-col justify-center space-y-6 shadow-xl rounded-l-3xl">
                {/* Toggle Login/Signup */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-5 py-2 rounded-xl font-semibold shadow ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`px-5 py-2 rounded-xl font-semibold shadow ${mode === "signup" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setMode("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800">
                    {mode === "login" ? "Welcome Back!" : "Join Us!"}
                </h2>

                {/* Email and Password */}
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleEmailAuth}
                        className={`w-full py-2 rounded-xl text-white font-semibold transition shadow-md ${
                            mode === "login"
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        <span className="material-icons align-middle mr-1">mail</span>
                        {mode === "login" ? "Login with Email" : "Sign Up with Email"}
                    </button>
                </div>

                {/* Google Auth */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-red-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-red-600 transition"
                >
                    <span className="material-icons">google</span>
                    {mode === "login" ? "Login with Google" : "Sign Up with Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 text-gray-400">
                    <hr className="w-full border-gray-300" />
                    or
                    <hr className="w-full border-gray-300" />
                </div>

                {/* Phone Input */}
                <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button
                    onClick={handleSendOTP}
                    className="w-full bg-green-500 text-white py-2 rounded-xl shadow hover:bg-green-600 transition"
                >
                    <span className="material-icons align-middle mr-1">phone</span>
                    Send OTP
                </button>

                {/* OTP Section */}
                {confirmationResult && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleVerifyOTP}
                            className="w-full bg-purple-500 text-white py-2 rounded-xl shadow hover:bg-purple-600 transition"
                        >
                            <span className="material-icons align-middle mr-1">verified</span>
                            Verify OTP
                        </button>
                    </>
                )}

                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
};

export default Login;
