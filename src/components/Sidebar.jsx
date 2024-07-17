
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import '../index.css'

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: '/',
      name: 'Data Management',
      icon: <HiAdjustmentsHorizontal />,
    },
    {
      path: '/Analytics',
      name: 'Analytics',
      icon: <HiMiniArrowTrendingUp />,
    },
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? '300px' : '50px' }} className="sidebar">
        <div className="top_section">
        <h1 style={{ display: isOpen ? 'block' : 'none', textAlign: 'center' }} className="logo">COGNIXIO</h1>

          <div style={{ marginLeft: isOpen ? '50px' : '0px' }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeClassName="active">
            <div className="icon-sidebar">{item.icon}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
