import React from 'react'
import { useSelector } from 'react-redux'
import SmallProducts from './SmallProducts'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingBag } from 'react-icons/fa'

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] p-3 rounded-full">
              <FaHeart className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Favorites
              </h1>
              <p className="text-gray-400 mt-1">
                {favorites.length === 0 
                  ? "You haven't added any favorites yet" 
                  : `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} in your wishlist`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-12 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-[#ff6b9d]/20 to-[#ff8da8]/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-[#ff6b9d] text-5xl" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-400 mb-8">
                Save your favorite items here and never lose track of what you love!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-8 py-3 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition-colors shadow-lg"
              >
                <FaShoppingBag className="mr-2" />
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Favorites Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <SmallProducts key={product._id} product={product} />
              ))}
            </div>

            {/* Bottom Action Section */}
            <div className="mt-16 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] rounded-2xl p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Shop?
              </h3>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Explore more products and add them to your favorites!
              </p>
              <Link
                to="/shop"
                className="inline-block bg-white text-[#ff6b9d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites