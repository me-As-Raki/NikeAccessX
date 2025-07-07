export default function Hero() {
  return (
    <section className="relative bg-black text-white px-6 py-20 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
          Reimagine Movement
        </h2>
        <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 text-gray-300">
          Step into the future with Nike’s AI-powered performance gear.
        </p>
        <a
          href="/products"
          className="inline-block bg-white text-black py-2 px-6 sm:px-8 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
