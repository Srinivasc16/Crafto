import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, X, Check, ArrowLeft, Clock, MapPin, Users } from "lucide-react";

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const navigate = useNavigate();

    const handleRegisterNow = () => {
        navigate("/workshop-registration", { state: { workshop: selectedWorkshop } });
    };

    const handleBack = () => {
        navigate("/");
    };

    useEffect(() => {
        // Fetch workshops from the backend
        fetch(`http://localhost:8081/api/workshops`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch workshops.");
                }
                return response.json();
            })
            .then((data) => {
                setWorkshops(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching workshops:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="max-w-6xl mx-auto mt-20 mb-20 px-4 sm:px-6">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <button onClick={handleBack} className="flex items-center hover:text-orange-500 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span>Home</span>
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">Workshops</span>
            </nav>

            {/* Main content card */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Upcoming Workshops
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-medium">
                                {workshops.length} {workshops.length === 1 ? "Workshop" : "Workshops"}
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
                {!loading && workshops.length === 0 && !error ? (
                    <div className="text-center py-16 px-6">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No workshops available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We don't have any upcoming workshops scheduled at this time. Please check back later for new events.
                        </p>
                        <button
                            onClick={handleBack}
                            className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300"
                        >
                            Return to Home
                        </button>
                    </div>
                ) : (
                    <div className="p-6 sm:p-8">
                        {/* Grid of workshop cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workshops.map((workshop) => (
                                <div
                                    key={workshop.id}
                                    className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={workshop.image}
                                            alt={workshop.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {/* Button now stays within card bounds */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => setSelectedWorkshop(workshop)}
                                                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => setSelectedWorkshop(workshop)}
                                    >
                                        <div className="flex items-center text-orange-600 text-sm mb-2">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{formatDate(workshop.date)}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors duration-200">
                                            {workshop.title}
                                        </h3>
                                        <div className="flex items-center text-gray-600 text-sm mt-2">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{workshop.location}</span>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-orange-600 font-bold">₹{workshop.price.toLocaleString()}</span>
                                            {workshop.seatsAvailable > 0 ? (
                                                <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                                                    {workshop.seatsAvailable} seats left
                                                </span>
                                            ) : (
                                                <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                                    Sold Out
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Workshop Detail Modal - Fixed to not go outside screen */}
            {selectedWorkshop && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedWorkshop(null);
                    }}
                >
                    {/* Added max-height and overflow to prevent content from overflowing */}
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100 my-8"
                    >
                        <div className="relative">
                            <img
                                src={selectedWorkshop.image}
                                alt={selectedWorkshop.title}
                                className="w-full h-64 object-cover"
                            />
                            <button
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors duration-200"
                                onClick={() => setSelectedWorkshop(null)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-6">
                                {selectedWorkshop.featured && (
                                    <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                                        FEATURED
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white">{selectedWorkshop.title}</h3>
                                <div className="flex items-center text-white/80 mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{formatDate(selectedWorkshop.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-orange-600 font-bold text-2xl">₹{selectedWorkshop.price.toLocaleString()}</p>
                                {selectedWorkshop.seatsAvailable > 0 ? (
                                    <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                        <Check className="h-3 w-3 mr-1" />
                                        {selectedWorkshop.seatsAvailable} seats available
                                    </span>
                                ) : (
                                    <span className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                        <X className="h-3 w-3 mr-1" />
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            <div className="mb-6 space-y-4">
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Location</h4>
                                        <p className="text-gray-600">{selectedWorkshop.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Duration</h4>
                                        <p className="text-gray-600">{selectedWorkshop.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Users className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Instructor</h4>
                                        <p className="text-gray-600">{selectedWorkshop.instructor}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-3 text-gray-800">About This Workshop</h4>
                                <p className="text-gray-600">
                                    {selectedWorkshop.description}
                                </p>

                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold mb-2 text-gray-800">What You'll Learn</h4>
                                    <ul className="grid grid-cols-1 gap-2 text-sm">
                                        {selectedWorkshop.learningPoints && selectedWorkshop.learningPoints.map((point, index) => (
                                            <li key={index} className="flex items-center">
                                                <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-2">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Fixed position buttons at the bottom of modal */}
                            <div className="sticky bottom-0 left-0 right-0 bg-white pt-2">
                                <div className="flex gap-3">
                                    <button
                                        className={`flex-1 ${
                                            selectedWorkshop.seatsAvailable > 0
                                                ? "bg-orange-500 hover:bg-orange-600"
                                                : "bg-gray-300 cursor-not-allowed"
                                        } text-white font-medium px-4 py-3 rounded-lg transition-all duration-300 ${
                                            selectedWorkshop.seatsAvailable > 0 ? "hover:shadow-lg" : ""
                                        }`}
                                        onClick={selectedWorkshop.seatsAvailable > 0 ? handleRegisterNow : undefined}
                                        disabled={selectedWorkshop.seatsAvailable <= 0}
                                    >
                                        {selectedWorkshop.seatsAvailable > 0 ? "Register Now" : "Sold Out"}
                                    </button>
                                    <button
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-all duration-300"
                                        onClick={() => setSelectedWorkshop(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workshops;