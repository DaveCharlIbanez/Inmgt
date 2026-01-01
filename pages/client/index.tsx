import Link from "next/link";
import {Search , MapPin , Stars, Bed, User , Wifi, Home, Settings, LayoutDashboard, House } from 'lucide-react';
import React, { Profiler } from "react";


export default function Homepage(){
    const boardingHouses = [
        {
            id: 1,
            Name: "swaberger",
            Location: "",
            Rating: 3,
            price: 1200,
            amenities: ['Wifi', 'Air condtioning']
        },

        {
            id: 2,
            Name:"Kingsley",
            Location:"Kigali",
            Rating: 4,
            price:1500,
            amenities: ['Wifi', 'Air condtioning', 'Kitchen']
        },
        {
            id: 3 , 
            Name: "sekreit",
            Location: "Plaza of Sibalom Antique Philippines 5713",
            Rating: 5,
            price: 2000,
            amenities: ['Wifi', 'Air condtioning', 'Kitchen', 'Parking']
        }
    ];
    return(
        <div className = "flex min-h-screen bg-gray-100 text-black-500" >
            {/*sidebar*/}
            <aside className="w-64 bg-blue-400 shadow-md ">
                <LayoutDashboard className="mr-2"></LayoutDashboard>
                <h2 className="text-xl font-bold p-4 border-b text-black-500">Dashboard</h2>
                <nav className="p-4 space-y-2 ">
                    <Link href="/client" className="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded text-black-500">                       
                        <Home className="mr-2"></Home>
                        <span>Home</span>
                    </Link>
                    <Link href="/client" className="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded">
                        <User className="mr-2"></User>
                        <span>Profile</span>
                    </Link>
                    <Link href="/client/settings" className="flex items-center p-2 text-gray-700 hover:bg-blue-200 rounded">
                        <Settings className="mr-2"/>
                        <span>Settings</span>
                    </Link>
                </nav>
            </aside>

            {/*Main Content*/}
            <main className="max-w-7x1 mx-auto px-6 py-8 text-black ">
                <div className="mb-6">
                    <h2 className="mb-2">Available Boarding Houses</h2>
                    <p className="text-gray-600">{boardingHouses.length} properties found</p>
                </div>

                {/*Boarding House Listings*/}
                <div className=" min-h-[230px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {boardingHouses.map((house) => ( 
                        <div key={house.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            
                            {/*content*/}
                            <div className="p-5">
                                <div className="items-center mb-2">
                                    <h3 className="text-lg font-semibold mb-1">{house.Name}</h3>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                        <Stars className="h-4 w-4 text-yellow-400"/>
                                        <span className="text-sm font-medium text-yellow-600">{house.Rating}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <MapPin className="w-4 h-4"/>
                                        <span className="text-sm">{house.Location}</span>                                       
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Bed className="w-4 h-4"/>
                                        <span className="text-sm font-medium">${house.price} / month</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                            {house.amenities.includes('Wifi') && (
                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                                    <Wifi className="h-4 w-4 text-blue-400"/>
                                                    <span className="text-sm font-medium text-blue-600">Wifi</span>
                                                </div>
                                            )}
                                            {house.amenities.includes('Air condtioning') && (
                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                                    <Home className="h-4 w-4 text-blue-400"/>
                                                    <span className="text-sm font-medium text-blue-600">AirConditioning</span>
                                                </div>
                                            )}
                                            {house.amenities.includes('Kitchen') && (
                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                                    <House className="h-4 w-4 text-blue-400"/>
                                                    <span className="text-sm font-medium text-blue-600">Kitchen</span>
                                                </div>
                                            )}
                                            {house.amenities.includes('Parking') && (
                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                                    <MapPin className="h-4 w-4 text-blue-400"/>
                                                    <span className="text-sm font-medium text-blue-600">Parking</span>
                                                </div>
                                            )}
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                            View Details
                                        </button>
                                    </div>
                                </div>                              
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );

       

    
}