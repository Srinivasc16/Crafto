import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { uid } = useParams();

    const pathname = location.pathname;

// Show Navbar only on "/" or "/<something>" not in the hide list
    const isHomePage =
        pathname === "/" || pathname.startsWith("/home/");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem("username");
                const storedMail = localStorage.getItem("useremail");
                const storedUid = localStorage.getItem("userid");

                if (storedUid) {
                    const response = await axios.get(`http://localhost:8080/api/user/${storedUid}`);
                    setUser(response.data);
                    console.log(storedUid);
                } else if (storedUser) {
                    setUser({ name: storedUser, email: storedMail });
                    console.log(storedUser);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);


    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getTextColorClass = () => {
        if (isHomePage && !scrolled) return "text-white";
        return "text-gray-900";
    };

    const getLinkColorClass = () => {
        if (isHomePage && !scrolled) return "text-white hover:text-orange-200";
        return "text-gray-900 hover:text-orange-600";
    };

    const getLogoClass = () => {
        if (isHomePage && !scrolled) return "text-white group-hover:text-orange-200";
        return "text-gray-900 group-hover:text-orange-600";
    };

    const getNavBackgroundClass = () => {
        if (scrolled) return "bg-white shadow-md py-2";
        return "py-4 bg-transparent";
    };

    const handleSignOut = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("useremail");
        setUser(null);
        setUserMenuOpen(false);
        navigate("/");
    };

    let userid=localStorage.getItem("userid");
    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavBackgroundClass()}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                <span className="text-white text-lg font-bold">C</span>
                            </div>
                            <span className={`ml-3 font-bold text-xl transition-colors duration-200 ${getLogoClass()}`}>Crafto</span>
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex space-x-8">
                            {["Home", "Products", "Workshop", "Gallery"].map((item) => (
                                <a
                                    key={item}
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${getLinkColorClass()}`}
                                >
                                    {item}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center relative user-menu-container">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full hover:bg-orange-100 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {getUserInitials(user.name)}
                                    </div>
                                    <span className="text-gray-800 font-medium truncate max-w-xs">{user.name}</span>
                                </button>

                                {userMenuOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                                        </div>
                                        <a href={`/profile/${userid}`}
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Your
                                            Profile</a>
                                        <a href={`/address/${userid}`}
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Your
                                            Address</a>
                                        <a href={`/orders/${userid}`}
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Orders</a>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <button
                                    className={`px-6 py-2 ${isHomePage && !scrolled ? "bg-white text-orange-600" : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"} rounded-md font-medium text-sm hover:shadow transition-all duration-300`}>
                                    LOGIN
                                </button>
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md ${isHomePage && !scrolled ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-gray-100"} focus:outline-none transition duration-200`}
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {["Home", "Products", "Workshop", "Gallery"].map((item) => (
                            <a
                                key={item}
                                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-orange-50 hover:text-orange-600"
                            >
                                {item}
                            </a>
                        ))}
                        {!user && (
                            <Link to="/login">
                                <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium hover:from-orange-600 hover:to-orange-700">
                                    LOGIN
                                </button>
                            </Link>
                        )}
                    </div>

                    {user && (
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-5">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {getUserInitials(user.name)}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-orange-50">Your Profile</a>
                                <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-orange-50">Your Address</a>
                                <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-orange-50">Orders</a>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
