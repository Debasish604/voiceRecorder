import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Logout } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import '../../style/Topbar.css'


const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  //==================== For profile icon click ==============================
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownRef]);

  // =============================================================================

  // ================================For show login user name ====================
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('Name');
    if (storedName) {
      setName(storedName);
    }
  }, []);
  // ===============================================================================


  // ====================================For Logout ================================
  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };
  // ================================================================================



  return (

    <Box display="flex" justifyContent="space-between" p={2}>
      <Box>
        <h3 style={{ marginLeft: '7px' }}>Welcome {name}</h3>
      </Box>
      <Box display="inline">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <Box className="dropdown" ref={dropdownRef}>
          <Box className="profile" onClick={toggleDropdown}>
            <IconButton>
              <PersonOutlinedIcon />
            </IconButton>
          </Box>
          {isOpen && (
            <Box className="dropdown-content">
              <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
                <SettingsOutlinedIcon /> <span style={{ marginLeft: '7px' }}>Setting</span>
              </a>
              <a onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                <Logout /><span style={{ marginLeft: '7px' }}>Logout</span>
              </a>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
