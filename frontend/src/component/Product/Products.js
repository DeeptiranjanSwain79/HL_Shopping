import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { Typography, Slider } from '@mui/material';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';

const categories = [
    "Laptop",
    "Footwear",
    "Pant",
    "Shirt",
    "Attire",
    "Camera",
    "SmartPhone",
];

const Products = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 500000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    
    const { products, loading, error, productsCount, resultPerPage } = useSelector(
        (state) => state.products
    );

    const { keyword } = useParams();

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error])
    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>

                    <MetaData title="PRODUCTS | HL Shopping" />
                    
                    <h2 className="productHeading">Products</h2>
                    <div className="products">
                        {products &&
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        }
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slicer"
                            min={0}
                            max={150000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => {
                                return <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            })}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slicer"
                                min={0}
                                max={5}
                                valueLabelDisplay="auto"
                            />
                        </fieldset>
                    </div>

                    {(resultPerPage < productsCount) && (
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                // nextPageText="Next"
                                // prevPageText="Prev"
                                firstPageText="First"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default Products
