export default function ProductCard({
  name = 'Unnamed Product',
  imageUrl = '',
  description = 'No description provided.',
}) {
  const safeImageUrl = imageUrl?.trim()
    ? imageUrl
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 max-w-3xl mx-auto w-full my-4">
      
      {/* Image Section */}
      <div className="w-full md:w-1/3">
        <img
          src={safeImageUrl}
          alt={name}
          className="w-full h-56 md:h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            console.warn(`Image failed to load for: ${name}`);
          }}
        />
      </div>

      {/* Details Section */}
      <div className="w-full md:w-2/3 p-4 flex flex-col justify-center space-y-2">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        <p className="text-base font-bold text-black dark:text-white mt-2">₹999</p>
        <div className="flex gap-2 mt-3">
          <button className="px-4 py-1 text-sm rounded-full bg-black text-white hover:bg-gray-800">
            Add to Cart
          </button>
          <button className="px-4 py-1 text-sm rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
