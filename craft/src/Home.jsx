import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, ArrowRight, Truck, Shield, RefreshCw, ChevronRight, Instagram, Facebook, Twitter, Heart, Eye, Clock, Check, Package, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const heroRef = useRef(null);
    const [wishlist, setWishlist] = useState({});

    // Animation for scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                    }
                });
            },
            {threshold: 0.1}
        );

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Fetch products
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch Error:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);

                // Fallback sample data
                setProducts([
                    {
                        id: 1,
                        name: "Handcrafted Wooden Bowl",
                        description: "Beautifully carved wooden bowl made from sustainable teak wood, perfect for serving or decoration.",
                        price: 1299,
                        category: "home decor",
                        rating: 4.9,
                        imageUrl: "/api/placeholder/400/400?text=Wood+Bowl"
                    },
                    {
                        id: 2,
                        name: "Embroidered Cotton Kurta",
                        description: "Hand-embroidered kurta made from organic cotton with traditional designs.",
                        price: 1899,
                        category: "clothing",
                        rating: 4.7,
                        imageUrl: "/api/placeholder/400/400?text=Cotton+Kurta"
                    },
                    {
                        id: 3,
                        name: "Silver Filigree Earrings",
                        description: "Exquisite silver earrings featuring traditional filigree work by master craftspeople.",
                        price: 2499,
                        category: "accessories",
                        rating: 5.0,
                        imageUrl: "/api/placeholder/400/400?text=Silver+Earrings"
                    },
                    {
                        id: 4,
                        name: "Brass Table Lamp",
                        description: "Handcrafted brass table lamp with intricate cutwork that creates beautiful light patterns.",
                        price: 3299,
                        category: "home decor",
                        rating: 4.8,
                        imageUrl: "/api/placeholder/400/400?text=Brass+Lamp"
                    },
                    {
                        id: 5,
                        name: "Smart Speaker",
                        description: "Voice-controlled smart speaker with premium sound quality and artisanal bamboo housing.",
                        price: 4999,
                        category: "electronics",
                        rating: 4.6,
                        imageUrl: "/api/placeholder/400/400?text=Smart+Speaker"
                    },
                    {
                        id: 6,
                        name: "Hand-woven Silk Scarf",
                        description: "Luxurious silk scarf featuring traditional ikat patterns woven by skilled artisans.",
                        price: 1799,
                        category: "accessories",
                        rating: 4.9,
                        imageUrl: "/api/placeholder/400/400?text=Silk+Scarf"
                    },
                    {
                        id: 7,
                        name: "Ceramic Tea Set",
                        description: "Traditional blue pottery tea set with hand-painted designs, includes teapot and 4 cups.",
                        price: 2899,
                        category: "home decor",
                        rating: 4.7,
                        imageUrl: "/api/placeholder/400/400?text=Tea+Set"
                    },
                    {
                        id: 8,
                        name: "Leather Messenger Bag",
                        description: "Handcrafted genuine leather messenger bag with traditional tanning techniques.",
                        price: 3999,
                        category: "accessories",
                        rating: 4.8,
                        imageUrl: "/api/placeholder/400/400?text=Leather+Bag"
                    }
                ]);
            });
    }, []);

    // Toggle wishlist item
    const toggleWishlist = (productId) => {
        setWishlist(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Priya Sharma",
            role: "Fashion Enthusiast",
            comment: "The quality of products exceeded my expectations. Fast delivery and excellent customer service!",
            avatar: "/api/placeholder/50/50"
        },
        {
            id: 2,
            name: "Rahul Verma",
            role: "Regular Customer",
            comment: "I've been shopping here for years and have never been disappointed. Their collection is always on trend.",
            avatar: "/api/placeholder/50/50"
        },
        {
            id: 3,
            name: "Ananya Patel",
            role: "Interior Designer",
            comment: "Their home decor items are unique and help me create stunning spaces for my clients.",
            avatar: "/api/placeholder/50/50"
        }
    ];

    // Handle newsletter subscription
    const handleSubscribe = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
    };

    return (
        <div className="font-sans bg-white overflow-x-hidden">
            {/* Navigation */}

            {/* Hero Section */}
            <div ref={heroRef} className="relative h-screen bg-cover bg-center flex items-center justify-center"
                 style={{backgroundImage: "url('https://images.pexels.com/photos/2836955/pexels-photo-2836955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}>

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

                <div className="z-10 text-center text-white p-8 max-w-4xl mx-4">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Discover the Art of <span className="text-orange-400">Craftsmanship</span>
                    </h1>
                    <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                        Curated collection of premium products that blend tradition with contemporary design.
                        Each piece tells a story of artisan excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/products"
                            className="scroll-smooth px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-full transition transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                            Explore Collection <ChevronRight size={20} className="ml-2"/>
                        </a>
                        <button
                            className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-medium rounded-full transition">
                            Watch Crafting Story
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
                    <a href="#products" className="text-white p-2 rounded-full border border-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12l7 7 7-7"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Products */}
            <section id="products" className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Collection</h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
                        Each product is carefully selected for quality, uniqueness, and craftsmanship.
                        Discover pieces that bring beauty to your everyday life.
                    </p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <div key={product.id}
                                         className="reveal bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 group">
                                        <div className="relative overflow-hidden h-72">
                                            {/* Product badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span
                                                    className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    New
                                                </span>
                                            </div>

                                            {/* Product image */}
                                            <img
                                                src={product.image || "/api/placeholder/400/400"}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Quick action buttons */}
                                            <div className="absolute right-4 top-4 flex flex-col gap-2">
                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className={`p-2 rounded-full ${wishlist[product.id] ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} shadow-md hover:scale-110 transition-all`}
                                                >
                                                    <Heart size={16}
                                                           className={wishlist[product.id] ? 'fill-white' : ''}/>
                                                </button>
                                                <button
                                                    className="p-2 rounded-full bg-white/90 text-gray-700 shadow-md hover:scale-110 transition-all">
                                                    <Eye size={16}/>
                                                </button>
                                            </div>

                                            {/* Add to cart button that appears on hover */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <Link to="/products">
                                                <button
                                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition flex items-center justify-center">
                                                    <ShoppingCart size={16} className="mr-2"/> Explore
                                                </button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-center mb-2">
                                                <span
                                                    className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                                                <div className="flex items-center">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400"/>
                                                    <span
                                                        className="text-xs font-medium text-gray-600 ml-1">{product.rating || "4.8"}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-orange-500 transition">{product.name}</h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                                            <div className="flex justify-between items-center">


                                                <div className="text-xs text-green-600 flex items-center">
                                                    <Clock size={12} className="mr-1"/>
                                                    <span>Fast Delivery</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">No products found.</p>
                            )}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/products">
                            <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition inline-flex items-center shadow-md">
                                View All Products <ArrowRight size={16} className="ml-2" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Banner */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <img src="/api/placeholder/600/400" alt="Feature product" className="rounded-lg shadow-2xl"/>
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                        <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">New Arrival</span>
                        <h2 className="text-4xl font-bold mb-6">Handcrafted Excellence</h2>
                        <p className="text-lg text-white/90 mb-8">
                            Our signature collection features pieces handcrafted by skilled artisans using traditional
                            techniques passed down through generations. Each item is a work of art designed to last a
                            lifetime.
                        </p>
                        <button
                            className="px-8 py-3 bg-white text-orange-600 font-medium rounded-full hover:bg-orange-50 transition transform hover:scale-105 shadow-lg">
                            Discover the Collection
                        </button>
                    </div>
                </div>
            </section>

            {/* Enhanced Why Choose Us */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium">Our Promise</span>
                        <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-4">The ArtisanBazaar Experience</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're not just an online store - we're a bridge between traditional craftsmanship and modern
                            living.
                            Here's what makes shopping with us special.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Card 1 */}
                        <div
                            className="reveal bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition duration-300 hover:bg-orange-50">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <Truck className="text-orange-600" size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Seamless Delivery</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Free express shipping on orders over ₹999</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Real-time order tracking</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Carbon-neutral delivery options</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <a href="#"
                                   className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                                    Learn more about shipping <ChevronRight size={16} className="ml-1"/>
                                </a>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="reveal bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition duration-300 hover:bg-orange-50">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <Package className="text-orange-600" size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Artisan Support</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Fair trade practices with transparent pricing</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Direct support to 2000+ artisans across India</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">5% of profits fund artisan welfare programs</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <a href="#"
                                   className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                                    Meet our artisans <ChevronRight size={16} className="ml-1"/>
                                </a>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div
                            className="reveal bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition duration-300 hover:bg-orange-50">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <CreditCard className="text-orange-600" size={28}/>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Worry-Free Shopping</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">15-day no-questions-asked returns</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Secure payment with 3D authentication</span>
                                </li>
                                <li className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                    <span className="text-gray-600">Quality guarantee on all products</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <a href="#"
                                   className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                                    View our policies <ChevronRight size={16} className="ml-1"/>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center p-1 bg-gray-100 rounded-full">
                            <div
                                className="bg-orange-100 text-orange-600 rounded-full px-4 py-2 text-sm font-medium">4.8/5
                            </div>
                            <div className="px-4 text-gray-700 font-medium">Rated excellent by 10,000+ happy customers
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
                        Don't just take our word for it. Here's what our customers have to say about their experience
                        with us.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id}
                                 className="reveal bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400 mr-1"/>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Community</h2>
                    <p className="text-gray-600 mb-8">
                        Subscribe to our newsletter for exclusive offers, new arrivals, and artisan stories.
                    </p>
                    <form onSubmit={handleSubscribe}
                          className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-5 py-3 rounded-full w-full text-gray-800 shadow-md outline-none focus:ring-2 focus:ring-orange-300"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
export default Home;