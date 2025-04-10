import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/user", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    navigate("/");  // Redirect to home page on success
                } else {
                    navigate("/login");  // Redirect to login on failure
                }
            } catch (error) {
                console.error("OAuth callback failed", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    return <div>Loading...</div>;
};

export default OAuthCallback;
