'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Load user & existing Firestore data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      const userDocRef = doc(db, 'users', currentUser.uid);
      const snapshot = await getDoc(userDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save to Firestore
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        email: user.email, // optional: save email too
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('🔥 Error updating profile:', err);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <p className="text-center text-gray-400 py-20">Loading profile...</p>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-xl mx-auto bg-white/5 p-8 rounded-xl border border-gray-700 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">My Profile</h1>

        {success && (
          <p className="mb-4 text-blue-400 font-medium text-center">Profile updated successfully.</p>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Email (Read-only)</label>
            <input
              value={user.email}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-white text-black font-medium px-5 py-2 rounded-lg transition hover:bg-gray-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <Link
  href="/orders"
  className="w-full sm:w-auto flex items-center justify-center gap-2 text-center bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white font-medium transition"
>
  My Orders
</Link>


            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-transparent border border-gray-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
