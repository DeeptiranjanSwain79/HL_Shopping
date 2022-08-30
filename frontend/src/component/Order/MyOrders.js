import React, { Fragment } from 'react';
import LoginSignUp from '../User/LoginSignUp';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import "./MyOrders.css";
import { clearErrors, myOrders } from '../../actions/orderAction';
import Loader from '../layout/Loader/Loader';
// import { Link } from '@mui/icons-material';
import { useAlert } from 'react-alert';
import { Typography } from '@mui/material';
import MetaData from '../layout/MetaData';
import { Launch } from '@mui/icons-material';
import { useEffect } from 'react';


const MyOrders = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const { loading, error, order } = useSelector(state => state.myOrders);

    const dispatch = useDispatch();
    const alert = useAlert();


    const columns = [
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
            minWidth: 150,
            flex: 0.3,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <a href={`/order/${params.getValue(params.id, "id")}`}>
                        <Launch />
                    </a>
                );
            }
        }
    ]
    const rows = [];

    order &&
        order.orders.forEach((item, index) => {
            rows.push({
                itemQty: item.orderItems.length,
                id: item._id,
                status: item.orderStatus,
                amount: item.totalPrice,
            })
        });

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    }, [dispatch, alert, error])

    return (
        <Fragment>
            {!isAuthenticated ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`${user.data.user.name} | Orders`} />
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="myOrdersPage">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                // pageSize={10}
                                disableSelectionOnClick
                                className='myOrdersTable'
                                autoHeight
                            />
                            <Typography id="myOrdersHeading">{user.data.user.name}'s Orders</Typography>
                        </div>
                    )}
                </Fragment>
            )}

        </Fragment>
    )
}

export default MyOrders
