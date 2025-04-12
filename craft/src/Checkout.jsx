import {useLocation, useNavigate} from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, Smartphone, DollarSign, ShoppingBag, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios'; // Import axios for making HTTP requests

const Checkout = () => {
    const location = useLocation();
    const product = location.state?.product || null;
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isShippingOpen, setIsShippingOpen] = useState(true); // Open by default for better UX
    const [isPaymentOpen, setIsPaymentOpen] = useState(true); // Open by default for better UX
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state for submission
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address for editing
    const [editMode, setEditMode] = useState(false); // Flag to toggle edit mode
    const [formxData, setFormxData] = useState({
        street: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const uid = "w8QILCENGbOqdeTwrSghWOVbeU33";
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        upiId: ""
    });

    // Function to toggle sections
    const toggleShipping = () => setIsShippingOpen(!isShippingOpen);
    const togglePayment = () => setIsPaymentOpen(!isPaymentOpen);

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });

        // Clear error when user starts typing
        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: ""
            });
        }
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};

        // Always validate shipping details regardless of payment method
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^(\+\d{1,3})?\s?\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Shipping address is required";
        }

        // Validate payment details based on selected payment method
        if (paymentMethod === "card") {
            if (!formData.cardNumber.trim()) {
                newErrors.cardNumber = "Card number is required";
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                newErrors.cardNumber = "Please enter a valid 16-digit card number";
            }

            if (!formData.expiryDate.trim()) {
                newErrors.expiryDate = "Expiry date is required";
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
                newErrors.expiryDate = "Please use MM/YY format";
            }

            if (!formData.cvv.trim()) {
                newErrors.cvv = "CVV is required";
            } else if (!/^\d{3}$/.test(formData.cvv)) {
                newErrors.cvv = "Please enter a valid 3-digit CVV";
            }
        } else if (paymentMethod === "upi") {
            if (!formData.upiId.trim()) {
                newErrors.upiId = "UPI ID is required";
            } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId)) {
                newErrors.upiId = "Please enter a valid UPI ID (e.g., name@upi)";
            }
        }
        // For COD, no payment validation needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Calculate total price
    const calculateTotal = () => {
        if (!product) return 0;
        return Number(product.price) + 41 + Math.round(product.price * 0.08) + (paymentMethod === "cod" ? 19 : 0);
    };

    const saveOrderToDatabase = async (orderDetails) => {
        try {
            const response = await axios.post('http://localhost:8081/orders', orderDetails);
            return response.data;
        } catch (error) {
            console.error('Error saving order to database:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    // Handle form submission and redirection
    const handleSubmit = async (e) => {
        e.preventDefault();
        // First open both sections to show any validation errors
        setIsShippingOpen(true);
        setIsPaymentOpen(true);

        if (validateForm()) {
            setIsSubmitting(true); // Set loading state

            try {
                // Generate a random order ID
                const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

                // Form is valid, proceed with checkout based on payment method
                const orderDetails = {
                    product: product,
                    customer: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        address: formData.address
                    },
                    paymentMethod: paymentMethod,
                    total: calculateTotal(),
                    orderId: orderId,
                    orderDate: new Date(),
                    status: paymentMethod === "cod" ? "Pending" : "Processing",
                    paymentStatus: paymentMethod === "cod" ? "Pending" : "Processing"
                };

                if (paymentMethod === "cod") {
                    const savedOrder = await saveOrderToDatabase(orderDetails);
                    navigate("/order-details", {
                        state: {
                            orderDetails: {
                                ...orderDetails,
                                _id: savedOrder._id // Include MongoDB _id if returned
                            }
                        }
                    });
                } else if (paymentMethod === "card") {
                    // For credit card, redirect to payment gateway
                    navigate("/payment/credit-card", { state: { orderDetails } });
                } else if (paymentMethod === "upi") {
                    // For UPI, redirect to phone pay or UPI payment page
                    navigate("/payment/upi", { state: { orderDetails, upiId: formData.upiId } });
                }
            } catch (error) {
                // Handle errors (e.g., database connection issues)
                setErrors({
                    ...errors,
                    submission: "Failed to process your order. Please try again."
                });
            } finally {
                setIsSubmitting(false); // Reset loading state
            }
        } else {
            // Form validation failed, scroll to first error
            const firstErrorField = document.querySelector(".error-field");
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/address/${uid}`);
                if (res.ok) {
                    const data = await res.json();
                    const formatted = Array.isArray(data) ? data : [data]; // handle single or array response
                    setAddresses(formatted.map((a, index) => ({
                        ...a,
                        id: index + 1, // Assuming an id field is not provided by the backend
                        isDefault: index === 0, // Set the first address as default
                    })));
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddresses([]); // Fallback to an empty list
            }
        };

        fetchAddresses();
    }, [uid]);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setFormxData({
            street: address.street,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
            country: address.country,
            isDefault: address.isDefault,
        });
        setEditMode(true); // Show the form for editing
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormxData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveAddress = async () => {
        try {
            const updatedAddress = {
                ...formData,
                uid,
            };

            const res = await fetch("http://localhost:8080/api/address/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([updatedAddress]), // Send as an array even for a single update
            });

            if (!res.ok) {
                throw new Error("Failed to save address");
            }

            // Update state with the new address (you might want to refetch or update the specific address)
            setAddresses((prev) =>
                prev.map((a) =>
                    a.id === selectedAddress.id ? { ...a, ...formData } : a
                )
            );
            setEditMode(false); // Exit edit mode
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false); // Exit edit mode without saving
    };

    return (
        <div className="max-w-4xl mx-auto mt-18 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4 border-gray-200">Secure Checkout</h2>

            {product ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>

                            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description || "Premium quality product"}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-orange-600">₹{product.price}</p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                                    <p>Subtotal</p>
                                    <p>₹{product.price}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <p>Shipping</p>
                                    <p>₹41</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <p>Tax</p>
                                    <p>₹{Math.round(product.price * 0.08)}</p>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                                    <p>Total</p>
                                    <p className="text-orange-600">₹{calculateTotal()}</p>
                                </div>
                                {paymentMethod === "cod" && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Includes ₹19 convenience fee for Cash on Delivery
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-50 mb-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                type="button" // Specify type=button to prevent form submission
                                onClick={toggleShipping}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-orange-50 transition-colors duration-300"
                            >
                                <h3 className="text-xl font-semibold text-gray-800">Shipping Details</h3>
                                {isShippingOpen ? <ChevronUp className="h-5 w-5 text-orange-500"/> :
                                    <ChevronDown className="h-5 w-5 text-orange-500"/>}
                            </button>

                            {isShippingOpen && (
                                <div className="p-5 pt-0 border-t border-gray-200">
                                    <div className="space-y-4 mt-3">
                                        <div className={errors.fullName ? "error-field" : ""}>
                                            <label htmlFor="fullName"
                                                   className="block text-sm font-medium text-gray-700 mb-1">Full
                                                Name</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border ${errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                placeholder="John Doe"
                                            />
                                            {errors.fullName && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.fullName}
                                                </p>
                                            )}
                                        </div>
                                        <div className={errors.phone ? "error-field" : ""}>
                                            <label htmlFor="phone"
                                                   className="block text-sm font-medium text-gray-700 mb-1">Phone
                                                Number</label>
                                            <input
                                                type="text"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                placeholder="+91 98765 43210"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                        <div className={errors.address ? "error-field" : ""}>
                                            <label htmlFor="address"
                                                   className="block text-sm font-medium text-gray-700 mb-1">Shipping
                                                Address</label>
                                            <textarea
                                                id="address"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border ${errors.address ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                placeholder="Enter your full address"
                                            ></textarea>
                                            {errors.address && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                type="button" // Specify type=button to prevent form submission
                                onClick={togglePayment}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-orange-50 transition-colors duration-300"
                            >
                                <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
                                {isPaymentOpen ? <ChevronUp className="h-5 w-5 text-orange-500"/> :
                                    <ChevronDown className="h-5 w-5 text-orange-500"/>}
                            </button>

                            {isPaymentOpen && (
                                <div className="p-5 pt-0 border-t border-gray-200">
                                    <div className="mb-6">
                                        <div className="grid grid-cols-3 mt-3 gap-2">
                                            <div
                                                className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${paymentMethod === "card" ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"}`}
                                                onClick={() => setPaymentMethod("card")}
                                            >
                                                <CreditCard className="h-6 w-6 text-orange-500 mb-1"/>
                                                <span className="text-xs font-medium text-gray-700">Card</span>
                                            </div>

                                            <div
                                                className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${paymentMethod === "upi" ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"}`}
                                                onClick={() => setPaymentMethod("upi")}
                                            >
                                                <Smartphone className="h-6 w-6 text-orange-500 mb-1"/>
                                                <span className="text-xs font-medium text-gray-700">UPI</span>
                                            </div>

                                            <div
                                                className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${paymentMethod === "cod" ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"}`}
                                                onClick={() => setPaymentMethod("cod")}
                                            >
                                                <DollarSign className="h-6 w-6 text-orange-500 mb-1"/>
                                                <span className="text-xs font-medium text-gray-700">Cash</span>
                                            </div>
                                        </div>
                                    </div>

                                    {paymentMethod === "card" && (
                                        <div
                                            className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <div className={errors.cardNumber ? "error-field" : ""}>
                                                <label htmlFor="cardNumber"
                                                       className="block text-sm font-medium text-gray-700 mb-1">Card
                                                    Number</label>
                                                <input
                                                    type="text"
                                                    id="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-2 border ${errors.cardNumber ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                                {errors.cardNumber && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.cardNumber}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className={errors.expiryDate ? "error-field" : ""}>
                                                    <label htmlFor="expiryDate"
                                                           className="block text-sm font-medium text-gray-700 mb-1">Expiry
                                                        Date</label>
                                                    <input
                                                        type="text"
                                                        id="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-2 border ${errors.expiryDate ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                        placeholder="MM/YY"
                                                    />
                                                    {errors.expiryDate && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="h-4 w-4 mr-1" /> {errors.expiryDate}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className={errors.cvv ? "error-field" : ""}>
                                                    <label htmlFor="cvv"
                                                           className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                    <input
                                                        type="text"
                                                        id="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-2 border ${errors.cvv ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                        placeholder="123"
                                                    />
                                                    {errors.cvv && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                                            <AlertCircle className="h-4 w-4 mr-1" /> {errors.cvv}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "upi" && (
                                        <div
                                            className="text-center p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                                            <div
                                                className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4 border border-orange-100">
                                                <Smartphone className="h-8 w-8 text-orange-500"/>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">Pay using UPI</p>
                                            <div className={`mb-4 ${errors.upiId ? "error-field" : ""}`}>
                                                <input
                                                    type="text"
                                                    id="upiId"
                                                    value={formData.upiId}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-2 border ${errors.upiId ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                                                    placeholder="Enter UPI ID (e.g., name@upi)"
                                                />
                                                {errors.upiId && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.upiId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "cod" && (
                                        <div
                                            className="text-center p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                                            <div
                                                className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4 border border-orange-100">
                                                <DollarSign className="h-8 w-8 text-orange-500"/>
                                            </div>
                                            <h4 className="text-md font-medium text-gray-800 mb-2">Cash on Delivery</h4>
                                            <p className="text-sm text-gray-600 mb-3">Pay with cash when your order is
                                                delivered</p>
                                            <div className="bg-orange-50 p-3 rounded-md border border-orange-100">
                                                <p className="text-xs text-orange-700">
                                                    A small convenience fee of ₹19 will be added for Cash on Delivery
                                                    orders.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.submission && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.submission}
                                </p>
                            </div>
                        )}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} focus:ring-4 focus:ring-orange-200 text-white font-medium rounded-lg text-base px-5 py-3 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 active:shadow-md flex items-center justify-center`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    `${paymentMethod === "cod" ? "Place Order" : "Pay"} ₹${calculateTotal()}`
                                )}
                            </button>

                            {paymentMethod === "cod" && (
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Includes ₹19 convenience fee for Cash on Delivery
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center space-x-2 mt-5">
                            <Lock className="h-4 w-4 text-gray-400"/>
                            <p className="text-sm text-gray-500">Secure payment processing</p>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg shadow-inner border border-gray-100">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400"/>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No product selected</h3>
                    <p className="mt-2 text-sm text-gray-500">It looks like you haven't selected any product for
                        checkout.</p>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all duration-300"
                        >
                            Return to Shop
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;