import React from 'react';
import "./Slidebar.css";
import logo from "../../images/logo.png";
import { Link } from 'react-router-dom';
import { TreeView, TreeItem } from "@mui/lab";
import { MdDashboard } from 'react-icons/md';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import { MdRateReview } from 'react-icons/md';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link to="/">
                <img src={logo} alt="HL Shopping" />
            </Link>
            <Link to="/admin/dashboard">
                <p>
                    <MdDashboard />Dashboard
                </p>
            </Link>
            <Link to="">
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ExpandLessIcon />}
                >
                    <TreeItem nodeId="1" label="Products">
                        <Link to="/admin/products">
                            <TreeItem nodeId="2" label="All" icon={<PostAddIcon />} />
                        </Link>
                        <Link to="/admin/product">
                            <TreeItem nodeId='3' label="Create" icon={<AddIcon />} />
                        </Link>
                    </TreeItem>
                </TreeView>
            </Link>

            <Link to="/admin/orders">
                <p>
                    <ListAltIcon />Orders
                </p>
            </Link>

            <Link to="/admin/users">
                <p>
                    <PeopleIcon />Users
                </p>
            </Link>

            <Link to="/admin/reviews">
                <p>
                    <MdRateReview />Reviews
                </p>
            </Link>
        </div>
    )
}

export default Sidebar
