import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Latest Fashion Arrivals",
    subtitle: "Trending styles for every season",
    image: assets.hero_1,
  },
  {
    id: 2,
    title: "Upgrade Your Lifestyle",
    subtitle: "Premium collections at best prices",
    image: assets.hero_2,
  },
  {
    id: 3,
    title: "Smart Shopping Starts Here",
    subtitle: "Exclusive deals you can't miss",
    image: assets.hero_3,
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <p className="uppercase tracking-widest text-sm font-semibold text-gray-500">
            New Collection
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {slides[current].title}
          </h1>

          <p className="text-gray-600 text-lg max-w-md">
            {slides[current].subtitle}
          </p>

          <div className="flex gap-4 pt-4">
            <Link to="/Collection">
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT SLIDER IMAGE */}
        <div className="relative w-full h-[380px] md:h-[450px] overflow-hidden rounded-3xl shadow-xl">
          {slides.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.image}
              alt="hero"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>

      </div>

      {/* SLIDER DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${index === current ? "bg-black" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
