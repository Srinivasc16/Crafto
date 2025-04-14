import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate, useParams} from "react-router-dom";

const ProfilePage = () => {
    const uid = localStorage.getItem("Userid");
    const { sections } = useParams();

    // Initialize the activeTab state with sections from the URL
    const [activeTab, setActiveTab] = useState(sections);

    useEffect(() => {
        // Update the activeTab state if the URL parameter changes
        setActiveTab(sections);
    }, [sections]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();
    // Profile state
    const [profile, setProfile] = useState({
        uid: uid,
        name: "",
        email: "",
        phone: "",
        bio: "",
        avatarUrl: ""
    });

    // Address state
    const [addresses, setAddresses] = useState([]);
    // Orders state - mock data
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Step 1: Get user from session
                const userRes = await fetch("http://localhost:8080/api/user", {
                    credentials: "include"
                });

                if (!userRes.ok) {
                    console.log("No active user session found.");
                    return;
                }

                const userData = await userRes.json();
                const uid = userData.uid;

                // Step 2: Fetch profile using UID
                const res = await fetch(`http://localhost:8080/api/profile/${uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(prev => ({
                        ...prev,
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        bio: data.details || "",
                        avatarUrl: data.avatarUrl || ""
                    }));
                } else {
                    console.log("Profile not found for UID:", uid);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };



    const fetchAddresses = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/address/${uid}`);
                if (res.ok) {
                    const data = await res.json();

                    // Convert response to UI-friendly format
                    const formatted = Array.isArray(data)
                        ? data
                        : [data]; // In case backend returns a single object

                    setAddresses(formatted.map((a, index) => ({
                        ...a,
                        id: index + 1,
                        type: "Home", // or something dynamic
                        zipcode: a.zip,
                        country: a.country || "",
                        isDefault: index === 0
                    })));
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddresses([]); // ensure clean fallback
            }
        };


        // Fetch orders by UID
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/orders/${uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data); // assuming array of orders
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchProfile();
        fetchAddresses();
        fetchOrders();
    }, [uid]);


    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (id, field, value) => {
        setAddresses(prev =>
            prev.map(address =>
                address.id === id ? { ...address, [field]: value } : address
            )
        );
    };

    const handleSetDefaultAddress = (id) => {
        setAddresses(prev =>
            prev.map(address => ({
                ...address,
                isDefault: address.id === id
            }))
        );
    };

    const handleAddAddress = () => {
        const newId = Math.max(...addresses.map(a => a.id)) + 1;
        setAddresses([...addresses, {
            id: newId,
            type: "Other",
            street: "",
            city: "",
            state: "",
            zip: "",
            isDefault: false
        }]);
    };

    const handleRemoveAddress = (id) => {
        // Don't remove if it's the only address or if it's the default
        if (addresses.length <= 1) return;

        const isDefaultBeingRemoved = addresses.find(a => a.id === id)?.isDefault;

        let newAddresses = addresses.filter(a => a.id !== id);

        // If we're removing the default address, make the first one the new default
        if (isDefaultBeingRemoved && newAddresses.length > 0) {
            newAddresses = newAddresses.map((address, index) => ({
                ...address,
                isDefault: index === 0
            }));
        }

        setAddresses(newAddresses);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // In a real app, you would upload this file to a server and get a URL back
            // Then update the profile with the new avatar URL
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaveLoading(true);
            await fetch("http://localhost:8080/api/user/google-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            });

            // If there was a new avatar uploaded, the preview would become the new avatarUrl
            if (avatarPreview) {
                setProfile(prev => ({ ...prev, avatarUrl: avatarPreview }));
                setAvatarPreview(null);
            }

            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleSaveAddresses = async () => {
        try {
            setSaveLoading(true);

            for (const address of addresses) {
                const addressToSend = {
                    uid, // ✅ make sure uid is included
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: address.zipcode,
                };

                const res = await fetch("http://localhost:8080/api/address/save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify([addressToSend])  // Wrap addressToSend in an array
                });

                if (!res.ok) {
                    throw new Error("Failed to save address");
                }
            }

            toast.success("Addresses saved successfully!");
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save addresses. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };
    const handleBrowseProducts = () => {
        navigate("/products"); // Navigate to the '/products' page
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mt-12 mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header with avatar and name */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-white/20 overflow-hidden border-4 border-white shadow-lg">
                                {(avatarPreview || profile.avatarUrl) ? (
                                    <img
                                        src={avatarPreview || profile.avatarUrl || "/api/placeholder/100/100"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 text-2xl font-bold">
                                        {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}
                            </div>
                            {activeTab === "profile" && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{profile.name || "Update Your Profile"}</h1>
                            <p className="text-white/80">{profile.email}</p>
                            {profile.phone && <p className="text-white/80">{profile.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b">
                    <nav className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === "addresses" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === "orders" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Order History
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleProfileChange}
                                        placeholder="Your full name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        placeholder="Your phone number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleProfileChange}
                                    placeholder="Tell us a bit about yourself"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saveLoading}
                                    className={`px-6 py-2 rounded-lg text-white font-medium ${saveLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} transition-colors shadow-md`}
                                >
                                    {saveLoading ? (
                                        <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                                    ) : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === "addresses" && (
                        <div className="space-y-8">
                            {addresses.length > 0 ? (
                                // Display existing addresses when available
                                addresses.map((address, index) => (
                                    <div key={address.id} className="border rounded-lg p-6 relative">
                                        {addresses.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveAddress(address.id)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}

                                        <div className="flex items-center mb-4">
                                            <input
                                                type="text"
                                                value={address.type}
                                                onChange={(e) => handleAddressChange(address.id, 'type', e.target.value)}
                                                className="font-medium text-lg border-b border-gray-300 pb-1 focus:outline-none focus:border-blue-500"
                                            />

                                            {address.isDefault ? (
                                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                            </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                    className="ml-3 text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    Set as default
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={address.street}
                                                    onChange={(e) => handleAddressChange(address.id, 'street', e.target.value)}
                                                    placeholder="Street address"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) => handleAddressChange(address.id, 'city', e.target.value)}
                                                    placeholder="City"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                                                <input
                                                    type="text"
                                                    value={address.state}
                                                    onChange={(e) => handleAddressChange(address.id, 'state', e.target.value)}
                                                    placeholder="State or province"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={address.zip}
                                                    onChange={(e) => handleAddressChange(address.id, 'zipcode', e.target.value)}
                                                    placeholder="ZIP or postal code"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Display prompt when no addresses are available
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first address.</p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Address
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Always show Add/Save buttons when addresses exist */}
                            {addresses.length > 0 && (
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                                    <button
                                        onClick={handleAddAddress}
                                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Address
                                    </button>

                                    <button
                                        onClick={handleSaveAddresses}
                                        disabled={saveLoading}
                                        className={`px-6 py-2 rounded-lg text-white font-medium ${saveLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} transition-colors shadow-md`}
                                    >
                                        {saveLoading ? (
                                            <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                                        ) : "Save Addresses"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div>
                            {orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                                                    <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                  order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                                      "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                                                    <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-medium">${item.price.toFixed(2)}</p>
                                                    </div>
                                                ))}

                                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                                    <span className="font-medium">Total</span>
                                                    <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                                    <p className="mt-1 text-gray-500">When you place orders, they will appear here.</p>
                                    <div className="mt-6">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            onClick={handleBrowseProducts}
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;