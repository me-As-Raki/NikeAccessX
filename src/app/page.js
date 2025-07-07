'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // 👈 Redirect to login page on initial load
  }, [router]);

  return null; // Or a loading spinner while redirecting
}
