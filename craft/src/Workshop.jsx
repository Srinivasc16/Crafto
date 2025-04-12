import { useState, useEffect } from "react";

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/workshops")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch workshops");
                }
                return response.json();
            })
            .then((data) => {
                setWorkshops(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const openWorkshopDetails = (workshop) => {
        setSelectedWorkshop(workshop);
    };

    const closeWorkshopDetails = () => {
        setSelectedWorkshop(null);
    };
    const handleBookNow = (workshopId) => {
        // Redirect to seat selection page with workshop ID
        router.push(`/seats/${workshopId}`);
    };
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    const featuredWorkshops = workshops.filter(workshop => workshop.featured);
    const regularWorkshops = workshops.filter(workshop => !workshop.featured);

    return (
        <div className="max-w-6xl mx-auto mt-25 rounded-2xl mb-5 border-2 border-black p-4 sm:p-6 lg:p-8">
            <h2 className="text-4xl font-bold text-center mb-2 text-orange-600">Creative Workshops</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Enhance your skills with our expert-led
                creative sessions</p>

            {featuredWorkshops.length > 0 && (
                <div className="mb-16">
                    <h3 className="text-2xl font-semibold mb-8 border-b border-orange-200 pb-3">Featured Workshops</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {featuredWorkshops.map((workshop) => (
                            <div
                                key={workshop.id}
                                className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative">
                                    <img
                                        src={workshop.image || "/api/placeholder/600/300"}
                                        alt={workshop.title}
                                        className="w-full h-64 object-cover object-center"
                                    />
                                    <div
                                        className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                                        Featured
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{workshop.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-5 w-5 mr-2 text-orange-500" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                            {formatDate(workshop.date)}
                                        </p>
                                        <p className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-5 w-5 mr-2 text-orange-500" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            {workshop.duration}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <p className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-5 w-5 mr-2 text-orange-500" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                            {workshop.location}
                                        </p>
                                        <p className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="h-5 w-5 mr-2 text-orange-500" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            {workshop.instructor}
                                        </p>
                                    </div>
                                    <p className="mt-4 text-gray-700 line-clamp-3 text-base">{workshop.description}</p>
                                    <div className="mt-6 flex justify-between items-center">
                                        <p className="text-2xl text-orange-600 font-bold">₹{workshop.costPerSeat.toLocaleString()}</p>
                                        <div>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        workshop.seatsAvailable > 5
                            ? 'bg-green-100 text-green-800'
                            : workshop.seatsAvailable > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                      {workshop.seatsAvailable > 0 ? `${workshop.seatsAvailable} seats left` : "Sold out"}
                    </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openWorkshopDetails(workshop)}
                                        className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-2xl font-semibold mb-8 border-b border-gray-200 pb-3">Available Workshops</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularWorkshops.map((workshop) => (
                        <div
                            key={workshop.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative">
                                <img
                                    src={workshop.image || "/api/placeholder/400/200"}
                                    alt={workshop.title}
                                    className="w-full h-52 object-cover object-center"
                                />
                                {workshop.seatsAvailable <= 3 && workshop.seatsAvailable > 0 && (
                                    <div
                                        className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                        Only {workshop.seatsAvailable} left!
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{workshop.title}</h3>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                    <p className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        {formatDate(workshop.date)}
                                    </p>
                                    <p className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        {workshop.location}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-lg text-orange-600 font-bold">₹{workshop.costPerSeat.toLocaleString()}</p>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        workshop.seatsAvailable > 5
                                            ? 'bg-green-100 text-green-800'
                                            : workshop.seatsAvailable > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                  {workshop.seatsAvailable > 0 ? `${workshop.seatsAvailable} seats` : "Sold out"}
                </span>
                                </div>
                                <button
                                    onClick={() => openWorkshopDetails(workshop)}
                                    className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2 rounded-lg transition-all duration-300 hover:border-gray-400"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedWorkshop && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
                    <div
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                        <div className="relative">
                            <img
                                src={selectedWorkshop.image || "/api/placeholder/800/400"}
                                alt={selectedWorkshop.title}
                                className="w-full h-72 object-cover object-center rounded-t-2xl"
                            />
                            <button
                                onClick={closeWorkshopDetails}
                                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            {selectedWorkshop.featured && (
                                <div
                                    className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                                    Featured
                                </div>
                            )}
                        </div>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedWorkshop.title}</h2>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-800 font-semibold">{formatDate(selectedWorkshop.date)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Duration</p>
                                    <p className="text-gray-800 font-semibold">{selectedWorkshop.duration}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                                    <p className="text-gray-800 font-semibold">{selectedWorkshop.location}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Instructor</p>
                                    <p className="text-gray-800 font-semibold">{selectedWorkshop.instructor}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">About this workshop</h3>
                                <p className="text-gray-700 leading-relaxed">{selectedWorkshop.description}</p>
                            </div>

                            {selectedWorkshop.learningPoints && selectedWorkshop.learningPoints.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">What you'll learn</h3>
                                    <ul className="space-y-3 bg-orange-50 p-4 rounded-lg">
                                        {selectedWorkshop.learningPoints.map((point, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span className="text-gray-800">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <div
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Price per seat</p>
                                        <p className="text-3xl font-bold text-orange-600">₹{selectedWorkshop.costPerSeat.toLocaleString()}</p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Availability</p>
                                        <p className={`text-lg font-semibold ${
                                            selectedWorkshop.seatsAvailable > 5
                                                ? 'text-green-600'
                                                : selectedWorkshop.seatsAvailable > 0
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                        }`}>
                                            {selectedWorkshop.seatsAvailable > 0
                                                ? `${selectedWorkshop.seatsAvailable} seats available`
                                                : "Sold out"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                                    <button
                                        onClick={closeWorkshopDetails}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-300"
                                    >
                                        Close
                                    </button>
                                    <button
                                        className={`px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                                            selectedWorkshop.seatsAvailable > 0
                                                ? 'bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg'
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`} onClick={() => handleBookNow(selectedWorkshop.id)}
                                        disabled={selectedWorkshop.seatsAvailable <= 0}
                                    >
                                        {selectedWorkshop.seatsAvailable > 0 ? 'Book Now' : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default Workshops;