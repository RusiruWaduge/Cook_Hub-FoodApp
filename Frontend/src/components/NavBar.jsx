import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#F97316]">
              CookieVerse 🍽️
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-gray-600 hover:text-[#F97316] font-medium"
            >
              Home
            </a>
            <a
              href="/explore"
              className="text-gray-600 hover:text-[#F97316] font-medium"
            >
              Explore
            </a>
            <a
              href="/profile"
              className="text-gray-600 hover:text-[#F97316] font-medium"
            >
              Profile
            </a>
            <a
              href="/learning"
              className="text-gray-600 hover:text-[#F97316] font-medium"
            >
              LeaningPlans
            </a>
          </div>

          {/* User */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-gray-700 font-medium">
              Hello, Foodie 👋
            </span>
            <div className="bg-[#F97316] text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
              F
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;