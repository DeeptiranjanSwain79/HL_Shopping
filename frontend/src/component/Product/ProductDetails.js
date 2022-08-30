import React, { Fragment, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReviewCard from "./ReviewCard.js"
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { addItemsToCart } from "../../actions/cartAction";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { NEW_REVIEW_RESET } from '../../constants/productContants';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { id } = useParams();

    const { products, loading, error } = useSelector(state => state.productDetails)
    const { success, error: reviewError } = useSelector(state => state.newReview)

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increaseQuantity = () => {
        if ((products.stock) <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        if (quantity <= 1) return;

        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item added to cart successfully");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors);
        }

        if (success) {
            alert.success("Review submitted successfully");
            dispatch({ type: NEW_REVIEW_RESET });
            dispatch(getProductDetails(id)); 
        }
        dispatch(getProductDetails(id));       //same as backend "req.params.id" in fronend 
    }, [dispatch, id, error, alert, reviewError, success]);


    const options = {
        size: "large",
        value: products.ratings,
        readOnly: true,
        precision: 0.5
    }
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`${products.name} | HL Shopping`} />
                    <div className="productDetails">
                        <Carousel>
                            {
                                products.images &&
                                products.images.map((item, i) => (
                                    <img
                                        className="CarouselImage"
                                        key={item.url}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))
                            }
                        </Carousel>
                        <div>
                            <div className="detailsBlock-1">
                                <h2>{products.name}</h2>
                                <p>Product # {products._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span>({products.numOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3" align="left">
                                <h1>{`₹${products.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>{" "}
                                    <button disabled={(products.stock < 1) ? true : false} onClick={addToCartHandler}>Add to Cart</button>
                                </div>
                                <p>
                                    Status: {" "}
                                    <b className={(products.stock < 1) ? "redColor" : "greenColor"}>
                                        {(products.stock < 1) ? "Out Of Stock" : "Available"}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                Description : <p>{products.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                        </div>
                    </div>


                    <h3 className="reviewHeading">REVIEWS</h3>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={e => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />
                            <textarea
                                className='submitDialogTextArea'
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            ></textarea>
                            <DialogActions>
                                <Button color="secondary" onClick={submitReviewToggle} >Cancel</Button>
                                <Button color="primary" onClick={reviewSubmitHandler}>Submit</Button>
                            </DialogActions>
                        </DialogContent>

                    </Dialog>

                    {(products.reviews && products.reviews[0]) ? (
                        <div className="reviews">
                            {products.reviews &&
                                products.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductDetails
