import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setUser({ name: storedUser });
        }
    }, []);

    const login = (username) => {
        localStorage.setItem("username", username);
        setUser({ name: username });
    };

    const logout = () => {
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
