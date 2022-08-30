import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from './CheckoutSteps';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import { Typography } from '@mui/material';
import { useAlert } from 'react-alert';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    Elements
} from "react-stripe-elements";
import axios from 'axios';
import "./Payment.css";
import LoginSignUp from '../User/LoginSignUp';
import { MdCreditCard } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { MdVpnKey } from "react-icons/md";
import { createOrder, clearErrors } from '../../actions/orderAction';

const Payment = () => {

    const { isAuthenticated } = useSelector(state => state.user);
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { error } = useSelector(state => state.newOrder);

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const payBtn = useRef(null);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100) //TO convert them to Paisa from Ruppee
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;
            console.log(client_secret);

            order.paymentInfo = {
                id: `${Math.floor((Math.random() * 100000) + 1)}`,
                status: "succeeded"
            };

            dispatch(createOrder(order));

        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        } finally {
            navigate("/success");
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }
    }, [dispatch, error, alert])

    return (
        <Fragment>
            {!isAuthenticated ? (
                <LoginSignUp />
            ) : (
                <Elements stripe="pk_test_51LUVg8SJg6C6AJ2flgbg37CNZ9nXcXgSvQlxzOdjQWxpKyvbaeAE422hs1WucdczuuUwRvFo97qTw5PZVSXsW36800MDobzCLO">
                    <Fragment>
                        <MetaData title="Payment | HL Shopping" />
                        <CheckoutSteps activeStep={2} />
                        <div className="paymentContainer">
                            <form onSubmit={(e) => submitHandler(e)} className="paymentForm">
                                <Typography>Card Info</Typography>
                                <div>
                                    <MdCreditCard />
                                    <CardNumberElement className='paymentInput' />
                                </div>
                                <div>
                                    <MdEvent />
                                    <CardExpiryElement className='paymentInput' />
                                </div>
                                <div>
                                    <MdVpnKey />
                                    <CardCvcElement className='paymentInput' />
                                </div>
                                <input
                                    type="submit"
                                    value={`Pay ₹${orderInfo && orderInfo.totalPrice}`}
                                    ref={payBtn}
                                    className="paymentFormBtn"
                                />
                            </form>
                        </div>
                    </Fragment>
                </Elements>
            )}

        </Fragment >
    )
}

export default Payment
