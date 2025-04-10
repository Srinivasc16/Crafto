import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">ArtisanBazaar</h3>
                        <p className="text-gray-400 mb-4">Connecting artisans with appreciative customers since 2018.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition">All Products</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">New Arrivals</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Best Sellers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Sale</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Help</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping & Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Store Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition">Payment Methods</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">hello@artisanbazaar.com</li>
                            <li className="text-gray-400">+91 98765 43210</li>
                            <li className="text-gray-400">123 Artisan Street, Bangalore 560001</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 mb-4 md:mb-0">© {new Date().getFullYear()} ArtisanBazaar. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;