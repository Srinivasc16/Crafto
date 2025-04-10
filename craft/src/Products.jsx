import { useState, useEffect } from "react";
import { ShoppingCart, ExternalLink, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);     // Store products
    const [cartMessage, setCartMessage] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);     // Loading state
    const [error, setError] = useState(null);         // Error handling
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/products", {
                    method: "GET",
                    mode: "cors",  // Ensure CORS mode
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"  // For authentication
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);  // ✅ Store fetched products in state
                setLoading(false);   // ✅ Stop loading
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleClick = (productId) => {
        console.log("Product clicked:", productId);
        navigate(`/products/${productId}`);
    };

    const toggleFavorite = (e, productId) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Loading and Error Display
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-25 my-12 p-8 bg-white shadow-xl rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <span className="inline-block w-2 h-8 bg-orange-500 mr-3 rounded"></span>
                    Our Products
                </h1>

                <div className="flex gap-4">
                    <div className="h-10 px-4 bg-gray-100 rounded-lg flex items-center text-gray-500 text-sm">
                        {products.length} Products Available
                    </div>
                </div>
            </div>

            {cartMessage && (
                <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded shadow-sm">
                    <p className="font-medium">{cartMessage}</p>
                </div>
            )}

            {products.length === 0 ? (
                <div className="p-16 text-center bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">No products available</p>
                    <p className="text-gray-400">Check back later for our latest offerings</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative overflow-hidden rounded-xl shadow-lg h-80 cursor-pointer"
                            onClick={() => handleClick(product.id)}
                        >
                            {/* Background image with hover effect */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${product.image})` }}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"/>

                            {/* Content container */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Favorite button */}
                                <div className="self-end">
                                    <button
                                        onClick={(e) => toggleFavorite(e, product.id)}
                                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            favorites.includes(product.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                    >
                                        <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                                    </button>
                                </div>

                                {/* Main product info */}
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {product.name}
                                    </h2>
                                    <div className="bg-green-500 text-white font-semibold py-1 px-3 rounded-lg inline-block text-sm mb-4">
                                        {product.types} Available
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 py-3 bg-white/90 text-gray-800 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0 group-hover:scale-110" />
                                                <span>Explore Product</span>
                                            </span>
                                            <span className="absolute inset-0 w-full h-full bg-orange-500 transform transition-transform duration-300 -translate-x-full group-hover:translate-x-0"></span>
                                        </button>

                                        <button className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center hover:bg-white hover:text-orange-500 transition-all duration-300">
                                            <ExternalLink className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
