"use client";

import { User, Mail, Phone, MapPin, Calendar, Heart } from 'lucide-react'
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccountContent() {
  const searchParams = useSearchParams();
  const unauthorized = searchParams ? searchParams.get("unauthorized") : null;

  return (
    <div className="min-h-screen bg-white">
      {unauthorized && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Access Denied:</strong>
          <span className="block sm:inline ml-2">You must be an admin to access that page.</span>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-xl text-gray-600">
            Manage your profile and view your jewelry collection
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome Back!</h2>
                <p className="text-gray-600">Jewelry Enthusiast</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>customer@example.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>New York, NY</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Member since 2023</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Options */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold ml-4">Profile Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">Update your personal information and preferences</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Edit Profile →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold ml-4">Order History</h3>
                </div>
                <p className="text-gray-600 mb-4">View your past purchases and track orders</p>
                <button className="text-green-600 hover:text-green-800 font-medium">
                  View Orders →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold ml-4">Addresses</h3>
                </div>
                <p className="text-gray-600 mb-4">Manage your shipping and billing addresses</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  Manage Addresses →
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold ml-4">Appointments</h3>
                </div>
                <p className="text-gray-600 mb-4">Schedule consultations and jewelry services</p>
                <button className="text-yellow-600 hover:text-yellow-800 font-medium">
                  Book Appointment →
                </button>
              </div>
            </div>          </div>        </div>
      </div>
    </div>
  )
}

export default function Account() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
    </div>}>
      <AccountContent />
    </Suspense>
  );
}
