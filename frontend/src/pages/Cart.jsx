import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addTOCart, removeCart } from '../redux/features/cart/cartSlice'
import { FaPlus, FaMinus, FaTimes, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart)

    const addToCartHandler = (product, qty) => {
        if (qty > 0) {
            dispatch(addTOCart({
                ...product,
                qty: 1 // Add 1 to current quantity
            }))
        }
    }

    const decreaseQtyHandler = (product) => {
        if (product.qty > 1) {
            dispatch(addTOCart({
                ...product,
                qty: -1 // Subtract 1 from current quantity
            }))
        }
    }

    const removeFromCartHandler = (id) => {
        dispatch(removeCart({ _id: id }))
        toast.success('Item removed from cart')
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-400 mb-8">Add some products to get started</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-8 py-3 rounded-full font-semibold hover:from-[#ff5c92] hover:to-[#ff7a99] transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white">
                        Your Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items - Left Side */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl overflow-hidden">
                            {/* Table Header */}
                            <div className="hidden md:grid md:grid-cols-12 gap-4 p-6 border-b border-gray-800 text-gray-400 text-sm font-medium">
                                <div className="col-span-6">Item</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-1 text-right">Total</div>
                                <div className="col-span-1 text-center">Remove</div>
                            </div>

                            {/* Cart Items */}
                            {cartItems.map((item, index) => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    addToCartHandler={addToCartHandler}
                                    decreaseQtyHandler={decreaseQtyHandler}
                                    removeFromCartHandler={removeFromCartHandler}
                                    isLast={index === cartItems.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary - Right Side */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 sticky top-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

                            {/* Subtotal */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Subtotal:</span>
                                <span className="text-white font-semibold">${itemsPrice}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Shipping:</span>
                                <span className="text-white font-semibold">
                                    {parseFloat(shippingPrice) === 0 ? 'Free' : `$${shippingPrice}`}
                                </span>
                            </div>

                            {/* Sales Tax */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400">Sales Tax:</span>
                                <span className="text-white font-semibold">${taxPrice}</span>
                            </div>

                            {/* Free Shipping Indicator */}
                            {parseFloat(shippingPrice) === 0 && (
                                <div className="flex items-center space-x-2 mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <FaCheck className="text-green-400" size={14} />
                                    <span className="text-green-400 text-sm font-medium">
                                        Congrats, you're eligible for Free Shipping
                                    </span>
                                </div>
                            )}

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <button className="text-[#ff6b9d] hover:text-[#ff8da8] text-sm font-medium transition-colors">
                                    Add Coupon
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-800 mb-6"></div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-bold text-white">Total:</span>
                                <span className="text-2xl font-bold text-white">${totalPrice}</span>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-full font-bold text-lg transition-all shadow-lg"
                            >
                                Check out
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-4 border border-gray-700 hover:border-gray-600 text-white py-3 rounded-full font-semibold transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Cart Item Component
const CartItem = ({ item, addToCartHandler, decreaseQtyHandler, removeFromCartHandler, isLast }) => {
    const itemTotal = (parseFloat(item.price) * item.qty).toFixed(2)

    return (
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-6 ${!isLast ? 'border-b border-gray-800' : ''}`}>
            {/* Product Info - Mobile: Full Width, Desktop: 6 cols */}
            <div className="col-span-1 md:col-span-6">
                <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        {/* Brand */}
                        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">
                            {item.brand || 'Brand'}
                        </p>

                        {/* Product Name */}
                        <h4 className="text-white font-semibold text-lg mb-2 leading-tight">
                            {item.name}
                        </h4>

                        {/* Estimated Ship Date */}
                        <p className="text-orange-400 text-sm mb-2">
                            Estimated Ship Date: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </p>

                        {/* Change Link */}
                        <button className="text-[#ff6b9d] hover:text-[#ff8da8] text-sm font-medium transition-colors">
                            Change
                        </button>

                        {/* Mobile Price & Total */}
                        <div className="md:hidden mt-3 space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Price:</span>
                                <span className="text-white font-semibold">${parseFloat(item.price).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-white font-semibold">${itemTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price - Desktop Only */}
            <div className="hidden md:flex md:col-span-2 items-start justify-end pt-2">
                <span className="text-white font-semibold text-lg">
                    ${parseFloat(item.price).toFixed(2)}
                </span>
            </div>

            {/* Quantity Controls */}
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-center md:justify-center space-x-3">
                    <button
                        onClick={() => decreaseQtyHandler(item)}
                        disabled={item.qty <= 1}
                        className="bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                    >
                        <FaMinus size={12} />
                    </button>
                    <span className="text-white font-semibold text-xl w-12 text-center">
                        {item.qty}
                    </span>
                    <button
                        onClick={() => addToCartHandler(item, item.qty)}
                        disabled={item.qty >= item.countInStock}
                        className="bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            </div>

            {/* Total - Desktop Only */}
            <div className="hidden md:flex md:col-span-1 items-start justify-end pt-2">
                <span className="text-white font-semibold text-lg">
                    ${itemTotal}
                </span>
            </div>

            {/* Remove Button */}
            <div className="col-span-1 md:col-span-1">
                <div className="flex justify-center md:justify-center">
                    <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-red-500/30"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart