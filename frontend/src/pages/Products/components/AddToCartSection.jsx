import { FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { addTOCart } from '../../../redux/features/cart/cartSlice'
import { toast } from 'react-toastify'

const AddToCartSection = ({ product  , qty }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.auth);
    
    const addToCartHandler = () => {
        // Check if user is logged in
        if (!userInfo) {
            toast.error('Please login to add items to cart');
            // Redirect to login page with current path as redirect parameter
            navigate(`/login?redirect=${location.pathname}`);
            return;
        }

        // Add to cart if user is authenticated
        dispatch(addTOCart({
            ...product,
            qty: qty,
            userId: userInfo._id
        }))
        toast.success(`"${product.name}" added to cart`);
    }

    const buyNowHandler = () => {
        // Check if user is logged in for buy now as well
        if (!userInfo) {
            toast.error('Please login to proceed with purchase');
            navigate(`/login?redirect=${location.pathname}`);
            return;
        }
        
        // TODO: Redux + Navigation logic
        console.log('Buy now')
    }

    if (product.countInStock === 0) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                <p className="text-red-400 font-semibold text-lg">
                    This product is currently out of stock
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Add to Cart + Wishlist + Share */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={addToCartHandler}
                    className="flex-1 bg-white hover:bg-gray-100 text-black py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                    <FaShoppingCart />
                    <span>Add To Cart</span>
                </button>

                <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white p-4 rounded-full transition-all border border-gray-700">
                    <FaHeart size={20} />
                </button>

                <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white p-4 rounded-full transition-all border border-gray-700">
                    <FaShare size={20} />
                </button>
            </div>

            {/* Buy Now Button */}
            <button
                onClick={buyNowHandler}
                className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] hover:from-[#ff5c92] hover:to-[#ff7a99] text-white py-5 rounded-full font-bold text-xl transition-all shadow-xl transform hover:scale-[1.02]"
            >
                Buy It Now
            </button>
        </div>
    )
}

export default AddToCartSection