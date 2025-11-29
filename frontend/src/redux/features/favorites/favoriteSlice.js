import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: [],
    reducers:{
        addToFavorites: (state, action) => {
            const products = action.payload;
            const exists = state.find((items) => items._id === products._id);
            if(!exists){
                state.push(products);
            }
        },
        removeFromFavorites : (state , action) =>{
            const product = action.payload;
            return state.filter((items) => items._id !== product._id);
        },
        setFavorites : (state , action ) =>{
            //this will replace the current state with the payload
            return action.payload;
        }
    }
})

export const {addToFavorites , removeFromFavorites , setFavorites} = favoriteSlice.actions;
export default favoriteSlice.reducer;