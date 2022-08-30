import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Search.css";
import MetaData from '../layout/MetaData';

const Search = ({ history }) => {
    const [keyword, setKeyWord] = useState("");
    const navigate = useNavigate();

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
        } else {
            navigate('/products');
        }
    }

    return (
        <Fragment>
            <MetaData title={"Search a Product | HL Shopping"} />
            <form onSubmit={searchSubmitHandler} className="searchBox">
                <input
                    type="text"
                    placeholder='Search a Product...'
                    onChange={(e) => setKeyWord(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </Fragment>
    )
}

export default Search
