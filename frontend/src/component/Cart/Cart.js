import React, { Fragment } from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Link, useNavigate } from 'react-router-dom';
import { MdRemoveShoppingCart } from "react-icons/md";
import Typography from '@mui/material/Typography';


const Cart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(state => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty))
  }

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty))
  }

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  }

  const checkoutHandler = () => {
    navigate("/shipping")
  }

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <MdRemoveShoppingCart />

          <Typography>No products in your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems && cartItems.map((item) => (
              <div className="cartContainer" key={item.product}>
                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                <div className="cartInput">
                  <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                  <input type="number" readOnly value={item.quantity} />
                  <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                </div>

                <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
              </div>
            ))}

            <div className="cartGrossTotal">
              <div></div>
              <div className="cartGrossTotalBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(    //reduce function implements a single function for all elements of the array
                  (total, item) => total + (item.quantity * item.price),
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Cart
