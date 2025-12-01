import React from 'react'
import { useSelector } from 'react-redux'


const FavoritesCount = () => {
    const favorites = useSelector((state) => state.favorites)
    const favoritesCount = favorites.length

    if (favoritesCount === 0) return null
    return (
        <div className="absolute top-3 -right-1 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg animate-pulse">
            {favoritesCount > 9 ? '9+' : favoritesCount}
        </div>
    )
}

export default FavoritesCount