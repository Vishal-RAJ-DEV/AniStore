import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar, FaBox } from 'react-icons/fa'

const ProductMeta = ({ product }) => {
    const RatingStars = ({ rating }) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />)
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-600" />)
            }
        }
        return <div className="flex space-x-1">{stars}</div>
    }

    return (
        <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Rating */}
            <div className="flex items-center space-x-2">
                <RatingStars rating={product.rating || 0} />
                <span className="text-gray-400">
                    ({product.numReviews || 0} reviews)
                </span>
            </div>

            {/* Stock Info */}
            <div className="flex items-center space-x-2">
                <FaBox className="text-gray-400" />
                <span className="text-gray-400">
                    {product.countInStock} units available
                </span>
            </div>

            {/* Category */}
            {product.category?.name && (
                <div className="text-gray-400">
                    Category: <span className="text-white">{product.category.name}</span>
                </div>
            )}
        </div>
    )
}

export default ProductMeta