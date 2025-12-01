import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const DescriptionAccordion = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-t border-gray-800 pt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-white hover:text-gray-300 transition-colors"
            >
                <span className="text-xl font-semibold">Description</span>
                <FaChevronDown
                    className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                }`}
            >
                <p className="text-gray-400 leading-relaxed">
                    {product.description || 'No description available.'}
                </p>
            </div>
        </div>
    )
}

export default DescriptionAccordion