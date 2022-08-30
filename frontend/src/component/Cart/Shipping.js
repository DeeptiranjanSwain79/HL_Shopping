import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import { saveShippingInfo } from '../../actions/cartAction';
import MetaData from '../layout/MetaData';
import { Country, State } from "country-state-city";
import { MdHome } from "react-icons/md";
import { MdLocationCity } from "react-icons/md";
import { MdPinDrop } from "react-icons/md";
import { MdPhone } from "react-icons/md";
import { MdPublic } from "react-icons/md";
import { MdTransferWithinAStation } from "react-icons/md";
import "./Shipping.css";
import CheckoutSteps from "../Cart/CheckoutSteps.js"
import { useNavigate } from 'react-router-dom';

const Shipping = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.user);
    const { shippingInfo } = useSelector(state => state.cart);

    const [address, setAdress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
    const [state, setState] = useState(shippingInfo.state);
    const [country, setCountry] = useState(shippingInfo.country);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

    const shippingSubmit = (e) => {
        e.preventDefault();
        if(phoneNo.length !== 10){
            alert.error("Phone number should be 10 digits");
            return;
        }
        dispatch(
            saveShippingInfo({address, city, pinCode, state, country, phoneNo})
        );
        navigate("/order/confirm");
    }

    return (
        <Fragment>
            {(!isAuthenticated) ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title="Shipping Details" />

                    <CheckoutSteps activeStep={0} />

                    <div className="shippingContainer">
                        <div className="shippingBox">
                            <h2 className="shippingHeading">Shipping Details</h2>

                            <form
                                className="shippingForm"
                                encType='multipart/form-data'
                                onSubmit={shippingSubmit}
                            >
                                <div>
                                    <MdHome />
                                    <input
                                        type="text"
                                        placeholder='Adress'
                                        required
                                        value={address}
                                        onChange={(e) => setAdress(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <MdLocationCity />
                                    <input
                                        type="text"
                                        placeholder='City'
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <MdPinDrop />
                                    <input
                                        type="number"
                                        placeholder='Pin Code'
                                        required
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <MdPhone />
                                    <input
                                        type="number"
                                        placeholder='Phone Number'
                                        required
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <MdPublic />
                                    <select required value={country} onChange={(e) => setCountry(e.target.value)}>
                                        <option value="">Country</option>
                                        {Country &&
                                            Country.getAllCountries().map((item) => (
                                                <option value={item.isoCode} key={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {country && (
                                    <div>
                                        <MdTransferWithinAStation />
                                        <select required value={state} onChange={(e) => setState(e.target.value)}>
                                            <option value="">State</option>
                                            {State &&
                                                State.getStatesOfCountry(country).map((item) => (
                                                    <option value={item.isoCode} key={item.isoCode}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                <input
                                    type="submit"
                                    value="Continue"
                                    className='shippingBtn'
                                    disabled={state ? false : true}
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Shipping
