import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";

const Authenticated = ({ user }) => {
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Iluminación"); // Valor predeterminado
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event) => {
        event.preventDefault();
        setUploading(true);

        try {
            if (!file) throw new Error("No file selected");

            // Crear un nombre de archivo único
            const fileName = `${Date.now()}-${file.name}`;

                const { data, error } = await supabase.storage
                .from("productosImg")
                .upload(`img/${fileName}`, file);

            if (error) throw error;

            // Obtener la URL pública de la imagen
            const { data: publicUrlData } = supabase.storage
                .from("productosImg")
                .getPublicUrl(data.path);

            const imageUrl = publicUrlData.publicUrl;

            // Insertar los datos del producto en la tabla 'productos'
            const { error: dbError } = await supabase
                .from("productos")
                .insert([
                    { nombre, codigo, precio, descripcion, categoria, url: imageUrl },
                ]);

            if (dbError) throw dbError;

            alert("Producto subido exitosamente!");

            // Limpiar el formulario después de la subida
            setNombre("");
            setCodigo("");
            setPrecio("");
            setDescripcion("");
            setCategoria("Iluminación"); // Restablecer categoría a valor predeterminado
            setFile(null);
        } catch (error) {
            console.error("Error uploading file:", error.message);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1>Bienvenido, {user.email}</h1>
            <form onSubmit={handleUpload}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Código:</label>
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Categoría:</label>
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="Iluminación">Iluminación</option>
                        <option value="Jardín">Jardín</option>
                        <option value="Eléctrico">Eléctrico</option>
                    </select>
                </div>
                <div>
                    <label>Imagen del Producto:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" disabled={uploading}>
                    {uploading ? "Subiendo..." : "Subir Producto"}
                </button>
            </form>
        </div>
    );
};

export default Authenticated;
