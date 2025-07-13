'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/config';
import {
  collection, getDocs, getDoc, addDoc, deleteDoc, doc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, ArrowLeft, ShoppingCart, MapPin, Phone, User, CreditCard
} from 'lucide-react';

export default function CheckoutPage() {
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('item'); // ?item=productId (for Buy Now)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        if (itemId) {
          await fetchSingleProduct(itemId);
        } else {
          await fetchCart(user.uid);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsub();
  }, [itemId]);

  const fetchCart = async (uid) => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, `cartProducts/${uid}/items`));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), quantity: doc.data().quantity || 1 }));
      setCartItems(data);
      const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setSubtotal(total);
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleProduct = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCartItems([{ ...data, id, quantity: 1 }]);
        setSubtotal(data.price);
      } else {
        alert('Product not found');
        router.push('/products');
      }
    } catch (err) {
      console.error('Buy Now error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.address || !form.phone) return alert('Please fill all fields');
    if (!agreeTerms) return alert('Please agree to the Terms & Conditions');

    try {
      await addDoc(collection(db, `orders/${userId}/items`), {
        ...form,
        items: cartItems,
        total: subtotal,
        placedAt: new Date(),
      });

      if (!itemId) {
        // Clear full cart only for full-cart orders
        await Promise.all(cartItems.map(item =>
          deleteDoc(doc(db, `cartProducts/${userId}/items`, item.id))
        ));
      }

      setSuccess(true);
      setCartItems([]);
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order.');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        <ShoppingCart className="w-10 h-10 animate-spin mx-auto text-gray-500" />
        Loading checkout...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Secure Checkout</h1>

        {success ? (
          <div className="flex flex-col items-center text-green-400">
            <CheckCircle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold mb-6">Your order has been placed successfully.</p>
            <Link href="/home" className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* 🧾 Order Summary */}
            <div className="mb-8 space-y-3">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Your Items</h2>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded border border-gray-700">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="text-right text-lg font-bold pt-2 border-t border-gray-700">
                Total: ₹{subtotal}
              </div>
            </div>

            {/* 📦 Shipping Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <textarea
                  placeholder="Shipping Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>

            {/* ✅ Terms Agreement */}
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="accent-blue-600"
              />
              I agree to the&nbsp;
              <Link href="/terms" className="underline text-blue-400 hover:text-blue-300">
                Terms & Conditions
              </Link>
            </label>

            {/* 💳 Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={!agreeTerms}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                agreeTerms
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Place Order
            </button>
          </>
        )}
      </div>
    </section>
  );
}
