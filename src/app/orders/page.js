'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { CalendarCheck2, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchOrders(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsub();
  }, []);

  const fetchOrders = async (uid) => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, `orders/${uid}/items`));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().placedAt?.toDate?.().toLocaleString()
      }));
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Loading your orders...</div>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            My Orders
          </h1>
          <Link href="/profile" className="text-sm text-gray-300 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">You have no orders yet.</p>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 p-6 rounded-xl border border-gray-700 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CalendarCheck2 className="w-4 h-4 text-green-400" />
                    <span>{order.date}</span>
                  </div>
                  <div className="text-sm text-gray-400">Total: ₹{order.total}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-400">{item.type}</p>
                        <p className="text-sm font-bold mt-1 text-white">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-sm text-gray-400">
                  <p><strong>Delivery Address:</strong> {order.address || 'N/A'}</p>
                  <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
