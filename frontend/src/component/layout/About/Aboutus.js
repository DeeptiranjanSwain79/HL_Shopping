import React from 'react';
import me from "../../../images/me.jpg";
import twitter from "../../../images/twitter.png";
import linkedin from "../../../images/linkedin.png";
import "./Aboutus.css"

const Aboutus = () => {
    return (
        <div className='aboutus'>
            <div className="content">
                <div className='about-1'>
                    <a href="https://www.linkedin.com/in/deeptiranjan-swain-463357221/" about='_blank'>
                        <img src={me} alt="Mr. Deeptiranjan Swain" />
                    </a>
                </div>
                <div className='about-2'>
                    <a href="https://twitter.com/Deeptiranjan777" about='_blank'>
                        <img src={twitter} alt="Twitter" />
                    </a>
                    <a href="https://www.linkedin.com/in/deeptiranjan-swain-463357221/" about='_blank'>
                        <img src={linkedin} alt="Linkedin" />
                    </a>
                </div>
                <div className="about-3">
                    <p>HL Shopping is simple E-commerce application developed by Deeptiranjan Swain. It's a dummy project and also my 1st E-commerce Application</p>
                </div>
            </div>
        </div>
    )
}

export default Aboutus
