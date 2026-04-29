import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: [],
    reducers:{
        addToFavorites: (state, action) => {
            const { userId, ...product } = action.payload;
            const exists = state.find((items) => items._id === product._id);
            if(!exists){
                state.push(product);
                // Save to user-specific localStorage
                if (userId) {
                    const currentFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
                    if (!currentFavorites.find(item => item._id === product._id)) {
                        currentFavorites.push(product);
                        localStorage.setItem(`favorites_${userId}`, JSON.stringify(currentFavorites));
                    }
                }
            }
        },
        removeFromFavorites : (state , action) =>{
            const { userId, ...product } = action.payload;
            const filteredState = state.filter((items) => items._id !== product._id);
            // Save to user-specific localStorage
            if (userId) {
                localStorage.setItem(`favorites_${userId}`, JSON.stringify(filteredState));
            }
            return filteredState;
        },
        setFavorites : (state , action ) =>{
            //this will replace the current state with the payload
            return action.payload;
        },
        loadUserFavorites: (state, action) => {
            const userId = action.payload;
            if (userId) {
                const userFavorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
                return userFavorites;
            }
            return [];
        },
        clearFavoritesOnLogout: (state, action) => {
            // Save current favorites to user-specific localStorage before clearing state
            const userId = action.payload;
            if (userId && state.length > 0) {
                localStorage.setItem(`favorites_${userId}`, JSON.stringify(state));
            }
            
            // Clear the Redux state (but preserve data in localStorage for logged-in users)
            return [];
        }
    }
})

export const {addToFavorites , removeFromFavorites , setFavorites, loadUserFavorites, clearFavoritesOnLogout} = favoriteSlice.actions;
export default favoriteSlice.reducer;