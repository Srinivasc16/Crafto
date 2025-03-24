import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check for user authentication on page load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/user", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuOpen && !event.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const handleLogout = () => {
        window.location.href = "http://localhost:5173/logout";
        setUser(null);
    };

    // Generate user initials for avatar
    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled
                ? "bg-white py-2 shadow-md backdrop-blur-sm bg-white/90"
                : "py-4 bg-gradient-to-r from-white to-orange-50"
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                                <span className="text-white text-lg font-bold">C</span>
                            </div>
                            <span className="ml-3 text-gray-900 font-bold text-xl group-hover:text-orange-600 transition-colors duration-200">Crafto</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex space-x-8">
                            {["Home", "Products", "Workshop", "Gallery"].map((item) => (
                                <a
                                    key={item}
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                                >
                                    {item}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center relative user-menu-container">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full hover:bg-orange-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm">
                                        {getUserInitials(user.name)}
                                    </div>
                                    <span className="text-gray-800 font-medium truncate max-w-xs">{user.name}</span>
                                    <svg
                                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* User dropdown menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.email || user.name}</p>
                                        </div>
                                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Your Profile</a>
                                        <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Settings</a>
                                        <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Your Orders</a>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                            >
                                LOGIN
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        {user ? (
                            <div className="mr-2">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full text-white font-medium text-sm shadow-sm"
                                >
                                    {getUserInitials(user.name)}
                                </button>

                                {/* Mobile user dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                        </div>
                                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Profile</a>
                                        <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">Settings</a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <svg
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg rounded-b-lg mx-2 mt-2">
                    {["Home", "Products", "Workshop", "Gallery"].map((item) => (
                        <a
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200"
                        >
                            {item}
                        </a>
                    ))}
                    {user && !userMenuOpen && (
                        <div className="px-3 py-4 border-t border-gray-100 mt-2">
                            <div className="flex flex-col gap-3">
                                <div className="bg-orange-50 px-4 py-3 rounded-lg">
                                    <span className="text-gray-800 font-medium flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm mr-3">
                                            {getUserInitials(user.name)}
                                        </div>
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                    {!user && (
                        <div className="px-3 py-4 border-t border-gray-100 mt-2">
                            <button
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-sm"
                                onClick={() => navigate("/login")}
                            >
                                LOGIN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;