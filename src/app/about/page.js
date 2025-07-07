'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div>
          {/* 🔙 Back Button */}
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-full hover:from-gray-700 hover:to-gray-600 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Redefining Performance <br /> with Intelligence
          </h1>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            <span className="font-bold text-white">Nike AI Redesign</span> is more than a makeover —
            it's a bold evolution. By combining Nike’s global legacy in athletic innovation with the dynamic possibilities of AI,
            we’re reshaping how athletes, fans, and consumers connect with sport online.
          </p>

          <p className="text-gray-400 text-md mb-6 leading-relaxed">
            Our rebrand pushes boundaries — delivering personalized discovery, immersive product experiences,
            and a streamlined interface that adapts to every user, powered by AI insights.
            Whether you're a marathoner or a sneakerhead, Nike AI Redesign delivers like never before.
          </p>

          <blockquote className="italic text-gray-400 border-l-4 border-white pl-4 mt-6 text-sm sm:text-base">
            "Greatness isn’t born. It’s engineered." — The Future of Sportwear
          </blockquote>
        </div>

        {/* Image Content */}
        <div className="flex justify-center">
          <img
  src="/images/about.png"
  alt="Nike Innovation"
  className="rounded-2xl shadow-2xl w-full max-w-md hover:scale-105 transition duration-500"
/>

        </div>
      </div>
    </section>
  );
}
