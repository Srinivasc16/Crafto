const Home = () => {
    return (
        <div
            className="h-screen w-full flex items-center justify-end px-10 bg-cover bg-center relative overflow-hidden"
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1501349800519-48093d60bde0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGNyYWZ0fGVufDB8fDB8fHww')"}}>
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Content container aligned to the right */}
            <div className="w-1/2 flex flex-col justify-center items-start z-10 space-y-6 pr-8">
                <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                    Welcome to <span className="text-orange-500">Our Page</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-md">
                    Discover amazing products and enjoy seamless shopping experience.
                </p>
                <button
                    className="mt-6 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center">
                    Explore Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Home;