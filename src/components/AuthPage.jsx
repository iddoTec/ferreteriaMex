import React, { useEffect, useState } from "react";
import { supabase } from "../auth/supabaseClient";
import Login from "./Login";
import Authenticated from "./Authenticated";

const AuthPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };

        // Check authentication on component mount
        checkAuth();

        // Optionally, you might want to listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null);
        });

        // Clean up the subscription on component unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return user ? <Authenticated user={user} /> : <Login />;
};

export default AuthPage;
