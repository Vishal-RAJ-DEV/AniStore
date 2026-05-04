import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ProgressStep from '../../components/ProgressStep'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { clearCartItems } from '../../redux/features/cart/cartSlice'
import { useCreateOrderMutation } from '../../redux/api/orderApiSlice'

const PlaceOrder = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector((state) => state.auth)
    const {
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    } = useSelector((state) => state.cart)

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart')
            return
        }

        if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
            navigate('/shipping')
        }
    }, [cartItems.length, navigate, shippingAddress])

    const placeOrderHandler = async () => {
        try {
            const newOrder = await createOrder({
                orderItems: cartItems.map((item) => ({
                    ...item,
                    product: item._id,
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            }).unwrap()

            dispatch(clearCartItems({ userId: userInfo?._id }))
            navigate(`/order/${newOrder._id}`)
        } catch (err) {
            // Error is handled in the UI via the RTK Query error state.
        }
    }

    const errorMessage = error?.data?.message || error?.error || 'Unable to place order'

    return (
        <div className="min-h-screen bg-[#0f0f10] pt-12 pb-12">
            <div className="container mx-auto px-4">
                <ProgressStep currentStep={3} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white">Shipping</h2>
                                <Link to="/shipping" className="text-[#ff6b9d] hover:text-[#ff8da8] transition-colors text-sm font-medium">
                                    Edit
                                </Link>
                            </div>
                            <p className="text-gray-300 leading-7">
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </section>

                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                                <Link to="/shipping" className="text-[#ff6b9d] hover:text-[#ff8da8] transition-colors text-sm font-medium">
                                    Edit
                                </Link>
                            </div>
                            <p className="text-gray-300">{paymentMethod}</p>
                        </section>

                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>

                            {cartItems.length === 0 ? (
                                <Message variant="info">Your cart is empty.</Message>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => (
                                        <div
                                            key={item._id}
                                            className={`flex flex-col sm:flex-row sm:items-center gap-4 pb-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-800' : ''}`}
                                        >
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#1a1a1a] border border-gray-800 flex-shrink-0">
                                                <img
                                                    src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/product/${item._id}`}
                                                    className="text-lg font-semibold text-white hover:text-[#ff6b9d] transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    Qty: {item.qty}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-white font-semibold">
                                                    ${Number(item.price).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Line Total: ${(Number(item.price) * item.qty).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8 sticky top-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            {error && (
                                <Message variant="error">{errorMessage}</Message>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Items</span>
                                    <span className="text-white font-semibold">${itemsPrice}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-white font-semibold">
                                        {Number(shippingPrice) === 0 ? 'Free' : `$${shippingPrice}`}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Tax</span>
                                    <span className="text-white font-semibold">${taxPrice}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 my-6"></div>

                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl font-bold text-white">Grand Total</span>
                                <span className="text-2xl font-bold text-white">${totalPrice}</span>
                            </div>

                            <button
                                type="button"
                                onClick={placeOrderHandler}
                                disabled={cartItems.length === 0 || isLoading}
                                className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] hover:from-[#ff5c92] hover:to-[#ff7a99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full text-lg shadow-[0_0_15px_rgba(255,107,157,0.4)] transition-all duration-300"
                            >
                                {isLoading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            {isLoading && <Loader />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
