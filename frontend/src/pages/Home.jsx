import React, { useState } from 'react'
import { useFetchProductsQuery } from '../redux/api/productApiSlice.js'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import Header from '../components/Header.jsx'
import SmallProducts from './Products/SmallProducts.jsx'
import Pagination from '../components/Pagination.jsx'
import { Link, useParams } from 'react-router'
import { FaFire, FaSearch, FaArrowRight } from 'react-icons/fa'

const Home = () => {
    const { keyword } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Fetch products with pagination
    const { data, isLoading, isError, error } = useFetchProductsQuery({ 
        keyword, 
        page: currentPage 
    });

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    };

    // Reset page when keyword changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    return (
        <>
            {/* Conditional Header - Only show when no search keyword */}
            {!keyword && <Header />}

            {/* Main Content Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Search Results or Special Products Section */}
                <div className="mb-12">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            {keyword ? (
                                <>
                                    <FaSearch className="text-[#ff6b9d] text-2xl" />
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">
                                            Search Results
                                        </h2>
                                        <p className="text-gray-400 mt-1">
                                            Results for "{keyword}" - {data?.totalProducts || 0} products found
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FaFire className="text-[#ff6b9d] text-2xl" />
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">
                                            Special Products
                                        </h2>
                                        <p className="text-gray-400 mt-1">
                                            Discover our handpicked collection - Page {currentPage} of {data?.pages || 1}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* View All Link */}
                        {!keyword && (
                            <Link 
                                to="/shop" 
                                className="text-[#ff6b9d] hover:text-[#ff8da8] transition-colors flex items-center text-sm font-medium group"
                            >
                                View All
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                            </Link>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="max-w-2xl mx-auto">
                            <Message variant="error">
                                {error?.data?.message || error.error || "Error loading products"}
                            </Message>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!isLoading && !isError && (
                        <>
                            {data?.products?.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {data.products.map((product) => (
                                            <SmallProducts key={product._id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination Component */}
                                    <Pagination
                                        currentPage={data.page}
                                        totalPages={data.pages}
                                        onPageChange={handlePageChange}
                                    />

                                    {/* Products Info */}
                                    <div className="text-center mt-6">
                                        <p className="text-gray-400 text-sm">
                                            Showing {((data.page - 1) * 6) + 1} - {Math.min(data.page * 6, data.totalProducts)} of {data.totalProducts} products
                                        </p>
                                    </div>
                                </>
                            ) : (
                                /* Empty State */
                                <div className="text-center py-20">
                                    <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-12 max-w-md mx-auto">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {keyword ? 'No Results Found' : 'No Products Available'}
                                        </h3>
                                        <p className="text-gray-400 mb-6">
                                            {keyword 
                                                ? `We couldn't find any products matching "${keyword}"`
                                                : 'Check back soon for new products'
                                            }
                                        </p>
                                        {keyword && (
                                            <Link
                                                to="/"
                                                className="inline-block bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-6 py-2 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition-colors"
                                            >
                                                View All Products
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Featured Categories Section - Only show when no keyword */}
                {!keyword && !isLoading && (
                    <div className="mt-20">
                        <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] rounded-2xl p-8 md:p-12 text-center">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Explore More Categories
                            </h3>
                            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                                Browse through our diverse collection and find exactly what you're looking for
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block bg-white text-[#ff6b9d] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Home