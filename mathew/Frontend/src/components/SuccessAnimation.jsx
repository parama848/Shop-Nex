// components/SuccessAnimation.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SuccessAnimation = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <DotLottieReact
          src="/animations/payment-success.lottie" // 👈 update with your actual path
          autoplay
          loop={false}
          style={{ width: 300, height: 300 }}
        />
        <p className="text-center text-xl font-semibold mt-4">Payment Successful!</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;
