import React from 'react';
import "./PageNotFound.css"
import { Link } from 'react-router-dom';
import pageNotFound from "../../../images/pageNotFound.png";

const PageNotFound = () => {
  return (
    <div className='pageNotFoundContainer'>
      <img src={pageNotFound} alt="" />
      <Link to="/">Home</Link>
    </div>
  )
}

export default PageNotFound
