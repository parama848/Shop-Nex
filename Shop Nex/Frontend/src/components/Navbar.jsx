import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 🔥 TEXT LOGO */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-black">
              SHOP
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              NEX
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <NavLink to="/" className="hover:text-black">Home</NavLink>
            <NavLink to="/collection" className="hover:text-black">Collection</NavLink>
            <NavLink to="/about" className="hover:text-black">About</NavLink>
            <NavLink to="/contact" className="hover:text-black">Contact</NavLink>
          </ul>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <button onClick={() => setShowSearch(true)}>
              <img
                src={assets.search_icon}
                className="w-5 opacity-70 hover:opacity-100"
                alt="search"
              />
            </button>

            {/* PROFILE */}
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-6 cursor-pointer opacity-80 hover:opacity-100"
                alt="profile"
                onClick={() => !token && navigate("/login")}
              />

              {token && (
                <div className="absolute -right-2 mt-3 hidden group-hover:block">
                  <div className="w-40 bg-white shadow-lg rounded-lg text-sm border">
                    <p
                      onClick={() => navigate("/orders")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CART */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-6 opacity-80 hover:opacity-100"
                alt="cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button className="md:hidden" onClick={() => setVisible(true)}>
              <img src={assets.menu_icon} className="w-5" alt="menu" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {/* LOGO AGAIN */}
          <span className="text-xl font-extrabold">
            SHOP<span className="text-blue-600">NEX</span>
          </span>
          <button onClick={() => setVisible(false)} className="text-xl">✕</button>
        </div>

        <nav className="flex flex-col text-sm">
          <NavLink to="/" onClick={() => setVisible(false)} className="px-6 py-4 border-b">
            Home
          </NavLink>
          <NavLink to="/collection" onClick={() => setVisible(false)} className="px-6 py-4 border-b">
            Collection
          </NavLink>
          <NavLink to="/about" onClick={() => setVisible(false)} className="px-6 py-4 border-b">
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setVisible(false)} className="px-6 py-4 border-b">
            Contact
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
