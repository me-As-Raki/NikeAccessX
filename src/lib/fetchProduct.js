// lib/fetchProduct.js
import { db } from '@/firebase/config';
import { getDoc, doc } from 'firebase/firestore';

export async function fetchProductById(id) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id, ...docSnap.data() } : null;
}
