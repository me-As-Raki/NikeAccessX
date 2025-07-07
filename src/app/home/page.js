'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Chatbot from '@/components/Chatbot';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

import {
  Lightbulb,
  Rocket,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allItems = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed',
            imageUrl: data.image || '',
            description: data.description || 'No description available',
            price: data.price || 0,
            type: data.type || 'General',
          };
        });
        const shuffled = allItems.sort(() => 0.5 - Math.random()).slice(0, 6);
        setProducts(shuffled);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = () => router.push('/products');

  return (
    <main>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">

        {/* Navbar + Hero */}
        <Navbar />
        <Hero />

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button>

        {/* Featured Products */}
        <section className="py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-10">
            <span className="inline-flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              Featured Innovation
            </span>
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-red-500">No products found!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={handleProductClick}
                  className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                    className="w-full h-56 object-cover rounded-t-xl"
                  />
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Banner Section */}
        <section className="py-20 px-4 sm:px-6 bg-black text-white text-center">
          <h3 className="text-2xl sm:text-4xl font-bold mb-6 tracking-wide">
            <span className="flex flex-wrap justify-center items-center gap-3">
              <Rocket className="w-8 h-8 text-pink-400" />
              Built for Athletes. Designed by Intelligence.
            </span>
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-300 mb-8">
            Nike’s future-forward line blends elite performance with AI-enhanced design.
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-black font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-200"
          >
            Discover More Products
          </a>
        </section>

        {/* Why Us Section */}
        <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800 text-center">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Trusted Quality</h4>
              <p className="text-gray-600 dark:text-gray-300">Backed by decades of innovation and testing.</p>
            </div>
            <div>
              <Rocket className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">High Performance</h4>
              <p className="text-gray-600 dark:text-gray-300">Engineered for comfort, fit, and function.</p>
            </div>
            <div>
              <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Sustainable Future</h4>
              <p className="text-gray-600 dark:text-gray-300">Eco-conscious materials and practices.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      <Chatbot />
    </main>
  );
}
