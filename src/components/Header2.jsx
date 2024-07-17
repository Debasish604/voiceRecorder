import React, { useState,useEffect } from 'react'; 
import { FaUserCircle } from 'react-icons/fa';
import '../style/Header2.css';
import { HiChevronDown } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { Link } from 'react-router-dom';
// import Dashboard from "../pages/Dashboard";



const Header2 = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
    // const [username, setUsername] = useState('');

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    const handleLogout = () => {
        try {
            sessionStorage.clear();
            alert('You have successfully logged out!');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    useEffect(() => {
    
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    const getInitials = () => {
        if (username && username.length > 0) {
            const initials = username.split(' ').map((name) => name.charAt(0)).join('').toUpperCase();
            return initials;
        }
        return '';
    };
    const getFirstName = () => {
        if (username && username.length > 0) {
            const firstName = username.split(' ')[0];
            return firstName;
        }
        return '';
    };


    return (
        <>
            <div className='p-2'>
                <div>
                    {/* <Link to="/dashboard1" style={{ textDecoration: 'none' }}> */}
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <label style={{ color: 'white' }} className='header-tittle1'>
                            COGNIXIO
                        </label>
                    </Link>
                    <label style={{ color: 'white' }} className='header-tittle'>Welcome to Cognixio</label>
                    <label className='header-line'>__________________________________________________</label>
                </div>
                <div className="user-section">
                    <div className="user-info">
                        {/* <FaUserCircle className="user-icon" /> */}
                        {/* <span className="name1">
                            {username && username.length > 0 && username.charAt(0).toUpperCase()}
                        </span> */}
                        {/* <span className="name">User Account</span> */}
                        <span className="name1">
                        {getInitials()}
                    </span>
                       
                        {/* <span className="name">Welcome {username}</span> */}
                        <span className="name">Welcome {getFirstName()}</span>
                        
                    </div>
                    <div className="dropdown1" onClick={toggleDropdown}>
                        <HiChevronDown className="settings-icon" />
                        {dropdownVisible && (
                            <div className="dropdown-content1">
                                <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                                    <IoSettingsOutline />&nbsp;&nbsp;
                                    <span style={{ marginLeft: '7px' }}>Settings&nbsp;&nbsp;</span>
                                </a>
                                <br />
                                <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                                    <CiLogout />&nbsp;&nbsp;
                                    <span style={{ marginLeft: '7px' }} onClick={handleLogout} >Logout&nbsp;&nbsp;                                  
                                    
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header2;