import React from 'react'
// import '../styles/Dashboard.css';
import Header2 from '../components/Header2'
import { FaArrowRightLong } from "react-icons/fa6";
import { AiFillGolden } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineAutoAwesomeMotion } from "react-icons/md";


function IndustrialDataManagement() {


    const cardData = [
        { tittle: 'Intelligent Data Quality', body: 'Intelligent Data Quality refers to the use of advanced algorithms and artificial intelligence techniques to enhance the accuracy, consistency.', icon: <AiFillGolden className="icon" /> },
        { tittle: 'Data Constructor', body: 'A Data Constructor is a programming concept that refers to a mechanism for creating and initializing data structures.', icon: <LuLayoutDashboard className="icon" /> },
        { tittle: 'Auto Maping', body: 'Auto Mapping involves the automatic association or linking of data elements between different systems or components without manual intervention.', icon: <MdOutlineAutoAwesomeMotion className="icon-hand" /> }
    ]
    return (
        <div>
            <Header2 />
            <div className='conatiner-fluid w-100'>
                <div className='row w-100 h-100 p-4'>
                    {cardData.map((item, i) => (
                        <div className='col-12 col-md-6 col-lg-4 pl-4 mt-4' key={i}>
                            <div key={i} className='card-custom'>
                                <div className="card-header">
                                    <span className='tittle-text'>{item.tittle}</span>
                                    <span>{item.icon}</span>
                                </div>
                                <p className='pt-4'>{item.body}</p>
                                <div className="card-footer">
                                    <button className='button-arrow' >
                                        <FaArrowRightLong className="logo-small" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default IndustrialDataManagement


