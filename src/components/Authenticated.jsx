import React, { useState, useEffect } from "react";
import { supabase } from "../auth/supabaseClient";

const Authenticated = ({ user }) => {
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Iluminación");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [productos, setProductos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        const { data, error } = await supabase.from("productos").select("*");
        if (error) {
            console.error("Error fetching productos:", error.message);
        } else {
            setProductos(data);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setUploading(true);

        try {
            if (!file) throw new Error("No file selected");

            const cleanName = cleanFileName(file.name);
            const fileName = `${Date.now()}-${cleanName}`;

            const { data, error } = await supabase.storage
                .from("productosImg")
                .upload(`img/${fileName}`, file);

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from("productosImg")
                .getPublicUrl(data.path);

            const imageUrl = publicUrlData.publicUrl;

            const { error: dbError } = await supabase
                .from("productos")
                .insert([
                    { nombre, codigo, precio, descripcion, categoria, url: imageUrl },
                ]);

            if (dbError) throw dbError;

            alert("Producto subido exitosamente!");
            fetchProductos();

            setNombre("");
            setCodigo("");
            setPrecio("");
            setDescripcion("");
            setCategoria("Iluminación");
            setFile(null);
        } catch (error) {
            console.error("Error uploading file:", error.message);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const cleanFileName = (fileName) => {
        return fileName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9.-]/g, "");
    };

    const handleDelete = async (producto) => {
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (!confirmed) return;

        const { error: deleteError } = await supabase
            .from("productos")
            .delete()
            .eq("id", producto.id);

        if (deleteError) {
            console.error("Error deleting product:", deleteError.message);
            return;
        }

        const { error: deleteFileError } = await supabase.storage
            .from("productosImg")
            .remove([`img/${producto.url.split("/").pop()}`]);

        if (deleteFileError) {
            console.error("Error deleting file:", deleteFileError.message);
        } else {
            alert("Producto eliminado correctamente!");
            fetchProductos();
        }
    };

    const handleEdit = (producto) => {
        setNombre(producto.nombre);
        setCodigo(producto.codigo); // Agregar esto para que el código se llene al editar
        setPrecio(producto.precio);
        setDescripcion(producto.descripcion);
        setCategoria(producto.categoria); // Asegurarse también de cargar la categoría
        setEditingId(producto.id);
    };

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
            fetchProductos();
            setNombre("");
            setPrecio("");
            setDescripcion("");
            setEditingId(null);
        }
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full p-6 m-6">
            <h1 className="text-2xl font-semibold mb-6">Bienvenido, {user.email}</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Editar Producto" : "Agregar Producto"}
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block font-medium">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="border rounded-md w-full px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Código:</label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            className="border rounded-md w-full px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Precio:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="border rounded-md w-full px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Descripción:</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="border rounded-md w-full px-3 py-2"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-medium">Categoría:</label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="border rounded-md w-full px-3 py-2"
                            required // Asegúrate de que esto esté aquí para requerir la selección
                        >
                            <option value="">
                                Selecciona una categoría
                            </option>{" "}
                            {/* Opción por defecto */}
                            <option value="baños">Baños</option>
                            <option value="electrico">Eléctrico</option>
                            <option value="ferreteria">Ferretería</option>
                            <option value="iluminacion">Iluminación</option>
                            <option value="jardin">Jardín</option>
                            <option value="cocina">Cocina</option>
                            <option value="construccion">
                                Materiales de construcción
                            </option>
                            <option value="estantes">Organizadores y estantes</option>
                            <option value="plomeria">Plomería</option>
                            <option value="seguridad">Seguridad</option>
                            <option value="ventilacion">Ventilación</option>
                            <option value="albercas">Albercas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Imagen del Producto:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="border rounded-md w-full px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                    >
                        {uploading ? "Subiendo..." : "Subir Producto"}
                    </button>
                </form>
            </div>

            {/* Buscador */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar productos por nombre..."
                    className="border rounded-md w-full px-3 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabla de productos */}
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Precio</th>
                        <th className="px-4 py-2">Categoría</th>
                        <th className="px-4 py-2">Imagen</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProductos.map((producto) => (
                        <tr key={producto.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{producto.nombre}</td>
                            <td className="border px-4 py-2">${producto.precio}</td>
                            <td className="border px-4 py-2">{producto.categoria}</td>
                            <td className="border px-4 py-2">
                                <img
                                    src={producto.url}
                                    alt={producto.nombre}
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                            </td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(producto)}
                                    className="bg-yellow-400 text-white rounded-md px-2 py-1 hover:bg-yellow-500"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(producto)}
                                    className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Authenticated;
