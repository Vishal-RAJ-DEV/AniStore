import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const ProductReviews = ({ product }) => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <FaUserCircle className="text-[#ff6b9d] mr-3" />
                    Customer Reviews
                </h2>
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        Reviews section coming soon...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductReviews