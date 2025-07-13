'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import {
  collection, getDocs, query, where, addDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, XCircle, Filter, RotateCcw, ArrowLeft,
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const items = snapshot.docs.map((doc) => {
        const item = doc.data();
        const type = item.type?.trim() || 'Shoes';
        return { id: doc.id, ...item, type };
      });
      const types = ['All', ...new Set(items.map((p) => p.type))];
      setProducts(items);
      setProductTypes(types);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) return showToast('Please login to add to cart');

    try {
      const uid = user.uid;
      const cartRef = collection(db, 'cartProducts', uid, 'items');
      const snapshot = await getDocs(query(cartRef, where('productId', '==', product.id)));
      if (!snapshot.empty) return showToast(`"${product.name}" already in cart`);

      await addDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        type: product.type,
        image: product.image,
        addedAt: new Date(),
      });

      showToast(`"${product.name}" added to cart`);
    } catch (err) {
      console.error(err);
      showToast('Failed to add to cart');
    }
  };

  const handleBuyNow = (product) => {
    router.push(`/products/${product.id}`);
  };

  const clearFilters = () => {
    setFilterType('All');
    setSortOrder('');
    setSearchQuery('');
    setVisibleCount(12);
  };

  const refreshRandom = () => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setProducts(shuffled);
    setVisibleCount(12);
  };

  const filteredProducts = products
    .filter(
      (p) =>
        (filterType === 'All' || p.type === filterType) &&
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'low-high'
        ? a.price - b.price
        : sortOrder === 'high-low'
        ? b.price - a.price
        : 0
    );

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 sm:px-6 py-16 sm:py-20">
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full shadow-md transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10">
          Explore Our Smart Lineup
        </h1>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-between gap-3 mb-10">
          {/* Search */}
          <div className="relative col-span-1 sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter by Type */}
          <div className="col-span-1">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-full">
              <Filter className="w-4 h-4 text-gray-400 mr-2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full"
              >
                {productTypes.map((t) => (
                  <option key={t} value={t} className="text-black">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Random Refresh */}
          <button
            onClick={refreshRandom}
            className="col-span-1 flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>

          {/* Clear Filters */}
          {(filterType !== 'All' || sortOrder || searchQuery) && (
            <button
              onClick={clearFilters}
              className="col-span-1 flex items-center justify-center gap-2 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-sm text-white"
            >
              <XCircle className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : visibleProducts.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between bg-white/5 border border-gray-700 rounded-xl overflow-hidden hover:scale-105 transition duration-300 shadow-xl backdrop-blur-md"
                >
                  <div
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="cursor-pointer w-full aspect-square"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => (e.target.src = '/fallback.jpg')}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col p-4 text-white h-full">
                    <h2 className="text-sm sm:text-base font-bold mb-1 line-clamp-1">{product.name}</h2>
                    <span className="text-xs bg-gray-700 rounded-full px-2 py-1 text-gray-300 mb-2 w-fit">
                      {product.type}
                    </span>
                    <p className="text-sm font-semibold mb-3">₹{product.price}</p>

                    <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-black rounded-full px-3 py-1 text-xs sm:text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="bg-blue-600 rounded-full px-3 py-1 text-xs sm:text-sm hover:bg-blue-700 text-white"
                      >
                        ⚡ Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 mt-20">No products match your filter.</p>
        )}
      </div>
    </section>
  );
}
