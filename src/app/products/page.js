'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ShoppingCart, XCircle, Filter, RotateCcw, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const items = snapshot.docs.map(doc => {
        const item = doc.data();
        const type = item.type?.trim() || 'Shoes';
        return { id: doc.id, ...item, type };
      });
      const types = ['All', ...new Set(items.map(p => p.type))];
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
    router.push(`/product/${product.id}`);
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
    .filter(p =>
      (filterType === 'All' || p.type === filterType) &&
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'low-high' ? a.price - b.price :
      sortOrder === 'high-low' ? b.price - a.price : 0
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

        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10">Explore Our Smart Lineup</h1>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center gap-4 mb-10">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-gray-400 mr-2" />
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-transparent text-white outline-none">
              {productTypes.map(t => (
                <option key={t} value={t} className="text-black">{t}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg w-full sm:w-64 text-white"
          />

          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white">
            <option value="">Sort by Price</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>

          <button onClick={refreshRandom} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>

          {(filterType !== 'All' || sortOrder || searchQuery) && (
            <button onClick={clearFilters} className="flex items-center gap-2 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {visibleProducts.map(product => (
                <div key={product.id} className="bg-white/5 border border-gray-700 rounded-xl overflow-hidden hover:scale-105 transition duration-300 shadow-xl backdrop-blur-md">
                  <div onClick={() => router.push(`/product/${product.id}`)} className="cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => e.target.src = '/fallback.jpg'}
                      className="w-full h-52 object-cover border-b border-gray-700"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <span className="text-xs inline-block bg-gray-700 rounded-full px-2 py-1 text-gray-300">{product.type}</span>
                    <p className="text-sm text-gray-300 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-3">
                      <span className="font-semibold">₹{product.price}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddToCart(product)} className="bg-white text-black rounded-full px-3 py-1 text-sm hover:bg-gray-200 flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" /> Add
                        </button>
                        <button onClick={() => handleBuyNow(product)} className="bg-blue-600 rounded-full px-3 py-1 text-sm hover:bg-blue-700 text-white">
                          ⚡ Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
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
