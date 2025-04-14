import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const currentYear = new Date().getFullYear();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter subscription logic here
        alert(`Thank you for subscribing with ${email}!`);
        setEmail('');
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Newsletter Section */}
                <div className="bg-gray-800 rounded-lg p-8 mb-12 shadow-lg transform -translate-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0 md:w-1/2">
                            <h3 className="text-2xl font-bold text-white mb-2">Join our newsletter</h3>
                            <p className="text-gray-400">Stay updated with new Crafto products and exclusive offers.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="flex-grow px-4 py-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-md transition flex items-center justify-center"
                            >
                                Subscribe
                                <ArrowRight size={16} className="ml-2" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="text-orange-500 mr-2">
                                <Heart size={22} fill="#f97316" />
                            </span>
                            <h3 className="text-2xl font-bold text-white">Crafto</h3>
                        </div>
                        <p className="text-gray-400 mb-6">Connecting artisans with appreciative customers since 2018. Supporting traditional crafts and sustainable practices.</p>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Facebook" className="bg-gray-800 hover:bg-orange-500 p-2 rounded-full text-gray-400 hover:text-white transition-all duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="bg-gray-800 hover:bg-orange-500 p-2 rounded-full text-gray-400 hover:text-white transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="bg-gray-800 hover:bg-orange-500 p-2 rounded-full text-gray-400 hover:text-white transition-all duration-300">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 border-l-2 border-orange-500 pl-3">Shop Collections</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />All Products
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />New Arrivals
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Best Sellers
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Hand-woven Textiles
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Pottery & Ceramics
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Special Offers
                            </a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 border-l-2 border-orange-500 pl-3">Customer Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Frequently Asked Questions
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Shipping & Delivery
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Returns & Exchanges
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Payment Methods
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Gift Cards
                            </a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center">
                                <ArrowRight size={14} className="mr-2 text-orange-500" />Track Your Order
                            </a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 border-l-2 border-orange-500 pl-3">Contact Information</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-3 mt-1 text-orange-500 flex-shrink-0" />
                                <span className="text-gray-400">123 Artisan Street, Crafters' Lane, Bangalore 560001, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-3 text-orange-500 flex-shrink-0" />
                                <a href="tel:+919876543210" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-3 text-orange-500 flex-shrink-0" />
                                <a href="mailto:hello@artisanbazaar.com" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">hello@artisanbazaar.com</a>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <h5 className="text-white font-medium mb-2">Business Hours:</h5>
                            <p className="text-gray-400">Monday - Friday: 10:00 AM - 7:00 PM</p>
                            <p className="text-gray-400">Weekends: 11:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="py-6 border-t border-gray-800 mb-8">
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-800 p-3 rounded-full mb-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 text-center">Secure<br />Payments</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-800 p-3 rounded-full mb-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 8L5 8" />
                                    <rect x="3" y="4" width="18" height="8" rx="1" />
                                    <path d="M5 16l14 0" />
                                    <rect x="3" y="12" width="18" height="8" rx="1" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 text-center">Handcrafted<br />Quality</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-800 p-3 rounded-full mb-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 16c1.2-1.2 2-2.7 2-4.5 0-3.6-2.9-6.5-6.5-6.5S5 7.9 5 11.5c0 .4 0 .7.1 1.1" />
                                    <path d="M7 19.2c1.3.2 2.6.3 4 .3 2.8 0 5.6-.5 8-1.5" />
                                    <path d="M9.4 9.4 5.5 19M9.5 9.5l4.5 1.5" />
                                    <path d="M9.5 9.5c.3-.9 1.1-1.5 2-1.5" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 text-center">Worldwide<br />Shipping</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-800 p-3 rounded-full mb-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
                                    <path d="M12 18v-2" />
                                    <path d="M12 8v4" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 text-center">24/7<br />Support</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 mb-4 md:mb-0">© {currentYear} ArtisanBazaar. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-300">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-300">Accessibility</a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-300">Sitemap</a>
                    </div>
                </div>

                {/* Back to top button - appears on scroll */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                        className="bg-gray-800 hover:bg-orange-500 text-white p-3 rounded-full transition-all duration-300"
                        aria-label="Back to top"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;