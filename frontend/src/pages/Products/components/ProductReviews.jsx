import React, { useState } from 'react'
import { FaUserCircle, FaStar, FaRegStar, FaCamera, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useCreateProductReviewMutation } from '../../../redux/api/productApiSlice'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ProductReviews = ({ product }) => {
    // Form state
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [images, setImages] = useState([])
    const [isExperienceBased, setIsExperienceBased] = useState(false)

    const [createProductReview, { isLoading: loadingCreateReview }] = useCreateProductReviewMutation()
    const { userInfo } = useSelector((state) => state.auth)

    // Mock reviews data (replace with actual product.reviews)
    const reviews = product.reviews || []

    // Calculate rating breakdown
    const calculateRatingBreakdown = () => {
        if (reviews.length === 0) {
            return { excellent: 0, veryGood: 0, average: 0, poor: 0, terrible: 0 }
        }

        const breakdown = { excellent: 0, veryGood: 0, average: 0, poor: 0, terrible: 0 }

        reviews.forEach(review => {
            if (review.rating === 5) breakdown.excellent++
            else if (review.rating === 4) breakdown.veryGood++
            else if (review.rating === 3) breakdown.average++
            else if (review.rating === 2) breakdown.poor++
            else if (review.rating === 1) breakdown.terrible++
        })

        // Convert to percentages
        const total = reviews.length
        return {
            excellent: Math.round((breakdown.excellent / total) * 100),
            veryGood: Math.round((breakdown.veryGood / total) * 100),
            average: Math.round((breakdown.average / total) * 100),
            poor: Math.round((breakdown.poor / total) * 100),
            terrible: Math.round((breakdown.terrible / total) * 100)
        }
    }

    const ratingBreakdown = calculateRatingBreakdown()

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']

        const validFiles = files.filter(file => validTypes.includes(file.type))

        if (validFiles.length !== files.length) {
            toast.error('Only JPG, PNG, and WebP images are allowed')
        }

        setImages([...images, ...validFiles.slice(0, 4 - images.length)])
    }

    // Remove image
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index))
    }

    // Submit handler
    const submitHandler = async (e) => {
        e.preventDefault()

        if (!rating || !title || !comment || !name || !email || !isExperienceBased) {
            toast.error('Please fill all required fields')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email')
            return
        }
        // console.log(
        //     rating
        // )

        try {
            await createProductReview({
                productId: product._id,
                reviewData: {  //here sending review data as object to recive in backend
                    rating,
                    comment,
                    title,
                    name,
                    email
                }
            }).unwrap()

            toast.success('Review submitted successfully')

            // Reset form
            setRating(0)
            setComment('')
            setTitle('')
            setName('')
            setEmail('')
            setImages([])
            setIsExperienceBased(false)
        } catch (err) {
            toast.error(err?.data?.message || 'Error submitting review')
        }
    }

    // Check if form is valid
    const isFormValid = rating > 0 && title && comment && name && email && isExperienceBased

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-3xl p-8 lg:p-12">
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* LEFT SIDE - Reviews Summary & List (70%) */}
                    <div className="lg:col-span-8">
                        {/* Reviews Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 flex items-center">
                                <FaUserCircle className="text-[#ff6b9d] mr-3" />
                                REVIEWS
                            </h2>

                            {/* Overall Rating */}
                            {reviews.length > 0 ? (
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold text-white">
                                            {product.rating?.toFixed(1) || '0.0'}
                                        </span>
                                        <span className="text-2xl text-gray-400 ml-2">/ 5</span>
                                    </div>
                                    <div>
                                        <div className="flex space-x-1 mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}
                                                    size={24}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 mb-6">No reviews yet. Be the first to review!</p>
                            )}

                            {/* Rating Breakdown */}
                            {reviews.length > 0 && (
                                <div className="space-y-3">
                                    <RatingBar label="Excellent" percentage={ratingBreakdown.excellent} />
                                    <RatingBar label="Very Good" percentage={ratingBreakdown.veryGood} />
                                    <RatingBar label="Average" percentage={ratingBreakdown.average} />
                                    <RatingBar label="Poor" percentage={ratingBreakdown.poor} />
                                    <RatingBar label="Terrible" percentage={ratingBreakdown.terrible} />
                                </div>
                            )}
                        </div>

                        {/* Reviews Grid */}
                        {reviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                                <FaUserCircle className="text-gray-700 text-6xl mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No reviews yet</p>
                                <p className="text-gray-500 text-sm mt-2">Be the first to share your experience</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE - Submit Review Form (30%) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8">
                            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold text-white mb-6">Write a Review</h3>

                                <form onSubmit={submitHandler} className="space-y-5">
                                    {/* Star Rating Input */}
                                    <div>
                                        <label className="text-white font-medium mb-3 block">
                                            Your overall rating *
                                        </label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    {star <= (hoverRating || rating) ? (
                                                        <FaStar className="text-yellow-400" size={32} />
                                                    ) : (
                                                        <FaRegStar className="text-gray-600" size={32} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Title */}
                                    <div>
                                        <label className="text-white font-medium mb-2 block">
                                            Review title *
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Summarize your review or highlight an interesting detail"
                                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b9d] transition-colors"
                                        />
                                    </div>

                                    {/* Review Text */}
                                    <div>
                                        <label className="text-white font-medium mb-2 block">
                                            Review *
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tell people your review"
                                            rows={5}
                                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b9d] transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="text-white font-medium mb-2 block">
                                            Your name *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Tell us your name"
                                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b9d] transition-colors"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-white font-medium mb-2 block">
                                            Your email *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Tell us your email"
                                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b9d] transition-colors"
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div>
                                        <label className="text-white font-medium mb-2 block">
                                            Do you have photos to share?
                                        </label>
                                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-[#ff6b9d] transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="review-images"
                                            />
                                            <label htmlFor="review-images" className="cursor-pointer">
                                                <FaCamera className="text-gray-600 text-3xl mx-auto mb-2" />
                                                <p className="text-gray-400 text-sm">
                                                    Drag & Drop or <span className="text-[#ff6b9d]">Browse</span>
                                                </p>
                                                <p className="text-gray-600 text-xs mt-1">
                                                    JPG, PNG, WebP (Max 4 images)
                                                </p>
                                            </label>
                                        </div>

                                        {/* Image Previews */}
                                        {images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="relative">
                                                        <img
                                                            src={URL.createObjectURL(img)}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <FaTimes size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Experience Confirmation */}
                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            id="experience-based"
                                            checked={isExperienceBased}
                                            onChange={(e) => setIsExperienceBased(e.target.checked)}
                                            className="mt-1 w-5 h-5 rounded border-gray-700 bg-[#0a0a0a] text-[#ff6b9d] focus:ring-[#ff6b9d] focus:ring-offset-0"
                                        />
                                        <label htmlFor="experience-based" className="text-gray-400 text-sm">
                                            This review is based on my own experience and is my genuine opinion.
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || loadingCreateReview}
                                        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${isFormValid && !loadingCreateReview
                                                ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] hover:from-[#ff5c92] hover:to-[#ff7a99] text-white transform hover:scale-[1.02]'
                                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        {loadingCreateReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Rating Bar Component
const RatingBar = ({ label, percentage }) => {
    return (
        <div className="flex items-center space-x-3">
            <span className="text-white text-sm w-24">{label}</span>
            <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${percentage > 0 ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8]' : 'bg-gray-700'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-white text-sm w-12 text-right">{percentage}%</span>
        </div>
    )
}

// Review Card Component
const ReviewCard = ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 150

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    // Safe access to comment/comments field
    const reviewComment = review.comments || review.comment || ''
    const reviewTitle = review.title || reviewComment.slice(0, 30) || 'Review'

    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
            {/* Review Title */}
            <h4 className="text-white font-semibold text-lg mb-2">{reviewTitle}</h4>

            {/* Star Rating */}
            <div className="flex space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}
                        size={16}
                    />
                ))}
            </div>

            {/* Review Text */}
            <div className="mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                    {isExpanded || reviewComment.length <= maxLength
                        ? reviewComment
                        : `${reviewComment.slice(0, maxLength)}...`}
                </p>
                {reviewComment.length > maxLength && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[#ff6b9d] text-sm mt-2 hover:text-[#ff8da8] flex items-center space-x-1"
                    >
                        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                )}
            </div>

            {/* Review Images (if any) */}
            {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                    {review.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    ))}
                </div>
            )}

            {/* Reviewer Info */}
            <div className="text-gray-500 text-sm flex items-center">
                <span className="text-white font-medium">{review.name || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <span>{review.createdAt ? formatDate(review.createdAt) : 'Recently'}</span>
            </div>
        </div>
    )
}

export default ProductReviews