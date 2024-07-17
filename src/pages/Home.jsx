import React, { useState, useEffect } from 'react'
import '../styles/Home.css'
import pwcLogo from '../assets/image/pwc_logo.png'
import pwcCog from '../assets/image/cognxio1.png'
// import InfoPng from '../assets/image/info1.png'
import InfoPng from '../assets/svg/info.svg'
import setting from '../assets/image/setting.png'
import settingg from '../assets/image/g-setting.png'
import search from '../assets/image/search.png'
import Tooltip from '../components/Tooltip';
import Footer from '../components/components/Footer'
// import tech1 from '../assets/image/info.png'
import bgImg from '../assets/image/tech1.jpg';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const IDP = [
    { tittle: 'AIBot', img: bgImg, desc: 'A chatbot is a computer program designed to simulate conversation with human users, especially over the internet.' },
    { tittle: 'Design Generation', img: bgImg, desc: 'Design generation refers to the process of creating visual or graphical content using various tools, techniques, and methodologies.' },
    { tittle: 'GenAI: Invoice Reader ', img: bgImg, path: 'http://122.163.121.176:3004/invoice_reader', desc: 'GenAI: Invoice Reader likely refers to a system or application that utilizes artificial intelligence (AI) and machine learning (ML) technologies to automatically extract relevant information from invoices.' }
]
const DI = [
    { tittle: 'Data in Cloud', img: bgImg, desc: 'BAIP stands for Business Accelerated Intelligent Platform, a product of PwC that offers prebuild historical and predictive Data Models to work with industry standards KPIs across the multiple SAP based ERP systems. It also offers visualization of the KPIs through multiple BI tools like Power BI, Tableau etc.' },
    { tittle: 'Digital Cockpit', img: bgImg, path: '/#/sales_marketing', desc: '"AI Dashboard" likely refers to a dashboard that utilizes artificial intelligence (AI) technologies to provide insights, analytics, and visualization of data.' },
    { tittle: 'GenAI', img: bgImg, path: '', desc: '"GenAI: Talk to your DB" seems like a command or instruction related to interacting with a database using a chatbot or an AI system.' },
    { tittle: 'Talk to your DB', img: bgImg, path: 'http://122.163.121.176:3004/Talk_to_your_SQL_DB', desc: '"GenAI: Talk to your DB" seems like a command or instruction related to interacting with a database using a chatbot or an AI system.' },
]

const IA = [
    { tittle: 'Automated Data Profiling', img: bgImg, path: 'http://122.163.121.176:3004/automated_data_profiling', desc: 'Automated Data Profiling refers to the process of using software tools and algorithms to analyze and extract descriptive statistics and metadata from large volumes of data automatically. This process aims to gain insights into the structure, quality, and characteristics of the data without manual intervention.' },
    { tittle: 'Identifying Matches', img: bgImg, path: 'http://122.163.121.176:3004/IdentifyingMatchesDB', desc: 'Identifying Matches refers to the process of finding and recognizing similarities or correspondences between two or more entities within a dataset.' },
    { tittle: 'In-active Record Detection', img: bgImg, path: 'http://122.163.121.176:3004/inactive_record_detection_fromDB', desc: 'Inactive Record Detection refers to the process of identifying and flagging records within a dataset that are no longer active or relevant. ' },
    { tittle: 'Product Type Prediction', img: bgImg, path: 'http://122.163.121.176:3004/Product_Type_predection_fromDB', desc: 'Product Type Prediction refers to the process of using machine learning or statistical techniques to classify products into predefined categories or types based on their attributes, characteristics, or features. This task is commonly encountered in e-commerce, retail, inventory management, and product cataloging applications.' },
    { tittle: 'Automated Column Mapping', img: bgImg, path: 'http://122.163.121.176:3004/Automated_column_matching', desc: 'Automated Column Mapping refers to the process of automatically matching or mapping columns from different datasets or data sources that contain similar or related information. This is commonly used in data integration, data migration.' },
    { tittle: 'In-active Cost Center Detection', img: bgImg, path: 'http://122.163.121.176:3004/Inactive_cost_center_detection_fromDB', desc: 'Inactive Cost Center Detection refers to the process of identifying cost centers within an organization that are no longer active or in use.' },
]

