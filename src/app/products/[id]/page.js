import { db } from '@/firebase/config';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import Link from 'next/link';
import AddToCartBuyNowButtons from './AddToCartBuyNowButtons';

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({ id: doc.id }));
}

export default async function ProductPage({ params }) {
  const { id } = params;
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-gray-400 text-lg">❌ Product not found</p>
      </div>
    );
  }

  const product = docSnap.data();

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* 🖼️ Product Image */}
        <section className="w-full">
          <img
            src={product.image || '/fallback.jpg'}
            alt={product.name}
            className="w-full rounded-xl object-cover shadow-lg border border-gray-800"
          />
        </section>

        {/* 📦 Product Details */}
        <section className="flex flex-col gap-6">
          <header>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit bg-gray-800 px-4 py-1 rounded-full text-xs text-gray-300 uppercase tracking-wide">
              {product.type || 'Product'}
            </span>
            <p className="text-3xl font-bold text-green-400">₹{product.price}</p>
          </div>

          <div className="mt-2">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Quick Actions</h2>
            <AddToCartBuyNowButtons product={{ id, ...product }} />
          </div>

          <div className="mt-6">
            <Link
              href="/products"
              className="inline-block text-sm text-gray-400 hover:text-white underline underline-offset-4"
            >
              ← Browse More Products
            </Link>
          </div>
        </section>
      </div>

      {/* 💡 Mobile spacing */}
      <div className="h-10 sm:hidden" />
    </main>
  );
}
