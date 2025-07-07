'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const auth = getAuth();

const ADMIN_EMAIL = 'rakeshpoojary850@gmail.com';

const categoryTypes = {
  Shoes: ['Running', 'Sneakers', 'Football', 'Basketball'],
  Apparel: ['T-Shirt', 'Hoodie', 'Shorts', 'Jacket', 'Pants'],
  Accessories: [
    'Backpack', 'Gym Sack', 'Duffel Bag', 'Cap', 'Beanie',
    'Headband', 'Socks', 'Gloves', 'Sunglasses', 'Yoga Mat',
    'Bottle', 'Towel', 'Wristband', 'Sports Tape'
  ],
  Gear: ['Resistance Band', 'Foam Roller', 'Jump Rope', 'Arm Band']
};

export default function AdminAddPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setForm(prev => ({ ...prev, category: value, type: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, image, category, type } = form;

    if (!name || !description || !price || !image || !category || !type) {
      setToast('⚠️ Please fill all fields.');
      return;
    }

    setLoading(true);
    setToast('');

    try {
      await addDoc(collection(db, 'products'), {
        ...form,
        price: parseInt(price),
        timestamp: serverTimestamp()
      });

      setToast('✅ Product added successfully!');
      setForm({ name: '', description: '', price: '', image: '', category: '', type: '' });
    } catch (error) {
      console.error(error);
      setToast('❌ Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  // If not logged in
  if (userEmail === null) {
    return (
      <div className="text-center mt-10 text-lg font-medium">
        🔒 Please log in to access admin features.
      </div>
    );
  }

  // If not the admin
  if (userEmail !== ADMIN_EMAIL) {
    return (
      <div className="text-center mt-10 text-lg font-medium text-red-600">
        🚫 Access Denied: You are not authorized to view this page.
      </div>
    );
  }

  // Admin UI
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Nike Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (₹)"
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {Object.keys(categoryTypes).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {form.category && (
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Type</option>
            {categoryTypes[form.category].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      {toast && (
        <div className="mt-4 text-center text-sm text-gray-700">
          {toast}
        </div>
      )}
    </div>
  );
}
