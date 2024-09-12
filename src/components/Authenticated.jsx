import React, { useState, useEffect } from "react";
import { supabase } from "../auth/supabaseClient";

const Authenticated = ({ user }) => {
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Iluminación"); // Valor predeterminado
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productos, setProductos] = useState([]);
    const [editingId, setEditingId] = useState(null); // Para editar productos

    // Obtener productos al cargar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) {
            console.error("Error fetching productos:", error.message);
        } else {
            setProductos(data);
            console.log(productos);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setUploading(true);

        try {
            if (!file) throw new Error("No file selected");

            // Crear un nombre de archivo único y limpio
            const cleanName = cleanFileName(file.name);
            const fileName = `${Date.now()}-${cleanName}`;

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
            fetchProductos(); // Actualizar lista de productos

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

    // Función para limpiar el nombre del archivo
    const cleanFileName = (fileName) => {
        return fileName
            .toLowerCase() // Convertir a minúsculas
            .replace(/\s+/g, "-") // Reemplazar espacios por guiones
            .replace(/[^a-z0-9.-]/g, ""); // Eliminar caracteres no permitidos excepto letras, números, puntos y guiones
    };

    // Eliminar producto
    const handleDelete = async (producto) => {

        // Mostrar alerta de confirmación
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (!confirmed) {
            return; // Si el usuario selecciona "Cancelar", no hacer nada
        }

        const { error: deleteError } = await supabase
            .from("productos")
            .delete()
            .eq("id", producto.id);

        if (deleteError) {
            console.error("Error deleting product:", deleteError.message);
            return;
        }

        // Eliminar imagen del bucket
        const { error: deleteFileError } = await supabase.storage
            .from("productosImg")
            .remove([`img/${producto.url.split("/").pop()}`]);

        if (deleteFileError) {
            console.error("Error deleting file:", deleteFileError.message);
        } else {
            alert("Producto eliminado correctamente!");
            fetchProductos(); // Actualizar lista de productos
        }
    };

    // Iniciar edición
    const handleEdit = (producto) => {
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setDescripcion(producto.descripcion);
        setEditingId(producto.id);
    };

    // Guardar edición
    const handleSaveEdit = async () => {
        const { error } = await supabase
            .from("productos")
            .update({
                nombre,
                precio,
                descripcion,
            })
            .eq("id", editingId);

        if (error) {
            console.error("Error updating product:", error.message);
        } else {
            alert("Producto actualizado correctamente!");
            fetchProductos(); // Actualizar lista de productos
            // Limpiar el estado de edición
            setNombre("");
            setPrecio("");
            setDescripcion("");
            setEditingId(null);
        }
    };

    return (
        <div>
            <h1 className="mb-4">Bienvenido, {user.email}</h1>
            <form onSubmit={handleUpload}>
                {/* Formulario de subida */}
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

            {/* Tabla de productos */}
            <h2>Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Código</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.nombre}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.codigo}</td>
                            <td>
                                <a
                                    href={producto.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver Imagen
                                </a>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(producto)}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(producto)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Formulario de edición */}
            {editingId && (
                <div>
                    <h3>Editando Producto</h3>
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
                    <button onClick={handleSaveEdit}>Guardar Cambios</button>
                </div>
            )}
        </div>
    );
};

export default Authenticated;
