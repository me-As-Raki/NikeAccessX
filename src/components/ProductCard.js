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
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row text-sm">
      
      {/* Image */}
      <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-40">
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

      {/* Details */}
      <div className="w-full sm:w-2/3 p-3 sm:p-4 flex flex-col justify-between gap-2">
        {/* Title & Desc */}
        <div>
          <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-[12px] sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price & Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <p className="font-bold text-gray-900 dark:text-white">₹{price}</p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onAddToCart}
              className="px-3 py-1 text-xs sm:text-sm rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              className="px-3 py-1 text-xs sm:text-sm rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
