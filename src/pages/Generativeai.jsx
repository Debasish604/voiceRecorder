import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Header2 from '../components/Header2';
import { PiHandCoinsThin } from "react-icons/pi";
import { BsDatabase } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsClipboardData } from "react-icons/bs";

const Generativeai = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      tittle: 'Automated Data Profiling',
      body: 'Industrial Data Management involves the systematic organization, storage, and retrieval of data generated within industrial processes. It encompasses strategies for collecting, processing, and analyzing data from machinery.',
      icon: <BsDatabase className="icon" />
      // path: '/Automated_Data_Profiling',
      // path: '/dashboard',
      // tooltipContent: "Industrial Data Management involves the systematic organization, storage, and retrieval of data generated within industrial processes. It encompasses strategies for collecting, processing, and analyzing data from machinery."
    },
    {
      tittle: 'Identifying Matches',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <PiHandCoinsThin className="icon-hand" />
      // path: '/Identifying_Matches',
      // path: '/dashboard',
      // tooltipContent:'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.'
    },
    {
      tittle: 'InActive Record Detection',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <BsClipboardData className="icon-hand" />
      // path: '/InActive_Record_Detection'
      // path: '/dashboard'
    },
    {
      tittle: 'Product Type Prediction',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <BsClipboardData className="icon-hand" />
      // path: '/Product_Type_Prediction'
      // path: '/dashboard'
    }
    ,
    {
      tittle: 'Automated Column Mapping',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <BsClipboardData className="icon-hand" />
      // path: '/Automated_Column_Mapping'
      // path: '/dashboard'
    }
    ,
    {
      tittle: 'InActive Cost Center Detection',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <BsClipboardData className="icon-hand" />
      // // path: '/InActive_Cost_Center_Detection'
      // path: '/dashboard'
    }
  ];

  const onClickGo = (data) => {
    console.log('path', data);
    if (data=== 'Automated Data Profiling'){
      window.open('http://122.163.121.176:3004/automated_data_profiling','_blank')
    }
    else if (data=='Identifying Matches'){
      window.open('http://122.163.121.176:3004/IdentifyingMatchesDB','_blank')
    }
    else if (data=='InActive Record Detection'){
      window.open('http://122.163.121.176:3004/inactive_record_detection_fromDB','_blank') 
    }
    else if (data=='Product Type Prediction'){
      window.open('http://122.163.121.176:3004/Product_Type_predection_fromDB','_blank')
      // navigate('/dashboard')
    }
    else if (data=='Automated Column Mapping'){
      window.open('http://122.163.121.176:3004/Automated_column_matching','_blank')
      // navigate('/dashboard')/
    }
    else if (data=='InActive Cost Center Detection'){
      window.open('http://122.163.121.176:3004/Inactive_cost_center_detection_fromDB','_blank')
    }
    
    
    
    
  }

  return (
    <div >
      <Header2 />
      <div className='container-fluid w-100'>
        <div className='row w-100 h-100 p-'>
          {cardData.map((item, i) => (
            // <div className='col-12 col-md-6 col-lg-4 pl-4 mt-4' key={i}>
            <div className='col-12 col-md-6 col-lg-4 ' key={i}>
              <div key={i} className='card-custom'>
                <div className="card-header">
                  {item.tooltipContent && (
                    <Tooltip title={item.tooltipContent} arrow placement="top" >
                      <InfoOutlinedIcon
                        fontSize="25px"
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </Tooltip>
                  )}
                  <span className='tittle-text'>{item.tittle}</span>
                  <span>{item.icon}</span>
                </div>
                <p className='pt-4'>{item.body}</p>
                <div className="card-footer">

                  <button className='button-arrow' onClick={(e) => { onClickGo(item.tittle) }}>
                    <FaArrowRightLong className="logo-small" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generativeai;