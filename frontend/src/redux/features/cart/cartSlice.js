import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../utils/cartUtils";

const getPersistUserId = (payloadUserId) => {
    if (payloadUserId) return payloadUserId;

    try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return null;

        const parsedUserInfo = JSON.parse(userInfo);
        return parsedUserInfo?._id || null;
    } catch (error) {
        console.error('Error reading user info from localStorage:', error);
        return null;
    }
};

const getInitialStateForUser = (userId) => {
    if (!userId) {
        // If no user is logged in, return empty cart
        return {
            cartItems: [],
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            shippingAddress: {},
            paymentMethod: 'PayPal',
            totalPrice: 0,
        };
    }

    try {
        const storedData = localStorage.getItem(`cartItems_${userId}`);
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

// Initialize with empty cart (will be loaded when user logs in)
const initialState = {
    cartItems: [],
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    shippingAddress: {},
    paymentMethod: 'PayPal',
    totalPrice: 0,
};

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers :{
        addTOCart : (state , action) =>{
            const { user , rating , numReview , userId, ...items} = action.payload; 
            
            const existItems = state.cartItems.find( (x) => x._id === items._id );

            if( existItems ){
                // If item exists, find index and update quantity directly
                const itemIndex = state.cartItems.findIndex((x) => x._id === items._id);
                state.cartItems[itemIndex].qty += items.qty;
            }else{
                // Add new item to cart
                state.cartItems.push(items);
            }

            //update cart and save to user-specific storage
            const updatedState = updateCart(state , items);
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedState));
            }
            return updatedState;
        },

        removeCart : ( state , action ) =>{
            // Find and remove the item
            const itemIndex = state.cartItems.findIndex((x) => x._id === action.payload._id);
            if (itemIndex > -1) {
                state.cartItems.splice(itemIndex, 1);
            }

            //update cart and save to user-specific storage
            const updatedState = updateCart(state);
            const userId = action.payload.userId;
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedState));
            }
            return updatedState;
        },

        saveShippingAddress : ( state , action ) =>{
            state.shippingAddress = action.payload;
            const userId = getPersistUserId(action.payload.userId);
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(state));
            }
        },
        savePaymentMethod : ( state , action ) =>{
            state.paymentMethod = action.payload;
            const userId = getPersistUserId();
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(state));
            }
        },

        loadUserCart: (state, action) => {
            const userId = action.payload;
            const userCart = getInitialStateForUser(userId);
            return userCart;
        },

        clearCartOnLogout: (state, action) => {
            // Save current cart to user-specific localStorage before clearing state
            const userId = action.payload;
            if (userId && state.cartItems.length > 0) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(state));
            }
            
            // Clear the Redux state (but preserve data in localStorage for logged-in users)
            state.cartItems = [];
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.taxPrice = 0;
            state.totalPrice = 0;
            state.shippingAddress = {};
            state.paymentMethod = 'PayPal';
        },

        clearCartItems : ( state , action ) =>{
            state.cartItems.splice(0);
            const userId = action.payload?.userId;
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(state));
            }
        },

        resetCart : ( state , action ) =>{
            state.cartItems.splice(0);
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.taxPrice = 0;
            state.totalPrice = 0;
            state.shippingAddress = {};
            state.paymentMethod = 'PayPal';
            const userId = action.payload?.userId;
            if (userId) {
                localStorage.setItem(`cartItems_${userId}`, JSON.stringify(state));
            }
        }
    }

});

export const {
    addTOCart,
    removeCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
    resetCart,
    loadUserCart,
    clearCartOnLogout
} = cartSlice.actions;

export default cartSlice.reducer;
