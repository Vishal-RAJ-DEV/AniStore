import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    catogories : [],
    product : [],
    checked : [],
    brands : [],
    radio : [],
    brandcheckBox : [],
    checkedBrands : []
};

const shopSlice = createSlice({
    name :  'shop',
    initialState,
    reducers :{
        setCategories : ( state , action) =>{
            state.catogories = action.payload;
        },
        setProducts : ( state , action ) =>{
            state.product = action.payload;
        },
        setChecked: ( state , action) =>{
            state.checked = action.payload;
        },
        setSelectedBrands : ( state , action) =>{
            state.brands = action.payload;
        },
        setRadio : ( state , action) =>{
            state.radio = action.payload;
        }
    }
});

export const {
    setCategories,
    setProducts,
    setChecked,
    setSelectedBrands,
    setRadio   
} = shopSlice.actions;

export default shopSlice.reducer;