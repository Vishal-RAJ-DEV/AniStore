import React from 'react'
import { FaTags } from 'react-icons/fa'

const ProductTitle = ({ product }) => {
    return (
        <div className="space-y-3">
            {/* Brand Badge */}
            {product.brand && (
                <div className="inline-flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-full">
                    <FaTags className="text-[#ff6b9d]" size={14} />
                    <span className="text-white font-semibold uppercase tracking-wide text-xs">
                        {product.brand}
                    </span>
                </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                {product.name}
            </h1>
        </div>
    )
}

export default ProductTitle