import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <main className="">
      <div className="max-w-6xl mx-auto px-2 py-8 flex flex-col md:flex-row items-center gap-10 font-chewy">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
           Split Bills. Stay Friends.
          </h1>
          <p className="text-gray-700 text-lg">
            Easily share expenses and track who owes what—no awkward conversations.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/signup" className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-700 transition">
              Split Now
            </Link>
     
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/rbg.png" 
            alt="Delivery Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </main>
  );
}
