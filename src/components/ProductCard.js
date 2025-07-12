'use client';

export default function ProductCard({
  name = 'Unnamed Product',
  imageUrl = '',
  description = 'No description provided.',
  price = 999,
  onAddToCart = () => {},
  onBuyNow = () => {},
}) {
  const safeImageUrl = imageUrl?.trim()
    ? imageUrl
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-4xl mx-auto overflow-hidden border border-gray-200 dark:border-gray-700">

      {/* Image Section */}
      <div className="w-full sm:w-1/3 h-44 sm:h-auto">
        <img
          src={safeImageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            console.warn(`Image failed to load for: ${name}`);
          }}
        />
      </div>

      {/* Details Section */}
      <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mt-2">
          <p className="text-base sm:text-lg font-bold text-black dark:text-white">
            ₹{price}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onAddToCart}
              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
