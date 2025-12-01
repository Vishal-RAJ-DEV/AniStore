import React, { useState } from 'react'

const ProductSizeSelector = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState('M')
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    return (
        <div className="space-y-3">
            <label className="text-white font-semibold text-lg">Select Size</label>
            <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-full font-semibold text-sm transition-all ${
                            selectedSize === size
                                ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white border-2 border-[#ff6b9d] scale-110'
                                : 'bg-transparent text-white border-2 border-gray-600 hover:border-white'
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ProductSizeSelector