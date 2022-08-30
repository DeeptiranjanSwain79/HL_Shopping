import React, { Fragment, useEffect } from 'react';
import MetaData from '../layout/MetaData';
import { Link, useNavigate } from "react-router-dom";
import Loader from '../layout/Loader/Loader';
import { useSelector } from 'react-redux';
import "./Profile.css"
import LoginSignUp from './LoginSignUp';

const Profile = () => {
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [navigate, isAuthenticated])
    return (
        <Fragment>
            {loading ?
                (<Loader />)
                : (

                    [!isAuthenticated ?
                        (<LoginSignUp />) :
                        (
                            <Fragment>
                                <MetaData title={`${user.data.user.name} | HL Shopping`} />
                                <div className="profileContainer">
                                    <div>
                                        <h1>My Profile</h1>
                                        <img src={user.data.user.avatar.url} alt={user.data.user.name} />
                                        <Link to="/me/update">Edit Profile</Link>
                                    </div>
                                    <div>
                                        <div>
                                            <h4>Full Name</h4>
                                            <p>{user.data.user.name}</p>
                                        </div>
                                        <div>
                                            <h4>Email</h4>
                                            <p>{user.data.user.email}</p>
                                        </div>
                                        <div>
                                            <h4>Joined on</h4>
                                            <p>{String(user.data.user.createdAt).substr(0, 10)}</p>
                                        </div>

                                        <div>
                                            <Link to="/orders">My Orders</Link>
                                            <Link to="/password/update">Change Password</Link>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    ]
                )}
        </Fragment>
    )
}

export default Profile
