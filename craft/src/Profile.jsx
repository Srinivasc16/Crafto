import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const email=localStorage.getItem("useremail");

    useEffect(() => {
        const uid = localStorage.getItem("userid"); // or however you're storing it

        axios.get(`http://localhost:8080/api/profile/get?uid=${uid}`)
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => {
                console.error("Profile not found or error occurred:", err);
            });
    }, []);


    if (loading) return <p>Loading...</p>;

    const isIncomplete = !profile?.name || !profile?.email;

    return (
        <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            {profile ? (
                <>
                    <p><strong>Name:</strong> {profile.name || <span className="text-red-600">Please complete your name</span>}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone || <span className="text-red-600">Add phone number</span>}</p>
                    <p><strong>Address:</strong> {profile.address || <span className="text-blue-600">No address yet. <a href="/add-address" className="underline">Add Address</a></span>}</p>

                    <h2 className="text-xl font-semibold mt-6">Orders</h2>
                    {profile.orders && profile.orders.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {profile.orders.map((order, idx) => (
                                <li key={idx}>{order}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-blue-600">No orders found. <a href="/shop" className="underline">Wanna order?</a></p>
                    )}
                </>
            ) : (
                <p className="text-red-500">Profile not found. <a href="/create-profile" className="underline">Create Profile</a></p>
            )}
        </div>
    );
};

export default ProfilePage;
