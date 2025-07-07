'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Contact Info Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>

          <div className="space-y-6 text-sm text-gray-300">
            <div className="flex items-center gap-4">
              <Mail className="text-white w-5 h-5" />
              <span>rakeshpoojary850@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-white w-5 h-5" />
              <span>+91 7795292573</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-white w-5 h-5" />
              <span>Nike AI Studio  45 MG Road, Bengaluru, Karnataka 560001, India</span>
            </div>

            <p className="mt-6 text-gray-400 italic">
              "We don’t just connect. We innovate with every interaction."
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-xl space-y-6">
          <h2 className="text-3xl font-bold mb-6">Send a Message</h2>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          ></textarea>

          <button
            type="submit"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
