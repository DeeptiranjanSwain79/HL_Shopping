import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import { useNavigate } from 'react-router-dom';
import "./newProduct.css";
import { createProduct, clearErrors } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Sidebar from './Sidebar';
import { NEW_PRODUCT_RESET } from '../../constants/productContants';

const NewProduct = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, success } = useSelector(state => state.newProduct);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePrevierw] = useState([]);

    const categories = [
        "Laptop",
        "Footwear",
        "Pant",
        "Shirt",
        "Attire",
        "Camera",
        "SmartPhone"
    ];

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Product created Successfully");
            navigate("/admin/dashboard");
            dispatch({type: NEW_PRODUCT_RESET})
        }
    }, [dispatch, alert, error, navigate, success]);

    const createProductSubmitHandler = e => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        image.forEach(image => {
            myForm.append("images", image);
        });
        dispatch(createProduct(myForm));
    }

    const createProductImagesChange = e => {
        const files = Array.from(e.target.files);

        setImage([]);
        setImagePrevierw([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2){
                    setImagePrevierw(old => [...old, reader.result]);
                    setImage(old => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`Create new product`} />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="newProductContainer">
                            <form 
                            encType='multipart/form-data' 
                            className="createProductForm"
                            onSubmit={createProductSubmitHandler}
                            >
                                <h1>Create Product</h1>

                                <div>
                                    <SpellcheckIcon />
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        required
                                        value={name}
                                        onChange=
                                        {e => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <CurrencyRupeeIcon />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        required
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <DescriptionIcon />
                                    <textarea
                                        type="text"
                                        placeholder="Product Description"
                                        required
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        cols="30"
                                        rows='1'
                                    ></textarea>
                                </div>

                                <div>
                                    <AccountTreeIcon />
                                    <select onChange={e => setCategory(e.target.value)}>
                                        <option value="">Choose Category</option>
                                        {categories.map(cate => {
                                           return <option key={cate} value={cate}>{cate}</option>
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <StorageIcon />
                                    <input
                                        type="number"
                                        placeholder='Stock'
                                        required
                                        onChange={e => setStock(e.target.value)}
                                    />
                                </div>

                                <div id="createFormFile">
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        multiple
                                        onChange={createProductImagesChange}
                                    />
                                </div>

                                <div id="createProductFormImage">
                                    {imagePreview.map((image, index) => (
                                        <img key={index} src={image} alt="Product Preview" />
                                    ))}
                                </div>

                                <Button
                                    id='createProductBtn'
                                    type="submit"
                                    disble={loading ? true : false}
                                >
                                    Create
                                </Button>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
export default NewProduct
