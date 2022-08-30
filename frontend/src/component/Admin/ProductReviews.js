import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import "./ProductReviews.css";
import { DataGrid } from '@mui/x-data-grid';
import {
    getAllReviews,//eslint-disable-next-line
    deleteReview,
    clearErrors
} from '../../actions/productAction';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { Button } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from "./Sidebar.js";
import { DELETE_REVIEW_RESET } from '../../constants/productContants';

const ProductReviews = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;
    const { error, reviews, loading } = useSelector(state => state.productReviews);
    const { error: deleteError, isDeleted } = useSelector(state => state.review);

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const [productId, setProductId] = useState("")

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReview(reviewId, productId));
    }

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();

        dispatch(getAllReviews(productId))
    }

    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId))
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Review  deleted successfully");
            navigate("/admin/reviewss");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, error, alert, isDeleted, deleteError, navigate, productId])

    const column = [
        { field: "id", headerName: "Review Id", minWidth: 200, flex: 0.7 },
        {
            field: "user",
            headerName: "User",
            minWidth: 170,
            flex: 0.7,
        },

        {
            field: "comment",
            headerName: "Comment",
            minWidth: 550,
            flex: 1,
        },

        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 100,
            flex: 0.2,
        },

        {
            field: "actions",
            flex: 0.2,
            headerName: "Actions",
            minWidth: 100,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button
                            onClick={() =>
                                deleteReviewHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ]

    const row = [];

    reviews &&
        reviews.forEach(item => {
            row.push({
                id: item._id,
                rating: item.rating,
                comment: item.comment,
                user: item.name
            })
        })
    // console.log(products);

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`All Reviews | Admin`} />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="productReviewsContainer" style={{ display: "block" }}>

                            <form
                                encType='multipart/form-data'
                                className="productReviewsForm"
                                onSubmit={productReviewsSubmitHandler}
                            >
                                <h1 className='productReviewsFormHeading'>All Reviews</h1>

                                <div>
                                    <StarIcon />
                                    <input
                                        type="text"
                                        placeholder="Product ID"
                                        value={productId}
                                        onChange={e => setProductId(e.target.value)}
                                    />
                                </div>

                                <Button
                                    id='createProductBtn'
                                    type="submit"
                                    disble={loading ? true : false || role === "" ? true : false}
                                >
                                    Search
                                </Button>
                            </form>

                            <h1 id='productListHeading'>All Reviews</h1>

                            {(reviews && reviews.length > 0) ?
                                (<DataGrid
                                    rows={row}
                                    columns={column}
                                    disableSelectionOnClick
                                    className='productListTable'
                                // autoHeight
                                />) : (
                                    <h1 className="productReviewsFormHeading">No Reviews yet</h1>
                                )}
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductReviews
