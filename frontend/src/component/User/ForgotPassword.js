import React, { Fragment, useEffect, useState } from 'react';
import "./ForgotPassword.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from "../../actions/userAction";
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';

const ForgotPassword = () => {
    const { error, message, loading } = useSelector(state => state.forgotPassword)

    const dispatch = useDispatch();
    const alert = useAlert();

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("email", email);

        dispatch(forgotPassword(myForm));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message);
        }

    }, [dispatch, error, alert, message])

    return (
        <Fragment>
            <MetaData title="Forgot Password | HL Shopping" />
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                    <form
                        className='forgotPasswordForm'
                        onSubmit={forgotPasswordSubmit}
                    >

                        <div className="forgotPasswordEmail">
                            <MailOutlineIcon />
                            <input
                                type="eamail"
                                placeholder='Email'
                                required
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <input
                            type="submit"
                            value="Send"
                            className="forgotPasswordBtn"
                            disabled={loading ? true : false}
                        />
                    </form>

                </div>
            </div>
        </Fragment>
    )
}

export default ForgotPassword
