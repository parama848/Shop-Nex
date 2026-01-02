import React from "react";

const ShopLoader = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      
      {/* Brand */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-gray-800">
          SHOP <span className="text-blue-500">NEX</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Loading collections...
        </p>
      </div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full px-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-64 animate-pulse"
          >
            <div className="h-44 bg-gray-300 rounded-t-lg"></div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopLoader;
