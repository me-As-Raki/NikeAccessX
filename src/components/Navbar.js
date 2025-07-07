'use client';

import { useEffect, useState } from 'react';
import {
  Home, ShoppingCart, Info, Mail, User, LogIn, Menu, X,
} from 'lucide-react';
import Lottie from 'lottie-react';
import nikeAnimation from '../../public/animations/nike-logo.json';
import Link from 'next/link';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileBanner, setShowMobileBanner] = useState(false);
  const [forceDesktop, setForceDesktop] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMobileBanner(true);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  const handleForceDesktop = () => {
    setForceDesktop(true);
    setShowMobileBanner(false);
    document.documentElement.classList.add('force-desktop');
  };

  return (
    <>
      {/* Mobile-only Banner */}
      {showMobileBanner && (
        <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-sm py-2 px-4 flex justify-between items-center z-[9999]">
          <p className="text-xs sm:text-sm">⚠️ For best experience, use desktop site.</p>
          <button
            onClick={handleForceDesktop}
            className="ml-2 text-xs bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800"
          >
            Turn on Desktop Site
          </button>
          <button onClick={() => setShowMobileBanner(false)} className="ml-2 text-lg font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 bg-black text-white shadow-lg transition-all ${showMobileBanner ? 'mt-10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="w-20 h-10 flex items-center">
            <Lottie animationData={nikeAnimation} loop autoplay />
          </Link>

          {/* Hamburger */}
          <button className="md:hidden" onClick={toggleMenu}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="/" className="flex items-center gap-2 hover:text-gray-300"><Home className="w-4 h-4" /> Home</Link>
            <Link href="/products" className="flex items-center gap-2 hover:text-gray-300"><ShoppingCart className="w-4 h-4" /> Products</Link>
            <Link href="/about" className="flex items-center gap-2 hover:text-gray-300"><Info className="w-4 h-4" /> About</Link>
            <Link href="/contact" className="flex items-center gap-2 hover:text-gray-300"><Mail className="w-4 h-4" /> Contact</Link>
            <Link href="/cart" className="flex items-center gap-2 hover:text-green-400"><ShoppingCart className="w-5 h-5" /> Cart</Link>
          </nav>

          {/* Profile/Login */}
          <div className="hidden md:block">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:text-gray-300">
                <User className="w-5 h-5" /> Profile
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 hover:text-gray-300">
                <LogIn className="w-5 h-5" /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700 px-4 pb-4 flex flex-col gap-4 text-sm font-medium">
            {[{ href: '/', icon: Home, label: 'Home' },
              { href: '/products', icon: ShoppingCart, label: 'Products' },
              { href: '/about', icon: Info, label: 'About' },
              { href: '/contact', icon: Mail, label: 'Contact' },
              { href: '/cart', icon: ShoppingCart, label: 'Cart' },
              ...(user ? [{ href: '/profile', icon: User, label: 'Profile' }] : [{ href: '/login', icon: LogIn, label: 'Login' }])
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} onClick={handleLinkClick} className="flex items-center gap-2 hover:text-gray-300">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
