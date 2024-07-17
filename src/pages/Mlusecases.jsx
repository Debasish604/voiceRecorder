import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Header2 from '../components/Header2';
import { PiHandCoinsThin } from "react-icons/pi";
import { BsDatabase } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsClipboardData } from "react-icons/bs";

const Mlusecases = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      tittle: 'ChatBot',
      body: 'Industrial Data Management involves the systematic organization, storage, and retrieval of data generated within industrial processes. It encompasses strategies for collecting, processing, and analyzing data from machinery.',
      icon: <BsDatabase className="icon" />,
      // path: '/ChatBot',
      path: '/dashboard',
      tooltipContent: "Industrial Data Management involves the systematic organization, storage, and retrieval of data generated within industrial processes. It encompasses strategies for collecting, processing, and analyzing data from machinery."
    },
    {
      tittle: 'Design Generation',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <PiHandCoinsThin className="icon-hand" />,
      // path: '/Design_Generation',
      path: '/dashboard',
      tooltipContent: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.'
    },
   
    {
      tittle: 'GenAI: Invoice Reader',
      body: 'An industrial use case refers to a practical application or scenario where industrial processes or technologies are implemented to address specific challenges or achieve defined objectives.',
      icon: <BsClipboardData className="icon-hand" />
      // path: '/Invoice_Reader'
      // path: '/dashboard'
    }

  ];

  const onClickGo = (data) => {
    console.log('path', data);
    if (data === 'GenAI: Invoice Reader'){
      window.open('http://122.163.121.176:3004/invoice_reader','_blank')
    }
  }

  return (
    <div>
      <Header2 />
      <div className='container-fluid w-100'>
        <div className='row w-100 h-100 p-4'>
          {cardData.map((item, i) => (
            // <div className='col-12 col-md-6 col-lg-4 pl-4 mt-4' key={i}>
            <div className='col-12 col-md-6 col-lg-4' key={i}>
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

export default Mlusecases;