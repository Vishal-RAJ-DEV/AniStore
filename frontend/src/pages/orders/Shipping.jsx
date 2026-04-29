import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress, savePaymentMethod } from '../../redux/features/cart/cartSlice'
import { toast } from 'react-toastify'
import ProgressStep from '../../components/ProgressStep'

const Shipping = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart
    
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
    const [country, setCountry] = useState(shippingAddress.country || '')
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <div className="min-h-screen bg-[#0f0f10] pt-12 pb-12">
            <div className="container mx-auto px-4">
                {/* The Progress Bar showing Step 2 as active */}
                <ProgressStep currentStep={2} />
                
                <div className="max-w-2xl mx-auto mt-6 bg-[#0a0a0a] rounded-2xl shadow-xl overflow-hidden border border-gray-900">
                    <div className="px-6 py-8 md:px-10 md:py-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Shipping Details</h1>
                        <p className="text-gray-400 mb-8">Please enter your shipping and payment information.</p>
                        
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Address Fields */}
                            <div className="space-y-5">
                                <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Shipping Address</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter address"
                                        value={address}
                                        required
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-[#1a1a1a] text-white focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all outline-none placeholder-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            placeholder="Enter city"
                                            value={city}
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-[#1a1a1a] text-white focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all outline-none placeholder-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter postal code"
                                            value={postalCode}
                                            required
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-[#1a1a1a] text-white focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all outline-none placeholder-gray-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        value={country}
                                        required
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-[#1a1a1a] text-white focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all outline-none placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4 pt-4">
                                <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Payment Method</h2>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center space-x-3 p-4 border border-gray-800 bg-[#1a1a1a] rounded-lg cursor-pointer hover:border-gray-700 hover:bg-[#2a2a2a] transition-colors relative group">
                                        <input
                                            type="radio"
                                            className="form-radio h-5 w-5 text-[#ff6b9d] bg-[#0a0a0a] border-gray-600 focus:ring-[#ff6b9d] focus:ring-offset-gray-900"
                                            name="paymentMethod"
                                            value="PayPal"
                                            checked={paymentMethod === 'PayPal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="text-white font-medium text-lg">PayPal or Credit Card</span>
                                        {/* Optional glowing effect when checked */}
                                        {paymentMethod === 'PayPal' && (
                                            <div className="absolute inset-0 rounded-lg border border-[#ff6b9d] pointer-events-none shadow-[0_0_10px_rgba(255,107,157,0.2)]"></div>
                                        )}
                                    </label>
                                    
                                    <label className="flex items-center space-x-3 p-4 border border-gray-800 bg-[#1a1a1a] rounded-lg cursor-pointer hover:border-gray-700 hover:bg-[#2a2a2a] transition-colors relative group">
                                        <input
                                            type="radio"
                                            className="form-radio h-5 w-5 text-[#ff6b9d] bg-[#0a0a0a] border-gray-600 focus:ring-[#ff6b9d] focus:ring-offset-gray-900"
                                            name="paymentMethod"
                                            value="Stripe"
                                            checked={paymentMethod === 'Stripe'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="text-white font-medium text-lg">Stripe</span>
                                        {paymentMethod === 'Stripe' && (
                                            <div className="absolute inset-0 rounded-lg border border-[#ff6b9d] pointer-events-none shadow-[0_0_10px_rgba(255,107,157,0.2)]"></div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] hover:from-[#ff5c92] hover:to-[#ff7a99] text-white font-bold py-4 px-6 rounded-full text-lg shadow-[0_0_15px_rgba(255,107,157,0.4)] hover:shadow-[0_0_20px_rgba(255,107,157,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Continue to Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shipping