
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';
import { HiChevronDown } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { Link } from 'react-router-dom';
// import Dashbord from '../pages/Dashboard';



const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };


    return (
        <>
            <div className='p-2'>
                <div>
                    <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
                        <label style={{ color: 'white' }} className='header-tittle1'>
                            COGNIXIO
                        </label>
                    </Link>
                    <label style={{ color: 'white' }} className='header-tittle'>Welcome to Cognixio</label>
                    <label className='header-line'>__________________________________________________</label>
                </div>
                <div className="user-section">
                    <div className="user-info">
                        <FaUserCircle className="user-icon" />
                        <span className="name">John Deo</span>
                    </div>
                    <div className="dropdown" onClick={toggleDropdown}>
                        <HiChevronDown className="settings-icon" />
                        {dropdownVisible && (
                            <div className="dropdown-content">
                                <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                                    <IoSettingsOutline />&nbsp;&nbsp;
                                    <span style={{ marginLeft: '7px' }}>Settings&nbsp;&nbsp;</span>
                                </a>
                                <br />
                                <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                                    <CiLogout />&nbsp;&nbsp;
                                    <span style={{ marginLeft: '7px' }}>Logout&nbsp;&nbsp;</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
