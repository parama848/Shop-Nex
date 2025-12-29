import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">

      {/* PAGE TITLE */}
      <div className="text-center pt-12 border-t">
        <Title text1="CONTACT" text2="US" />
        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
          We’d love to hear from you. Reach out for support, inquiries, or
          partnership opportunities.
        </p>
      </div>

      {/* CONTACT SECTION */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-center mb-32">

        {/* IMAGE */}
        <img
          src={assets.contact_img}
          alt="Contact ShopNex"
          className="w-full rounded-3xl shadow-lg object-cover"
        />

        {/* DETAILS */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Our Office
            </h3>
            <p className="text-gray-600 leading-relaxed">
              158, South Street <br />
              Velaiyampakkam, Tiruvannamalai – 606811 <br />
              Tamil Nadu, India
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contact Information
            </h3>
            <p className="text-gray-600">
              Phone: <span className="font-medium">+91 81484 97159</span>
              <br />
              Email:{" "}
              <span className="font-medium">support@shopnex.com</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Careers at SHOPNEX
            </h3>
            <p className="text-gray-600">
              Join our growing team and help shape the future of online
              shopping.
            </p>
          </div>

          <button className="inline-block bg-black text-white px-8 py-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            View Open Positions
          </button>
        </div>
      </div>

      {/* NEWSLETTER */}
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
