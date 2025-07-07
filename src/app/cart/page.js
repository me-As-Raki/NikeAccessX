'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import {
  collection, getDocs, deleteDoc, doc, setDoc
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  X, Minus, Plus, Trash2, ShoppingCart, CreditCard
} from 'lucide-react';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔄 Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) return router.push('/login');
      const snapshot = await getDocs(collection(db, 'cartProducts', user.uid, 'items'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        quantity: 1,
        ...docSnap.data()
      }));
      setItems(data);
      setLoading(false);
    };
    fetchCart();
  }, [router]);

  // ➕➖ Update quantity
  const updateQuantity = (id, delta) => {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
      )
    );
  };

  // 🗑️ Remove item
  const removeItem = async id => {
    const user = auth.currentUser;
    await deleteDoc(doc(db, 'cartProducts', user.uid, 'items', id));
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // 🧹 Clear entire cart
  const clearCart = async () => {
    const user = auth.currentUser;
    await Promise.all(items.map(it =>
      deleteDoc(doc(db, 'cartProducts', user.uid, 'items', it.id))
    ));
    setItems([]);
  };

  // 💳 Proceed to Checkout
  const proceedToCheckout = async () => {
    const user = auth.currentUser;
    if (!user || !items.length) return;

    const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    await setDoc(doc(db, 'checkoutTemp', user.uid), {
      items,
      subtotal,
      createdAt: new Date()
    });

    router.push('/checkout');
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="text-center py-20 text-white bg-gradient-to-b from-black via-gray-900 to-black">
        <ShoppingCart className="w-12 h-12 mx-auto animate-spin text-gray-400" />
        <p className="mt-2">Fetching your awesome items...</p>
      </div>
    );
  }

  const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">🛒 Your Nike Cart</h1>

        {!items.length ? (
          <div className="text-center text-gray-400 text-lg">
            Your cart is feeling light. Start adding some power to your step! 🚀
          </div>
        ) : (
          <>
            {/* 🔘 Clear All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={clearCart}
                className="text-sm flex items-center gap-2 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>

            {/* 🧾 Items */}
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white/5 p-4 rounded-lg flex items-center gap-4 shadow-sm border border-gray-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={e => e.target.src = '/fallback.jpg'}
                    className="w-20 h-20 object-cover rounded-md border border-gray-600"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-300">₹{item.price} per item</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{item.quantity * item.price}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 mt-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Summary */}
            <div className="mt-10 p-6 bg-white/10 border border-gray-700 rounded-xl shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Total ({items.length} items)</h2>
                <p className="text-gray-300 text-lg">₹{subtotal}</p>
              </div>
              <button
                disabled={!items.length}
                onClick={proceedToCheckout}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition ${
                  items.length
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>

            {/* ❤️ Encouraging Note */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Secure checkout, fast delivery. Gear up and go beyond with Nike. 
            </p>
          </>
        )}
      </div>
    </section>
  );
}
