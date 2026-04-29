import React from 'react'
import { useSelector } from 'react-redux'


const FavoritesCount = () => {
    const favorites = useSelector((state) => state.favorites)
    const { userInfo } = useSelector((state) => state.auth)
    const favoritesCount = favorites.length

    // Only show count if user is logged in and has favorites
    if (!userInfo || favoritesCount === 0) return null
    
    return (
        <div className="absolute top-3 -right-1 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg animate-pulse">
            {favoritesCount > 9 ? '9+' : favoritesCount}
        </div>
    )
}

export default FavoritesCount