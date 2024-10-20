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
                // Set this to false if you do not want the user to be automatically signed up
                shouldCreateUser: false,
            },
        });

        if (error) {
            setError("Error al enviar el enlace. Inténtalo de nuevo.");
            setSuccess(""); // Reset success message
        } else {
            setSuccess("Enlace de inicio de sesión enviado. ¡Revisa tu correo electrónico!");
            setError(""); // Reset error message
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu email"
                    required
                    className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
                >
                    Enviar Magic Link
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default Login;