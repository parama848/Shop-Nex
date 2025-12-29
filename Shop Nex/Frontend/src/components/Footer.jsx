import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <Link to="/" className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-extrabold text-white">SHOP</span>
            <span className="text-2xl font-extrabold text-blue-500">NEX</span>
          </Link>

          <p className="text-sm leading-relaxed max-w-sm">
            SHOPNEX is a modern e-commerce platform offering the latest products,
            seamless shopping experience, and secure checkout.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            COMPANY
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/">Home</Link></li>
            <li><Link className="hover:text-white" to="/about">About Us</Link></li>
            <li><Link className="hover:text-white" to="/collection">Collection</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            SUPPORT
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Shipping & Returns</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            GET IN TOUCH
          </h3>
          <ul className="space-y-2 text-sm">
            <li>📞 +1 212 546 7890</li>
            <li>✉️ support@shopnex.com</li>
            <li>🌍 Worldwide Delivery</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <p className="text-center text-xs py-6">
          © 2025 SHOPNEX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
