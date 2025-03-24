import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/logout", {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    // ✅ Clear session storage and navigate to login
                    sessionStorage.clear();
                    localStorage.clear();
                    navigate("/login");
                } else {
                    console.error("Failed to logout:", response.status);
                }
            } catch (error) {
                console.error("Error during logout:", error);
            }
        };

        logout();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="ml-4 text-lg text-gray-700">Logging out...</p>
        </div>
    );
};

export default Logout;
