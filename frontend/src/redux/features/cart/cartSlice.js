import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../utils/cartUtils";

const getInitialState = () => {
    try {
        const storedData = localStorage.getItem("cartItems");
        if (storedData) {
            const parsed = JSON.parse(storedData);
            
            // Check if parsed is an array (old format) or object (new format)
            if (Array.isArray(parsed)) {
                // Old format - just cartItems array
                return {
                    cartItems: parsed,
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    shippingAddress: {},
                    paymentMethod: 'PayPal',
                    totalPrice: 0,
                };
            } else {
                // New format - full state object
                return {
                    cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
                    itemsPrice: parsed.itemsPrice || 0,
                    shippingPrice: parsed.shippingPrice || 0,
                    taxPrice: parsed.taxPrice || 0,
                    shippingAddress: parsed.shippingAddress || {},
                    paymentMethod: parsed.paymentMethod || 'PayPal',
                    totalPrice: parsed.totalPrice || 0,
                };
            }
        }
    } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
    }
    
    // Default state
    return {
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        shippingAddress: {},
        paymentMethod: 'PayPal',
        totalPrice: 0,
    };
};

const initialState = getInitialState();

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers :{
        addTOCart : (state , action) =>{
            const { user , rating , numReview , ...items} = action.payload; 
            
            const existItems = state.cartItems.find( (x) => x._id === items._id );

            if( existItems ){
                // If item exists, find index and update quantity directly
                const itemIndex = state.cartItems.findIndex((x) => x._id === items._id);
                state.cartItems[itemIndex].qty += items.qty;
            }else{
                // Add new item to cart
                state.cartItems.push(items);
            }

            //update cart
            return updateCart(state , items);
        },

        removeCart : ( state , action ) =>{
            // Find and remove the item
            const itemIndex = state.cartItems.findIndex((x) => x._id === action.payload._id);
            if (itemIndex > -1) {
                state.cartItems.splice(itemIndex, 1);
            }

            //update cart
            return updateCart(state);
        },

        saveShippingAddress : ( state , action ) =>{
            state.shippingAddress = action.payload;
            localStorage.setItem( "cartItems" , JSON.stringify(state) );
        },
        savePaymentMethod : ( state , action ) =>{
            state.paymentMethod = action.payload;
            localStorage.setItem( "cartItems" , JSON.stringify(state) );
        },

        clearCartItems : ( state ) =>{
            state.cartItems.splice(0);
            localStorage.setItem("cartItems", JSON.stringify(state));
        },

        resetCart : ( state ) =>{
            state.cartItems.splice(0);
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.taxPrice = 0;
            state.totalPrice = 0;
            state.shippingAddress = {};
            state.paymentMethod = 'PayPal';
            localStorage.setItem("cartItems", JSON.stringify(state));
        }
    }

});

export const {
    addTOCart,
    removeCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
    resetCart
} = cartSlice.actions;

export default cartSlice.reducer;