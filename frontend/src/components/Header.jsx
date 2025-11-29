import React from 'react'
import { useFetchTopProductsQuery } from '../redux/api/productApiSlice'
import SmallProducts from '../pages/Products/SmallProducts'
import Loader from './Loader'
import Message from './Message'
import { FaStar, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Header = () => {
    const { data: topProducts, isLoading, isError, error } = useFetchTopProductsQuery();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4">
                <Message variant="error">
                    {error?.data?.message || error.error || "Error loading products"}
                </Message>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-black to-[#0a0a0a] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Discover Our
                            <span className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] bg-clip-text text-transparent"> Top Products</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Handpicked selections featuring the best of our collection
                        </p>
                    </div>

                    {/* Featured Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center bg-[#1e1e1e] border border-[#333] rounded-full px-6 py-2">
                            <FaStar className="text-[#ff6b9d] mr-2" />
                            <span className="text-white font-medium">Featured Collection</span>
                        </div>
                    </div>
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Side - Top Products */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <FaStar className="text-[#ff6b9d] mr-3" />
                                Top Rated
                            </h2>
                            <Link
                                to="/shop"
                                className="text-[#ff6b9d] hover:text-[#ff8da8] transition-colors flex items-center text-sm font-medium"
                            >
                                View All
                                <FaArrowRight className="ml-2" size={12} />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        {topProducts && topProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {topProducts.map((product) => (
                                    <SmallProducts key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No top products available</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Product Carousel Placeholder */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#333] h-full">
                            <div className="h-[400px] lg:h-full bg-[#2a2a2a] rounded-xl flex items-center justify-center border-2 border-dashed border-[#333]">
                                <div className="text-center">
                                    <div className="text-[#ff6b9d] text-6xl mb-4">🎠</div>
                                    <p className="text-gray-400 font-medium">Product Carousel</p>
                                    <p className="text-gray-500 text-sm mt-2">Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header