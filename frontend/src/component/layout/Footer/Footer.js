import React from 'react';
import "./Footer.css";
import "../../../App.css";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";

const Footer = () => {
    return (
        <footer className='bg-dark'>
            <div className="leftFooter">
                <h1>DOWNLOAD OUR APP</h1>
                <p>Download our app</p>
                <img src={playStore} alt="Play Store" />
                <img src={appStore} alt="App Store" />
            </div>
            <div className="midFooter">
                <h1 className="cursor-pointer">HL Shopping</h1>
                <p>Market &nbsp; of &nbsp; Masters</p>
                <p>Copyright 2022 &copy; <a href="https://www.linkedin.com/in/deeptiranjan-swain-463357221/" className="text-decoration-none text-light">DEEPTIRANJAN SWAIN</a></p>
            </div>
            <div className="rightFooter">
                <h4>Follw Us</h4>
                <div>
                    <a href="https://www.linkedin.com/in/deeptiranjan-swain-463357221/" target={"blank"} className='text-decoration-none icon'>
                        <i className="cursor-pointer fa fa-linkedin"></i>
                    </a>
                    <a href="https://twitter.com/Deeptiranjan777" target={"blank"} className='text-decoration-none icon'>
                        <i className="cursor-pointer fa fa-twitter"></i>
                    </a>
                    <a href="https://www.facebook.com/deeptiranjan.swain.777" target={"blank"} className='text-decoration-none icon'>
                        <i className="cursor-pointer fa fa-facebook-f "></i>
                    </a>
                    <a href="https://www.instagram.com/deeptiranjan79/" target={"blank"} className='text-decoration-none icon'>
                        <i className="cursor-pointer fa fa-instagram "></i>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
