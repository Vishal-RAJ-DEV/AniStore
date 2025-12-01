import React from 'react'

const ProductPrice = ({ product }) => {
    const originalPrice = product.price * 1.3 // Mock original price (30% off)
    const discount = originalPrice - product.price

    return (
        <div className="flex items-center space-x-4">
            {/* Original Price (Strikethrough) */}
            <span className="text-2xl text-gray-500 line-through">
                Rs. {originalPrice.toFixed(2)}
            </span>

            {/* Current Price */}
            <span className="text-3xl lg:text-4xl font-bold text-white">
                Rs. {product.price?.toFixed(2)}
            </span>

            {/* Discount Badge */}
            <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-3 py-1 rounded-full text-sm font-semibold">
                SAVE RS. {discount.toFixed(2)}
            </div>
        </div>
    )
}

export default ProductPrice