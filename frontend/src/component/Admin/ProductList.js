import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import "./ProductList.css";
import { DataGrid } from '@mui/x-data-grid';
import {
    clearErrors,
    deleteProduct,
    getAdminProduct
} from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from "./Sidebar.js";
import { DELETE_PRODUCT_RESET } from '../../constants/productContants';

const ProductList = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;
    const { error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const deleteProductHandler = id => {
        dispatch(deleteProduct(id));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Product deleted successfully");
            navigate("/admin/products");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProduct());
    }, [dispatch, error, alert, isDeleted, deleteError, navigate])

    const column = [
        { field: "id", headerName: "Product Id", minWidth: 200, flex: 0.7 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: params => {
                return (
                    <Fragment>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ]

    const row = [];

    products &&
        products.forEach(item => {
            row.push({
                id: item._id,
                stock: item.stock,
                price: item.price,
                name: item.name
            })
        })
    // console.log(products);

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`All Products | Admin`} />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="productListContainer">
                            <h1 id='productListHeading'>All Products</h1>

                            <DataGrid
                                rows={row}
                                columns={column}
                                disableSelectionOnClick
                                className='productListTable'
                            // autoHeight
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductList
