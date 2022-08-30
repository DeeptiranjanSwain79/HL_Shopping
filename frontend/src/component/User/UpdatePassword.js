import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UpdatePassword.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { CgLock } from 'react-icons/cg';
import { VpnKey } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updatePassword } from "../../actions/userAction";
import { useAlert } from 'react-alert';
import LoginSignUp from './LoginSignUp.js';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdatePassword = () => {
    
    const {isAuthenticated} = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Password updated successfully");

            navigate("/account");

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            })
        }

    }, [dispatch, error, alert, navigate, isUpdated])


    return (
        <Fragment>
            {(!isAuthenticated) ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title="Update Password | HL Shopping" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className='updatePasswordHeading'>Update Password</h2>
                            <form
                                className='updatePasswordForm'
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="oldPassword">
                                    <VpnKey />
                                    <input
                                        type="password"
                                        placeholder='Old Password'
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="newPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder='New Password'
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="confirmPassword">
                                    <CgLock />
                                    <input
                                        type="password"
                                        placeholder='Confirm Password'
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Change Password"
                                    className="updatePasswordBtn"
                                    disabled={loading ? true : false}
                                />
                            </form>

                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default UpdatePassword
