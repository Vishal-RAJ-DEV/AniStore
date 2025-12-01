import React from 'react'
import { FaTags } from 'react-icons/fa'

const RelatedProducts = ({ product }) => {
    return (
        <div className="container mx-auto px-4 pb-12">
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <FaTags className="text-[#ff6b9d] mr-3" />
                    Related Products
                </h2>
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                        Related products coming soon...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RelatedProducts