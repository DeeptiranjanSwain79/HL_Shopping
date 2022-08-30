import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import Sidebar from "./Sidebar.js";
import "./Dashboard.css";
import { Typography } from '@mui/material';
import { Link } from "react-router-dom";
import 'chart.js/auto';
import { Chart, Doughnut } from 'react-chartjs-2';
import { getAdminProduct } from "../../actions/productAction";
import MetaData from '../layout/MetaData';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';

const Dashboard = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllOrders());
        dispatch(getAllUsers())
    }, [dispatch])

    const { products } = useSelector(state => state.products);
    const { order } = useSelector(state => state.allOrders);
    const { users } = useSelector(state => state.allUsers)

    let totalAmount = 0;
    order &&
        order.orders.forEach(item => {
            totalAmount += item.totalPrice
        })

    let outOfStock = 0;
    products &&
        products.forEach(item => {
            if (item.stock <= 0) {
                outOfStock++;
            }
        })


    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;

    const chartData = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["deepskyblue"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, totalAmount],
            },
        ],
    };

    const doughnutState = {
        labels: ["Out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, (products.length - outOfStock)],
            },
        ],
    };

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <div className="dashboard">
                    <MetaData title="Admin Panel | HL Shopping" />
                    <Sidebar />
                    <div className="dashboardContainer">
                        <Typography component="h1">Dashboard</Typography>

                        <div className="dashboardSummary">
                            <div>
                                <p>
                                    Total Amount <br />
                                    ₹{totalAmount}
                                </p>
                            </div>
                            <div className="dashboardSummaryBox2">
                                <Link to="/admin/products">
                                    <p>Product</p>
                                    <p>{products && products.length}</p>
                                </Link>

                                <Link to="/admin/orders">
                                    <p>Orders</p>
                                    <p>{order && order.orders.length}</p>
                                </Link>

                                <Link to="/admin/users">
                                    <p>Users</p>
                                    <p>{users && users.length}</p>
                                </Link>
                            </div>
                        </div>

                        <div className="lineChart">
                            <Chart type='line' data={chartData} />
                        </div>

                        <div className="doughnutChart">
                            <Doughnut data={doughnutState} />
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default Dashboard
