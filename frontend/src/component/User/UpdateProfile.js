import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UpdateProfile.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import { useAlert } from 'react-alert';
import LoginSignUp from './LoginSignUp.js';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdateProfile = () => {
    const { user, isAuthenticated } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(updateProfile(myForm));
    }

    const updateProfileDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {     //3 states : 0-initial | 1-Processing | 2-Done
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);
        } else {
            // setUser({ ...user, [e.target.name]: e.target.value });   //it sets the user object's key and value
        }
    }

    useEffect(() => {
        if (user) {
            setName(user.data.user.name);
            setEmail(user.data.user.email);
            setAvatarPreview(user.data.user.avatar.url);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Profile updated successfully");
            dispatch(loadUser());

            navigate("/account");

            dispatch({
                type: UPDATE_PROFILE_RESET,
            })
        }

    }, [dispatch, error, alert, navigate, user, isUpdated])

    return (
        <Fragment>
            {(!isAuthenticated) ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title="Update Profile | HL Shopping" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                            <form
                                className='updateProfileForm'
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >

                                <div className="updateProfileName">
                                    <AccountCircleOutlinedIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
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
                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avartar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept='image/*'
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update Profile"
                                    className="updateProfileBtn"
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

export default UpdateProfile
