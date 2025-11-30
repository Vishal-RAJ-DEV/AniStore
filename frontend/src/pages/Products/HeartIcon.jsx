import { useSelector, useDispatch } from "react-redux"
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites
} from "../../redux/features/favorites/favoriteSlice"
import {
  getLocalStorageFavorites,
  addFavotiteToLocalStorage,
  removeFavoriteFromLocalStorage
} from "../../utils/LocalStorage"
import { useEffect, useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { toast } from 'react-toastify'

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const Favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = Favorites.find((items) => items._id === product._id);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // On component mount, load favorites from local storage
    const localFavorites = getLocalStorageFavorites();
    dispatch(setFavorites(localFavorites));
  }, [dispatch])

  const toggleFavoriteButton = () => {
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product);
      toast.info("Removed from favorites");
    } else {
      dispatch(addToFavorites(product));
      addFavotiteToLocalStorage(product);
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