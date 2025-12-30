import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-4 px-[4%] justify-between bg-white shadow-md mb-6 sticky top-0 z-50 border-b border-gray-100'>
      <div className='flex items-center gap-2'>
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-black">
            SHOP
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-blue-600">
            NEX
          </span>
        </Link>
        <span className='hidden sm:block text-xs text-gray-500 border border-gray-300 rounded-full px-2 py-0.5'>Admin Panel</span>
      </div>
      <button
        onClick={() => setToken('')}
        className='bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm active:scale-95'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
