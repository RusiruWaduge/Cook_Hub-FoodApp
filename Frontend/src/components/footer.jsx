import React from "react";
import logo from "../assets/logo.png"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] text-black mt-auto mb-0">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-10 sm:px-6 lg:px-8">
       
          {/* Left Side - Logo and Copyright */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
           <div className="flex items-center space-x-2">
                      <img
                        src={logo}
                        alt="CookHUB Logo"
                        className="h-30 w-30 rounded-full"
                      />
            <span className="text-lg font-semibold tracking-wide">
              Cook HUB 🍽
            </span>
          </div>

          {/* Center - Quick Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="/"
              className="hover:text-gray-200 transition duration-300 text-sm"
            >
              Home
            </a>
            <a
              href="/explore"
              className="hover:text-gray-200 transition duration-300 text-sm"
            >
              Explore
            </a>
            <a
              href="/CreatePost"
              className="hover:text-gray-200 transition duration-300 text-sm"
            >
              Profile
            </a>
            <a
              href="/learning"
              className="hover:text-gray-200 transition duration-300 text-sm"
            >
              Learning Plans
            </a>
          </div>

          {/* Right Side - Copyright */}
          <div className="text-sm text-center md:text-right">
            © {new Date().getFullYear()} Cook HUB. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
