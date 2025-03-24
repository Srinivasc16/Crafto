import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        fetch("http://localhost:8080/api/user", {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    // User is authenticated -> redirect to home
                    res.json().then((data) => {
                        setUser(data);
                        navigate("/");
                    });
                } else {
                    // User not authenticated -> show login form
                    setUser(null);
                }
            })
            .catch((error) => console.error("Error fetching user:", error))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    // Show login form only if the user is NOT authenticated
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white rounded-xl shadow-xl p-8 md:p-10 max-w-md w-full text-center m-4 border border-gray-100">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h1>
                <p className="text-gray-500 mb-8">Sign in to continue to your account</p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => handleLogin("google")}
                        className="bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-3 border border-gray-300 shadow-sm font-medium"
                    >
                        <img src="/api/placeholder/20/20"
                             alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <button
                        onClick={() => handleLogin("github")}
                        className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-black transition duration-300 flex items-center justify-center gap-3 shadow-sm font-medium"
                    >
                        <img src="/api/placeholder/20/20"
                             alt="GitHub" className="w-5 h-5" />
                        Continue with GitHub
                    </button>

                    <button
                        onClick={() => handleLogin("facebook")}
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-3 shadow-sm font-medium"
                    >
                        <img src="/api/placeholder/20/20"
                             alt="Facebook" className="w-5 h-5" />
                        Continue with Facebook
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    By continuing, you agree to our
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer"> Terms of Service</span> and
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer"> Privacy Policy</span>
                </div>
            </div>
        </div>
    );
};

export default Login;