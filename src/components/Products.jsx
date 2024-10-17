import React, { useState, useEffect } from "react";
import { supabase } from "../auth/supabaseClient"; // Asegúrate de que el path es correcto

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState("");

    // Primer useEffect: obtener la categoría desde la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoriaSeleccionada = params.get("categoria"); // Obtener el valor del parámetro "categoria"
        setCategoria(categoriaSeleccionada);
        console.log("la categoria es:", categoria); // Asignar el valor de la categoría
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

    if (loading) {
        return <p>Cargando productos...</p>;
    }


    return (
        <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <div
                            className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full max-w-xs mx-auto" // Cambié w-96 a w-full max-w-xs para mejor control en móviles
                            key={producto.id}
                        >
                            {/* Imagen del producto */}
                            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-64"> {/* Ajusté la altura */}
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
                                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                                    {producto.descripcion.length > 90
                                        ? producto.descripcion.substring(0, 90) + "..."
                                        : producto.descripcion}
                                </p>
                            </div>
    
                            {/* Botón "Agregar al carrito" */}
                            <a href="https://www.google.com" className="p-6 pt-0">
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
                    <p className="text-xl text-gray-600 text-center">
                        No hay productos disponibles en esta categoría.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Products;
