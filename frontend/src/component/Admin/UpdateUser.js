import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import { useNavigate, useParams } from 'react-router-dom';
import "./newProduct.css";
import { clearErrors } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Sidebar from './Sidebar';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import { getUserDetails, updateUser } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';

const UpdateUser = () => {
    const { isAuthenticated, user: adminUser } = useSelector(state => state.user);
    const Role = adminUser.data.user.role;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, user } = useSelector(state => state.userDetails);
    const { isUpdated,  } = useSelector(state => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    // const [contactNo, setContactNo] = useState("");

    const { id } = useParams();

    useEffect(() => {
        if (user && user._id !== id) {
            dispatch(getUserDetails(id));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            // setContactNo(user.co);
        }


        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("User Updated Successfully");
            navigate("/admin/users");
            dispatch({ type: UPDATE_USER_RESET })
        }
    }, [dispatch, alert, error, navigate, isUpdated, id, user]);

    const updateUserSubmitHandler = e => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);

        dispatch(updateUser(id, myForm));
    }

    return (
        <Fragment>
            {!(isAuthenticated && Role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`Update User`} />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="newProductContainer">
                            {loading ? <Loader /> : (
                                <form
                                    encType='multipart/form-data'
                                    className="createProductForm"
                                    onSubmit={updateUserSubmitHandler}
                                >
                                    <h1>Update user</h1>

                                    <div>
                                        <MailOutlineIcon />
                                        <input
                                            type="email"
                                            placeholder="Emaial"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <PersonIcon />
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <VerifiedUserIcon />
                                        <select value={role} onChange={e => setRole(e.target.value)}>
                                            <option value="">Choose Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    <Button
                                        id='createProductBtn'
                                        type="submit"
                                        disble={loading ? true : false || role === "" ? true : false}
                                    >
                                        Update
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default UpdateUser
