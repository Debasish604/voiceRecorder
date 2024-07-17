import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Header from '../components/Header'
import { FaArrowRightLong } from "react-icons/fa6";
import { TbScreenShareOff } from "react-icons/tb";
import { AiFillGolden } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";




const Analytics = () => {
  const [activeTab, setActiveTab] = useState('R&C');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const cardData = [
    { tittle: 'Intelligent Data Quality', body: 'Intelligent Data Quality refers to the use of advanced algorithms and artificial intelligence techniques to enhance the accuracy, consistency, and reliability of data within a system.', icon: <AiFillGolden className="icon" /> },
    { tittle: 'Data Constructor', body: 'A Data Constructor is a programming concept that refers to a mechanism for creating and initializing data structures or objects in a programming language. It typically involves defining a template or blueprint for the data type.', icon: <LuLayoutDashboard className="icon" /> },
    { tittle: 'Auto Mapping', body: 'Auto Mapping involves the automatic association or linking of data elements between different systems or components without manual intervention. In the context of software or systems integration, auto mapping utilizes algorithms or predefined rules to match and synchronize corresponding data fields.', icon: <TbScreenShareOff className="icon-hand" /> }
  ]

  return (
    <div>
      <Header />
      <div className="analytics-container">
        <div className="card-container2">
          {cardData &&
            cardData.map((item, i) => (
              <div className="card">
                <div className="card-header">
                  <span className='tittle-text'>{item.tittle}</span>
                  <span> {item.icon}</span>
                </div>
                <p>{item.body}</p>
                <div className="card-footer" >
                  <button className='button-arrow'>
                    <FaArrowRightLong className="logo-small" />
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Analytics;