function Home() {
    const [openTooltip, setOpenTooltip] = useState(null);
    const navigate = useNavigate();

    const handleToggleTooltip = (tooltipId) => {
        if (openTooltip === tooltipId) {
            setOpenTooltip(null);
        } else {
            setOpenTooltip(tooltipId);
        }
    };


    const onClickTittle = (path) => {
        if (path) {
            console.log('path', path);
            window.open(path);
        }
    };
    const onClickload = (path) => {
        console.log('data', path);
        
    };
    const handleLogout = () => {
        localStorage.removeItem('apiData');
        localStorage.removeItem('jwttoken');
        localStorage.removeItem('Name');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('jwttoken');
        navigate('/');
    };
    useEffect(() => {
        if (!sessionStorage.username) {
            navigate('/'); // Redirect to login if session doesn't exist
        }
    }, []);


    return (
        <>
            <div className='main-constainer container-fluid'>
                

                <div className='row h-100'>
                    <div className="col-5 left-section">
                        <div className='left-div'>
                            <div>
                                <img src={pwcLogo} alt="logo" className='pwc-logo' />
                            </div>
                            <div>
                                <img src={pwcCog} alt="logo" className='cog-logo' />
                                
                            </div>
                            <div className="logout-icon" >
                            <FaSignOutAlt onClick={handleLogout} />
                            </div>
                            <div>
                                <label className='text-h'>Get to the pace right away</label>
                            </div>
                            <div className='text-section'>
                                <p className='text-desc'>
                                    with our next generation Cognitive platform designed to revolutionize the way organizations harness the power of data using its cutting-edge AI-ML Technologies.
                                </p>
                                <p className='text-desc'>
                                    The platform is conceptualized to embed Generative AI technologies while being Human-led to help clients accelerate their transformation journey

                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 p-0 right-section">
                        <div className='right-div'>
                            <div className='first-card' >
                                <div className='heade-icon'>
                                    <div className='icon-contan'>
                                        <img src={setting} alt="setting" className='box-icon-p' />
                                    </div>
                                    <div className='icon-text'>
                                        <span className='info-tittle'>Intelligent</span> <br />
                                        <span className='info-tittle1'>Data Processing</span>
                                    </div>
                                </div>
                                <div className='info-body'>
                                    <p className='info-btext'>
                                        Extract the most valuable insights and
                                        patterns from vast amounts of data with
                                        our combined Artificial Intelligence AI
                                        and Machine Learning.Take a tour of:
                                    </p>
                                </div>
                                <div className='info-footer'>
                                    <div className='info-label'> </div>
                                    <ul className='footer-ul'>
                                        {IDP.map((item, index) => (
                                            <li className='footer-li' key={index}>
                                                <label onClick={(e) => { onClickTittle(item.path) }} style={{ opacity: (item.tittle === 'AIBot' || item.tittle === 'Design Generation') ? 0.4 : 1 }}> {item.tittle}</label>
                                                <Tooltip
                                                    content={
                                                        <div>
                                                            <h6>{item.tittle}</h6>

                                                            <h8>{item.desc}</h8>
                                                        </div>
                                                    }
                                                    isOpen={openTooltip === item.tittle}
                                                    onClick={() => handleToggleTooltip(item.tittle)}
                                                    path={item.path}

                                                    classTooltip='tooltip-d3'
                                                    bgImg={item.img}
                                                >
                                                    <span>
                                                        <img src={InfoPng} alt="logo" className='info-icon' />
                                                    </span>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                </div>


                            </div>
                            <div className='second-card' >
                                <div className='heade-icon'>
                                    <div className='icon-contan'>
                                        <img src={search} alt="setting" className='box-icon-p' />
                                    </div>
                                    <div className='icon-text'>
                                        <span className='info-tittle3'>Data</span> <br />
                                        <span className='info-tittle2'>Insights</span>
                                    </div>
                                </div>
                                <div className='info-body'>
                                    <p className='info-btext2'>
                                        Analise, interpret data, identify
                                        patterns, trends, correlations, and
                                        anomalies to provide actionable
                                        consclusions for your business;
                                        explore:
                                    </p>
                                </div>
                                <div className='info-footer'>
                                    {/* <label className='info-label2'></label> */}
                                    <ul className='footer-ul2'>
                                        {DI.map((item, index) => (
                                            <li className='footer-li' key={index}>
                                                {/* <label onClick={(e) => { onClickTittle(item.path) }}> {item.tittle}</label> */}
                                                <label onClick={(e) => { onClickTittle(item.path) }} style={{ opacity: item.tittle === 'Data in Cloud' || item.tittle === 'GenAI' ? 0.4 : 1 }}> {item.tittle}</label>
                                                <Tooltip
                                                    content={
                                                        <div>
                                                            <h6>{item.tittle}</h6>

                                                            <h8>{item.desc}</h8>
                                                        </div>
                                                    }
                                                    isOpen={openTooltip === item.tittle}
                                                    onClick={() => handleToggleTooltip(item.tittle)}
                                                    path={item.path}
                                                    classTooltip='tooltip-d3'
                                                    bgImg={item.img}
                                                >
                                                    <span>
                                                        {/* {item.tittle} */}
                                                        <img src={InfoPng} alt="logo" className='info-icon1' />
                                                    </span>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className='third-card' >
                                <div className='heade-icon'>
                                    <div className='icon-contan'>
                                        <img src={settingg} alt="setting" className='box-icon-p' />
                                    </div>
                                    <div className='icon-text'>
                                        <span className='info-tittle5'>Data</span> <br />
                                        <span className='info-tittle4'>Enrichment</span>
                                    </div>
                                </div>
                                <div className='info-body'>
                                    <p className='info-btext3'>
                                        Our combined AI and Intelligent
                                        Automation will improve and
                                        streamline your business processes.Get to know our tools:
                                    </p>
                                </div>
                                <div className='info-footer'>
                                    {/* <label className='info-label3'></label> */}
                                    <ul className='footer-ul3'>
                                        {IA.map((item, index) => (
                                            <li className='footer-li2' key={index}>
                                                <label onClick={(e) => { onClickTittle(item.path) }}> {item.tittle}</label>
                                                <Tooltip
                                                    content={
                                                        <div>
                                                            <h6>{item.tittle}</h6>
                                                            {/* <div style="font-weight: bold; font-size: 50px;">{item.tittle}</div> */}


                                                            <h8>{item.desc}</h8>
                                                        </div>

                                                    }
                                                    isOpen={openTooltip === item.tittle}
                                                    onClick={() => handleToggleTooltip(item.tittle)}
                                                    path={item.path}
                                                    classTooltip='tooltip-d3'
                                                    bgImg={item.img}
                                                >
                                                    <span>
                                                        {/* {item.tittle} */}
                                                        <img src={InfoPng} alt="logo" className='info-icon1' />
                                                    </span>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <Footer />
        </>
    )
}

export default Home