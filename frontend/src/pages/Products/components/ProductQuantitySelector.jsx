import { FaMinus, FaPlus } from 'react-icons/fa'

const ProductQuantitySelector = ({ product , qty , setQty }) => {
    return (
        <div className="space-y-3">
            <label className="text-white font-semibold text-lg">Quantity</label>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                >
                    <FaMinus size={14} />
                </button>
                <span className="text-white font-bold text-2xl w-16 text-center">
                    {qty}
                </span>
                <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    disabled={qty >= product.countInStock}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                >
                    <FaPlus size={14} />
                </button>
            </div>
            <p className="text-gray-400 text-sm">
                Maximum available: {product.countInStock}
            </p>
        </div>
    )
}

export default ProductQuantitySelector