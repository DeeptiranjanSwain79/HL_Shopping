import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import "./ProductList.css";
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from "./Sidebar.js";
import { getAllOrders, clearErrors, deleteOrder } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstant';

const OrderList = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;
    const { error, order } = useSelector(state => state.allOrders);
    const {error: deleteError, isDeleted} = useSelector(state => state.order);

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const deleteOrderHandler = id => {
        dispatch(deleteOrder(id));
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
            alert.success("Order deleted successfully");
            navigate("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
        }

        dispatch(getAllOrders());
    }, [dispatch, error, alert, navigate, deleteError, isDeleted])

    const column = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: params => {
                return params.getValue(params.id, "Status") === "Delivered"
                    ? "greenColor"
                    : "redColor"
            }
        },
        {
            field: "itemQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.3
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.7
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
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ]

    const row = [];

    order &&
        order.orders.forEach(item => {
            row.push({
                id: item._id,
                itemQty: item.orderItems.length,
                amount: item.totalPrice,
                status: item.orderStatus
            })
        })
    // console.log(products);

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`All Orders | Admin`} />
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

export default OrderList
