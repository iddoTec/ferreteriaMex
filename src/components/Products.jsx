import React, { useState, useEffect } from "react";
import { supabase } from "../auth/supabaseClient"; // Asegúrate de que el path es correcto

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el buscador
    const [expandedProductos, setExpandedProductos] = useState({}); // Estado para controlar el ver más/ver menos

    // Primer useEffect: obtener la categoría desde la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoriaSeleccionada = params.get("categoria"); // Obtener el valor del parámetro "categoria"
        setCategoria(categoriaSeleccionada);
    }, []);

    // Segundo useEffect: hacer la consulta a la base de datos cuando la categoría esté disponible
    useEffect(() => {
        const fetchProductosPorCategoria = async () => {
            if (!categoria) return; // Esperar a que haya un valor en "categoria"

            setLoading(true);
            const { data, error } = await supabase
                .from("productos") // Nombre de tu tabla en Supabase
                .select("*")
                .eq("categoria", categoria); // Filtrar productos por categoría

            if (error) {
                console.error("Error al obtener productos:", error);
            } else {
                setProductos(data);
            }
            setLoading(false);
        };

        fetchProductosPorCategoria();
    }, [categoria]); // Se ejecuta solo cuando "categoria" cambia

    // Función para manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para limpiar el campo de búsqueda
    const clearSearch = () => {
        setSearchTerm("");
    };

    // Función para controlar el botón de ver más/ver menos
    const toggleVerMas = (id) => {
        setExpandedProductos((prev) => ({
            ...prev,
            [id]: !prev[id], // Cambiar el estado de expansión para el producto específico
        }));
    };

    // Filtrar los productos según el término de búsqueda
    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <p className="mt-20 text-center">Cargando productos...</p>;
    }

    return (
        <div className="p-8">
            {productos.length > 0 && (
                <div className="mb-6 mt-8 sm:mt-0 relative w-full max-w-md mx-auto lg:mx-20">
                    <input
                        type="text"
                        placeholder="Buscar productos ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                    {/* Botón para limpiar el buscador */}
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                            &times; {/* Esto es una "X" */}
                        </button>
                    )}
                </div>
            )}

            {/* Lista de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProductos.length > 0 ? (
                    filteredProductos.map((producto) => (
                        <div
                            className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full max-w-xs mx-auto" 
                            key={producto.id}
                        >
                            {/* Imagen del producto */}
                            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-64">
                                <img
                                    src={producto.url}
                                    alt={producto.nombre}
                                    className="object-contain w-full h-full"
                                />
                            </div>

                            {/* Detalles del producto */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                                        {producto.nombre.length > 25
                                            ? producto.nombre.substring(0, 25) + "..."
                                            : producto.nombre}
                                    </p>
                                    <p className="block font-sans text-lg antialiased font-bold leading-relaxed text-red-600">
                                        ${producto.precio}
                                    </p>
                                </div>

                                {/* Descripción del producto con ver más/ver menos */}
                                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    {expandedProductos[producto.id]
                                        ? producto.descripcion // Mostrar toda la descripción si está expandido
                                        : producto.descripcion.length > 90
                                            ? producto.descripcion.substring(0, 90) + "..."
                                            : producto.descripcion}
                                </p>
                                {producto.descripcion.length <= 90 && (
                                        <br/>
                                    )}
                                {producto.descripcion.length <= 90 && (
                                        <br/>
                                    )}
                                
                                {/* Botón Ver más/Ver menos */}
                                {producto.descripcion.length > 90 && (
                                    <button
                                        className="text-blue-500 text-sm mt-2 focus:outline-none"
                                        onClick={() => toggleVerMas(producto.id)}
                                    >
                                        {expandedProductos[producto.id] ? "Ver menos" : "Ver más"}
                                    </button>
                                )}
                            </div>

                            <a
                                href="https://wa.me/523521458233?text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20algunos%20productos...%20"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-6 pt-0"
                            >
                                <button
                                    className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full hover:scale-105 focus:scale-105 active:scale-100"
                                    type="button"
                                >
                                    Comprar
                                </button>
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="text-xl text-gray-600 text-center mt-8">
                        No hay productos disponibles en esta categoría.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Products;