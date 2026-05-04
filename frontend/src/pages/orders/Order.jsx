import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation, useGetpaypalclientIdQuery } from '../../redux/api/orderApiSlice'
import Message from '../../components/Message'
import Loader from '../../components/Loader'

const PaypalButton = ({ orderId, amount, onPaymentSuccess }) => {
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    useEffect(() => {
        paypalDispatch({
            type: 'resetOptions',
            value: {
                'client-id': process.env.VITE_PAYPAL_CLIENT_ID || '',
                currency: 'USD'
            }
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
    }, [orderId, paypalDispatch])

    if (isPending) return <Loader />

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: { value: amount }
            }]
        })
    }

    const onApprove = async (data, actions) => {
        const details = await actions.order.capture()
        onPaymentSuccess(details)
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
        />
    )
}

const Order = () => {
    const { id: orderId } = useParams()
    const { userInfo } = useSelector((state) => state.auth)

    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId)
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()
    const { data: paypalData } = useGetpaypalclientIdQuery()

    useEffect(() => {
        if (paypalData?.clientId) {
            localStorage.setItem('paypalClientId', paypalData.clientId)
        }
    }, [paypalData])

    const successPaymentHandler = async (paymentResult) => {
        try {
            await payOrder({ orderId, details: paymentResult }).unwrap()
            refetch()
        } catch (err) {
            console.error(err)
        }
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId).unwrap()
            refetch()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f10] pt-12 pb-12 flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f10] pt-12 pb-12">
                <div className="container mx-auto px-4">
                    <Message variant="error">{error?.data?.message || error.error || 'Error loading order'}</Message>
                </div>
            </div>
        )
    }

    if (!order) return null

    const paypalClientId = paypalData?.clientId || localStorage.getItem('paypalClientId')

    return (
        <div className="min-h-screen bg-[#0f0f10] pt-12 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8">Order #{order._id}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Shipping Section */}
                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white">Shipping</h2>
                                {order.isDelivered ? (
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">Delivered</span>
                                ) : (
                                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">Not Delivered</span>
                                )}
                            </div>
                            <p className="text-gray-300 leading-7">
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered && (
                                <p className="text-gray-400 text-sm mt-2">Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}</p>
                            )}
                        </section>

                        {/* Payment Section */}
                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-white">Payment</h2>
                                {order.isPaid ? (
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">Paid</span>
                                ) : (
                                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">Not Paid</span>
                                )}
                            </div>
                            <p className="text-gray-300">Method: {order.paymentMethod}</p>
                            {order.isPaid && (
                                <p className="text-gray-400 text-sm mt-2">Paid on: {new Date(order.paidAt).toLocaleDateString()}</p>
                            )}
                        </section>

                        {/* Order Items */}
                        <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={item.product || index}
                                        className={`flex flex-col sm:flex-row sm:items-center gap-4 pb-4 ${index !== order.orderItems.length - 1 ? 'border-b border-gray-800' : ''}`}
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
                                                to={`/product/${item.product}`}
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
                        </section>

                        {/* PayPal Payment Section */}
                        {!order.isPaid && paypalClientId && (
                            <section className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Pay with PayPal</h2>
                                {loadingPay && <Loader />}
                                <PaypalButton
                                    orderId={orderId}
                                    amount={order.totalPrice}
                                    onPaymentSuccess={successPaymentHandler}
                                />
                            </section>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl border border-gray-900 bg-[#0a0a0a] p-6 md:p-8 sticky top-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Items</span>
                                    <span className="text-white font-semibold">${order.itemPrice}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-white font-semibold">
                                        {Number(order.shippingPrice) === 0 ? 'Free' : `$${order.shippingPrice}`}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Tax</span>
                                    <span className="text-white font-semibold">${order.taxPrice}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 my-6"></div>

                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl font-bold text-white">Grand Total</span>
                                <span className="text-2xl font-bold text-white">${order.totalPrice}</span>
                            </div>

                            {/* Mark as Delivered Button */}
                            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                                <button
                                    type="button"
                                    onClick={deliverOrderHandler}
                                    disabled={loadingDeliver}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full text-lg shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300"
                                >
                                    {loadingDeliver ? 'Marking...' : 'Mark as Delivered'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order
