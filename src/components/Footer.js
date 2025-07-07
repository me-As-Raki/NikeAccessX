export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-6 mt-16 border-t border-gray-800">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Nike Reimagined. All rights reserved.
      </p>
    </footer>
  );
}
