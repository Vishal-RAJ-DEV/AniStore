import { useSelector, useDispatch } from "react-redux"
import {
  addToFavorites,
  removeFromFavorites,
  loadUserFavorites
} from "../../redux/features/favorites/favoriteSlice"
import {
  getLocalStorageFavorites,
  addFavotiteToLocalStorage,
  removeFavoriteFromLocalStorage
} from "../../utils/LocalStorage"
import { useEffect, useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from "react-router-dom"

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const Favorites = useSelector((state) => state.favorites) || [];
  const { userInfo } = useSelector((state) => state.auth);
  const isFavorite = Favorites.find((items) => items._id === product._id);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load user-specific favorites when component mounts or user changes
    if (userInfo) {
      dispatch(loadUserFavorites(userInfo._id));
    }
  }, [dispatch, userInfo])

  const toggleFavoriteButton = () => {
    // Check if user is logged in
    if (!userInfo) {
      toast.error('Please login to add items to favorites');
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isFavorite) {
      dispatch(removeFromFavorites({ ...product, userId: userInfo._id }));
      removeFavoriteFromLocalStorage(product, userInfo._id);
      toast.info("Removed from favorites");
    } else {
      dispatch(addToFavorites({ ...product, userId: userInfo._id }));
      addFavotiteToLocalStorage(product, userInfo._id);
      toast.success("Added to favorites");
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent link navigation if inside a Link component
        e.stopPropagation(); // Stop event from bubbling up
        toggleFavoriteButton();
      }}
      className={`absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 shadow-lg hover:scale-110 z-10 ${isAnimating ? 'scale-125' : ''
        }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <FaHeart
          className="text-[#ff6b9d]"
          size={16}
        />
      ) : (
        <FaRegHeart
          className="text-gray-600 hover:text-[#ff6b9d] transition-colors"
          size={16}
        />
      )}
    </button>
  )
}

export default HeartIcon