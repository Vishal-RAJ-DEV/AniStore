const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

const updateCart = (state) => {
    //calculate the items price 
    state.itemsPrice = addDecimal( //this will ensure two decimal places 
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )

    //calculate shipping price
    state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 10);

    //calcuate the tax price 
    state.taxPrice = addDecimal(Number((0.15 * state.itemsPrice).toFixed(2)));

    //calcuate the total price 
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2) // Fixed: Added missing closing parenthesis

    //save to local storage - save the entire state, not just cartItems so that other details like itemsPrice are also preserved
    localStorage.setItem("cartItems", JSON.stringify(state));

    return state;
}

export { updateCart };