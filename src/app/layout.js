// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '../context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nike AI',
  description: 'AI-powered eCommerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
