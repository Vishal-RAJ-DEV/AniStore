import { useSelector , useDispatch } from "react-redux"
import { addToFavorites, removeFromFavorites , setFavorites } from "../../redux/features/favorites/favoriteSlice"
import { getLocalStorageFavorites , addFavotiteToLocalStorage , removeFavoriteFromLocalStorage } from "../../utils/LocalStorage"
import { useEffect } from "react"

const HeartIcon = () => {
    const dispatch = useDispatch();
    const Favorites  = useSelector((state) => state.favorites) || [];
    const isFavorite = Favorites.find((items) => items._id === product._id);

    

  return (
    <div>HeartIcon</div>
  )
}

export default HeartIcon