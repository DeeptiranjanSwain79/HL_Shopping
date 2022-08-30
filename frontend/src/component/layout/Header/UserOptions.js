import React, { Fragment, useState } from 'react'
import "./HeaderU.css";
import { Backdrop } from '@mui/material';
import { SpeedDialAction, SpeedDial } from '@mui/material';
import { DashboardOutlined } from '@mui/icons-material';
import { PersonOutline } from '@mui/icons-material';
import { ExitToAppOutlined } from '@mui/icons-material';
import { ShoppingCart } from '@mui/icons-material';
import { ListAltOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../../actions/userAction";

const UserOptions = ({ user }) => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart)

    const options = [
        { icon: <ListAltOutlined />, name: "Orders", func: orders },
        { icon: <PersonOutline />, name: "Profile", func: account },
        { icon: <ShoppingCart />, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppOutlined />, name: "Logout", func: logoutUser }
    ]

    if (user.data.user.role === "admin") {
        options.unshift({ icon: <DashboardOutlined />, name: "Dashboard", func: dashboard })      //Add an element at the 1st positionof the array
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }

    function orders() {
        navigate("/orders")
    }

    function account() {
        navigate("/account");
    }

    function cart() { 
        navigate("/cart");
    }

    function logoutUser() {
        dispatch(logout());
        alert.success("Logged Out Successfully")
    }


    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "0" }} />
            <SpeedDial
                ariaLabel='SpeedDial tooltip example'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "1" }}
                open={open}
                direction="down"
                className='speedDial'
                icon={
                    <img
                        className='speedDialIcon'
                        src={(user.data.user.avatar.url) ? (user.data.user.avatar.url) : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >

                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions
