import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* PAGE TITLE */}
      <div className="text-center pt-12 border-t">
        <Title text1="ABOUT" text2="SHOPNEX" />
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          Building a modern, reliable, and seamless online shopping experience.
        </p>
      </div>

      {/* ABOUT CONTENT */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <img
          src={assets.about_img}
          alt="About ShopNex"
          className="w-full rounded-3xl shadow-lg object-cover"
        />

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            <span className="font-semibold text-gray-800">SHOPNEX</span> is a
            next-generation e-commerce platform designed to make online shopping
            simple, fast, and enjoyable.
          </p>

          <p>
            We focus on delivering high-quality products, intuitive browsing,
            and secure checkout — ensuring customers can shop with confidence.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Our Mission
            </h3>
            <p>
              To create a trusted shopping destination by combining technology,
              reliability, and customer-centric design.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-24">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      {/* FEATURES */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="p-8 rounded-2xl border hover:shadow-lg transition">
          <h4 className="font-semibold text-gray-900 mb-3">
            Quality Products
          </h4>
          <p className="text-gray-600 text-sm">
            Every product listed on SHOPNEX goes through strict quality checks
            to ensure customer satisfaction.
          </p>
        </div>

        <div className="p-8 rounded-2xl border hover:shadow-lg transition">
          <h4 className="font-semibold text-gray-900 mb-3">
            Seamless Experience
          </h4>
          <p className="text-gray-600 text-sm">
            From browsing to checkout, our platform is optimized for speed,
            clarity, and ease of use.
          </p>
        </div>

        <div className="p-8 rounded-2xl border hover:shadow-lg transition">
          <h4 className="font-semibold text-gray-900 mb-3">
            Customer-First Support
          </h4>
          <p className="text-gray-600 text-sm">
            Our dedicated support team is always ready to assist and resolve
            issues quickly and professionally.
          </p>
        </div>
      </div>

      {/* NEWSLETTER */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
