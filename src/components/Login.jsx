import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";

const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { error } = await supabase.auth.signInWithOtp({ 
            email,
            options: {
                // set this to false if you do not want the user to be automatically signed up
                shouldCreateUser: false,
            },   
        });

        if (error) {
            setError("Error al enviar el enlace. Inténtalo de nuevo.");
        } else {
            setSuccess(
                "Enlace de inicio de sesión enviado. ¡Revisa tu correo electrónico!"
            );
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu email"
                    required
                />
                <button type="submit">Enviar Magic Link</button>
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    );
};

export default Login;
