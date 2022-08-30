import React from 'react';
import "../../../App.css";
import './Header.css';
import logo from "../../../images/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
    // const closeHeader = () => {
    //     document.getElementsByClassName("wrapper").style.display = "none";
    // }

    return (
        <div id='nav'>
            <input type="checkbox" id="active" />
            <label htmlFor="active" className="menu-btn"><i className="fa fa-bars"></i></label>
            <div className="wrapper">
                <ul>
                    <li><img src={logo} alt="" id='logo'/></li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li>
                        <Link to="/search"><i className="fa fa-search fs-3 mx-3 cursor-pointer"></i></Link>
                        <Link to="/cart"><i className="fa fa-shopping-cart fs-3 mx-3 cursor-pointer"></i></Link>
                        <Link to="/login"><i className="fa fa-user-circle fs-3 mx-3 cursor-pointer"></i></Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Header
