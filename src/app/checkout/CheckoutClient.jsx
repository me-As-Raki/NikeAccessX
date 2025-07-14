'use client';

import { Suspense } from 'react';
import InnerCheckout from './InnerCheckout';

export default function CheckoutClient() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-20">Loading checkout...</div>}>
      <InnerCheckout />
    </Suspense>
  );
}
