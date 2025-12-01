import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetchProductByIdQuery } from '../../redux/api/productApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import ProductImages from './components/ProductImages'
import ProductInfo from './components/ProductInfo'
import ProductReviews from './components/ProductReviews'
import RelatedProducts from './components/RelatedProducts'
import { FaArrowLeft } from 'react-icons/fa'

const ProductDetails = () => {
    const { id: productId } = useParams()
    const navigate = useNavigate()

    const { data: product, isLoading, isError, error } = useFetchProductByIdQuery(productId)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4 bg-black min-h-screen">
                <Message variant="error">
                    {error?.data?.message || error.error || 'Error loading product'}
                </Message>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Back Button */}
            <div className="container mx-auto px-4 pt-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Products
                </button>
            </div>

            {/* Main Product Section - Two Column Layout */}
            <div className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Product Images */}
                    <ProductImages product={product} />

                    {/* Right Column - Product Info */}
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews product={product} />

            {/* Related Products */}
            <RelatedProducts product={product} />
        </div>
    )
}

export default ProductDetails