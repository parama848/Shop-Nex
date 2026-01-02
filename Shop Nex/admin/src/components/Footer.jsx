import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 sm:px-12">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-14 py-14 border-b border-gray-700">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold tracking-wide text-white">
              SHOP<span className="text-blue-500">NEX</span>
            </h1>
            <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
              Admin Panel
            </span>
          </div>

          <p className="text-sm leading-relaxed text-gray-400 md:w-2/3">
            Shop Nex Admin Panel is designed to manage products, orders,
            customers, and analytics efficiently with a secure and scalable
            architecture.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Products</li>
            <li className="hover:text-white cursor-pointer">Orders</li>
            <li className="hover:text-white cursor-pointer">Settings</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Get in Touch
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li>📞 +1 212 546 7890</li>
            <li>✉️ admin@shopnex.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-5 text-center text-sm text-gray-500">
        © 2025 <span className="text-white font-medium">SHOP NEX</span> Admin
        Panel. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
