import React, { useState } from 'react'
import HeartIcon from '../HeartIcon'
import { FaCheck, FaTimes, FaSearchPlus } from 'react-icons/fa'

const ProductImages = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    // Mock multiple images (in real app, product would have image array)
    const images = product.image ? [product.image] : []

    return (
        <div className="sticky top-8">
            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-[#f5f0ff] to-[#e6d9f8] rounded-3xl overflow-hidden p-8 lg:p-12">
                {/* Stock Badge */}
                <div className="absolute top-6 left-6 z-10">
                    <div
                        className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 ${
                            product.countInStock > 0
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                        } shadow-lg`}
                    >
                        {product.countInStock > 0 ? (
                            <>
                                <FaCheck />
                                <span>In Stock</span>
                            </>
                        ) : (
                            <>
                                <FaTimes />
                                <span>Out of Stock</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Heart Icon */}
                <div className="absolute top-6 right-6 z-10">
                    <HeartIcon product={product} />
                </div>

                {/* Main Product Image */}
                <div className="relative aspect-square flex items-center justify-center">
                    {product.image ? (
                        <img
                            src={images[selectedImage] || product.image}
                            alt={product.name}
                            className="w-full h-full object-contain max-h-[500px] transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <span className="text-gray-400 text-6xl">📦</span>
                        </div>
                    )}
                </div>

                {/* Zoom Button */}
                {product.image && (
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="absolute bottom-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full transition-all shadow-lg"
                    >
                        <FaSearchPlus className="text-gray-700" size={18} />
                    </button>
                )}
            </div>

            {/* Thumbnail Slider (if multiple images) */}
            {images.length > 1 && (
                <div className="flex space-x-3 mt-4 overflow-x-auto">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedImage === idx
                                    ? 'border-[#ff6b9d]'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            <img
                                src={img}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductImages