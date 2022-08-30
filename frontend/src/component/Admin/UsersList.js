import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginSignUp from '../User/LoginSignUp';
import "./ProductList.css";
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from "./Sidebar.js";
import {
    getAllUsers,
    clearErrors,
    deleteUser
} from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = () => {
    const { isAuthenticated, user } = useSelector(state => state.user);
    const role = user.data.user.role;
    const { users, error } = useSelector(state => state.allUsers);
    const { error: deleteError, isDeleted } = useSelector(state => state.profile)

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const deleteUserHandler = id => {
        dispatch(deleteUser(id));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("User deleted Successfully");
            navigate("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }

        dispatch(getAllUsers());
    }, [dispatch, error, alert, navigate, isDeleted, deleteError])

    const column = [
        { field: "id", headerName: "User Id", minWidth: 200, flex: 1 },
        {
            field: "email",
            headerName: "E-mail ID",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.9,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 270,
            type: "number",
            flex: 0.3,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: params => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ]

    const row = [];

    users &&
        users.forEach(user => {
            row.push({
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name
            })
        })
    // console.log(products);

    return (
        <Fragment>
            {!(isAuthenticated && role === "admin") ? (
                <LoginSignUp />
            ) : (
                <Fragment>
                    <MetaData title={`All Users | Admin`} />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="productListContainer">
                            <h1 id='productListHeading'>All Users</h1>

                            <DataGrid
                                rows={row}
                                columns={column}
                                disableSelectionOnClick
                                className='productListTable'
                            // autoHeight
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default UsersList
