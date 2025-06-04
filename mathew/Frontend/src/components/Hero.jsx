import React from "react";
import { assets } from "../assets/assets";


const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-red-200   ">


      {/* left side content */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base text-red-400">Our BestSellers</p>
          </div>
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed ">
            Latest Arraivals
          </h1>

          <div className="flex items-center gap-2">
            <p className="font semibold text-sm md:text-base text-red-400">Shop Now</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Rightside image */}
      <img className="w-full sm:w-1/2 " src={assets.hero_img} alt="" />
    </div>
  );
};

export default Hero;
