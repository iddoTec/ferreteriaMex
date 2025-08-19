import React, { useState } from "react";
import Login from "./Login";
import Authenticated from "./Authenticated";

const AuthPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ email: "admin" }); // Puedes cambiar el email si lo deseas

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return isAuthenticated ? <Authenticated user={user} /> : <Login onLogin={handleLogin} />;
};

export default AuthPage;
