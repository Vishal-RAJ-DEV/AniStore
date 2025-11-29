import React from 'react'
import { Link } from 'react-router-dom'
import { FaDollarSign, FaStar, FaHeart, FaBox } from 'react-icons/fa'

const SmallProducts = ({ product }) => {
  return (
    <Link 
      to={`/product/${product._id}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-[#1e1e1e] rounded-xl border border-[#333] hover:border-[#ff6b9d] transition-all duration-300 mb-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-600 text-5xl">📦</span>
          </div>
        )}
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Wishlist Icon - Shows on Hover */}
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg">
          <FaHeart className="text-[#ff6b9d]" size={16} />
        </button>

        {/* Stock Badge - Shows on Hover */}
        {product.countInStock !== undefined && (
          <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaBox className={product.countInStock > 0 ? 'text-green-400' : 'text-red-400'} size={12} />
            <span className={`text-xs font-semibold ${
              product.countInStock > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* Rating Badge - Always Visible */}
        {product.rating && (
          <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1">
            <FaStar className="text-yellow-400" size={12} />
            <span className="text-white text-xs font-semibold">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Info - Outside Image */}
      <div className=" flex justify-between items-center space-y-1">
        {/* Product Name */}
        <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center">
          <FaDollarSign className="text-[#ff6b9d] mr-1" size={14} />
          <span className="text-white font-bold text-lg">
            {product.price?.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default SmallProducts