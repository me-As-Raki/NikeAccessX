'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  CreditCard,
  Info,
} from 'lucide-react';

export default function AddToCartBuyNowButtons({ product }) {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('⚠️ Please log in to add items to your cart.');
      router.push('/login');
      return;
    }

    setLoading(true);
    const itemRef = doc(db, `cartProducts/${user.uid}/items`, product.id);

    try {
      const existing = await getDoc(itemRef);
      if (existing.exists()) {
        setMsg('🛒 Already in cart.');
        setShowConfirm(false);
        setLoading(false);
        setTimeout(() => setMsg(''), 4000);
        return;
      }

      await setDoc(itemRef, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity: 1,
      });

      setMsg('🎉 Product added to cart successfully!');
    } catch (err) {
      console.error('Add to cart failed:', err);
      setMsg('❌ Failed to add. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleBuyNow = () => {
    setShowConfirm(false);
    router.push(`/checkout?item=${product.id}`);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>

        <button
          onClick={() => setShowConfirm('buy')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition"
        >
          <CreditCard className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      {/* Feedback Message */}
      {msg && (
        <div className="mt-4 bg-white/10 dark:bg-white/5 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          {msg}
        </div>
      )}

      {/* Confirmation Modal for Buy Now and First Add to Cart */}
      {showConfirm && showConfirm === true && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-slideUp">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Add to Cart?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              This product will be added to your cart.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm === 'buy' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-slideUp">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Proceed to Buy Now?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              You’ll be redirected to secure checkout with this item.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
