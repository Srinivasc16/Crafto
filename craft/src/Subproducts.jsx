import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, X, Check, ArrowLeft, ChevronRight } from "lucide-react";

const SubProducts = () => {
    const { productId } = useParams();
    const [subProducts, setSubProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSubProduct, setSelectedSubProduct] = useState(null);
    const [mainProduct, setMainProduct] = useState(null);
    const navigate = useNavigate();

    const handleBuyNow = () => {
        navigate("/checkout", { state: { product: selectedSubProduct } });
    };

    const handleBack = () => {
        navigate(-1);
    };


    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${productId}`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch product details.");
                return response.json();
            })
            .then(data => {
                setMainProduct(data);
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });

        // Fetch subproducts
        fetch(`http://localhost:8080/api/products/${productId}/subproducts`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch subproducts.");
                }
                return response.json();
            })
            .then((data) => {
                setSubProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching subproducts:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [productId]);

    return (
        <div className="max-w-6xl mx-auto mt-20 mb-20 px-4 sm:px-6">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <button onClick={handleBack}  className="flex items-center hover:text-orange-500 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Products</span>
                </button>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-800 font-medium">
                    {mainProduct?.name || "Product Details"}
                </span>
            </nav>

            {/* Main content card */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {mainProduct?.name || "Products"}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-medium">
                                {subProducts.length} {subProducts.length === 1 ? "Item" : "Items"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="m-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <div className="flex items-center gap-2 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="font-bold">Error</p>
                        </div>
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && subProducts.length === 0 && !error ? (
                    <div className="text-center py-16 px-6">
                        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We don't have any variants of this product available at this time. Please check back later.
                        </p>
                        <button
                            onClick={handleBack}
                            className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300"
                        >
                            Return to Products
                        </button>
                    </div>
                ) : (
                    <div className="p-6 sm:p-8">
                        {/* Grid of product cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subProducts.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100"
                                    onClick={() => setSelectedSubProduct(sub)}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={sub.image}
                                            alt={sub.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors duration-200">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors duration-200">{sub.name}</h3>
                                        <p className="text-orange-600 font-bold mt-1">₹{sub.price.toLocaleString()}</p>
                                        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                                            {sub.description || "Premium quality product with excellent features."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Modal with orange theme */}
            {selectedSubProduct && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedSubProduct(null);
                    }}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
                    >
                        <div className="relative">
                            <img
                                src={selectedSubProduct.image}
                                alt={selectedSubProduct.name}
                                className="w-full h-64 object-cover"
                            />
                            <button
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors duration-200"
                                onClick={() => setSelectedSubProduct(null)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-6">
                                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">FEATURED</div>
                                <h3 className="text-2xl font-bold text-white">{selectedSubProduct.name}</h3>
                                <p className="text-white/80 mt-1">Premium Selection</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-orange-600 font-bold text-2xl">₹{selectedSubProduct.price.toLocaleString()}</p>
                                <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                    <Check className="h-3 w-3 mr-1" />
                                    In Stock
                                </span>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-3 text-gray-800">Product Details</h4>
                                <p className="text-gray-600">
                                    {selectedSubProduct.description ||
                                        "This premium product offers exceptional quality and performance. Perfect for those seeking reliability and style."}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-2">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        Premium Quality
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-2">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        Fast Delivery
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-2">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        1 Year Warranty
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-2">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        Easy Returns
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                                <button
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                                    onClick={() => setSelectedSubProduct(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubProducts;