import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO
} from "../constants/cartConstant";
import axios from "axios";

//Adding items to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {

    const data = await axios.get(`/api/v1/product/${id}`);
    // console.log(data)

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.data.product._id,
            name: data.data.product.name,
            price: data.data.product.price,
            image: data.data.product.images[0].url,
            stock: data.data.product.stock,
            quantity
        }
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}


//Remove from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

//Save Shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem("shippingInfo", JSON.stringify(data));
}