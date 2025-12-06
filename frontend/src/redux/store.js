import {configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './api/apiSlice'
import authReducer from './features/auth/authslice'
import favoriteReducer from './features/favorites/favoriteSlice'
import { getLocalStorageFavorites } from '../utils/LocalStorage'
import cartReducer from './features/cart/cartSlice'

const initialFavorites = getLocalStorageFavorites() || [];

const store  = configureStore ({
    reducer :{ 
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth : authReducer,
        favorites : favoriteReducer,
        cart : cartReducer,
    },

    preloadedState :{
        favorites : initialFavorites,
    },


    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools : true,
})

setupListeners(store.dispatch)

export default store