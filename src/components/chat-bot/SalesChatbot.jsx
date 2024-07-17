import React, { useState, useEffect } from 'react';
// import { FaUser, FaRobot } from 'react-icons/fa';
import { BsSendFill } from "react-icons/bs";
import '../../style/Chatbot.css'
import { Bar } from 'react-chartjs-2';
import BouncingDotsLoader from './BouncingDotsLoader';
import { apiService } from '../../service/api-service';
import DistributedColumnChart1 from '../../components/charts/DistributedColumnChart1';
import BarCharts from '../../components/charts/Barchart';
import DonutCharts1 from '../../components/charts/DonutChart1';
import { formatRuppes } from '../../utils/GlobalFilters';
import { TbRobot } from "react-icons/tb";
import { FaUserTie } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import PieCharts1 from '../../components/charts/PieCharts1';


const CustomSalesChatbot = () => {
    const { speechSynthesis, SpeechSynthesisUtterance } = window;
    const [messages, setMessages] = useState([{ text: '', sender: '' }]);
    const [userInput, setUserInput] = useState(' ');

    const [loading, setLoading] = useState(false);
    const [showYesNo, setShowYesNo] = useState(false);
    // const [selectedClient, setSelectedClient] = useState('');
    const [showButtons, setShowButtons] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    // State for tracking speech synthesis playback
    //  const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const simulateBotTyping = async (botReply, typingInterval) => {
        for (let i = 0; i < botReply.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, typingInterval));
            // Update the last message in the array instead of adding a new one
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];

                if (lastMessage.sender === 'bot') {
                    lastMessage.text = botReply.substring(0, i + 1);
                } else {
                    // If the last message is not from the bot, add a new message
                    updatedMessages.push({ text: botReply.substring(0, i + 1), sender: 'bot' });
                }
                return updatedMessages;
            });
        }
    };
    // const chartData = {
    //     labels: apiResponse.clients.map((row) => row.Product_category),
    //     datasets: [
    //         {
    //             label: 'Supplier Quality Index',
    //             backgroundColor: 'rgba(75,192,192,0.4)',
    //             borderColor: 'rgba(75,192,192,1)',
    //             borderWidth: 1,
    //             hoverBackgroundColor: 'rgba(75,192,192,0.6)',
    //             hoverBorderColor: 'rgba(75,192,192,1)',
    //             data: apiResponse.clients.map((row) => row['Supplier Quality Index']),
    //         },
    //     ],
    // };
    // setChartData(chartData);

    // const speakMessage = (text) => {
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     // You can customize the voice and other properties of the utterance here
    //     speechSynthesis.speak(utterance);
    // };


    // const handleButtonClick = async (response) => {
    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { text: response, sender: 'user' },
    //     ]);
    //     setLoading(true);
    //     try {
    //         const newResponse = await apiService.SupplierRiskScoreForecast_chatButton({
    //             user_response: response.toLowerCase(),
    //         });

    //         setLoading(false);
    //         setShowYesNo(false);
    //         // speakMessage(newResponse.data);
    //         // setShowButtons(false);
    //         await simulateBotTyping(newResponse.data, 60);
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { text: newResponse.data, sender: 'bot' },
    //         ]);

    //         if (newResponse.msg && newResponse.msg.length > 0) {
    //             // speakMessage(newResponse.msg[0]);
    //             await simulateBotTyping(newResponse.msg[0], 60);
    //             setShowYesNo(true);
    //         }
    //         if (newResponse.Clients) {
    //             setShowYesNo(false);
    //             const userListMessage = (
    //                 <div className="client_box_container">
    //                     <p className="client_text">Client Name</p>
    //                     {newResponse.Clients.Clients.map((client, index) => (
    //                         <div key={index} className="client_box">
    //                             <input
    //                                 type="radio"
    //                                 id={`clientRadio${index}`}
    //                                 name="clientRadio"
    //                                 value={client.MTEXT_ClientName}
    //                                 onChange={() =>
    //                                     handleClientSelect(client.MTEXT_ClientName)
    //                                 }
    //                             />
    //                             <label htmlFor={`clientRadio${index}`}>
    //                                 <p className="message-content">{`${client.MTEXT_ClientName}`}</p>
    //                             </label>
    //                         </div>
    //                     ))}
    //                 </div>
    //             );
    //             setMessages((prevMessages) => [
    //                 ...prevMessages,
    //                 { text: userListMessage, sender: 'bot' },
    //             ]);
    //         }

    //     } catch (error) {
    //         console.error('Error calling API:', error.message);
    //     } finally {
    //         // setShowYesNo(true);
    //     }
    //     setUserInput('');
    // };

    // const handleInputSubmit = async (e) => {
    //     e.preventDefault();

    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { text: userInput, sender: 'user' },
    //     ]);
    //     // const botResponse = generateBotResponse(userInput);
    //     setLoading(true);
    //     const apiResponse = await apiService.user_input_insight_sales({ user_input: userInput });
    //     setLoading(false);
    //     // speakMessage(apiResponse.data);
    //     await simulateBotTyping(apiResponse.data, 30);


    //     if (apiResponse.data) {
    //         setShowYesNo(true);
    //     }

    //     setUserInput('');
    //     // handleSend();
    // };
    // const handleInputSubmit = async (e) => {
    //     e.preventDefault();

    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { text: userInput, sender: 'user' },
    //     ]);

    //     setLoading(true);

    //     try {
    //       const apiResponse = await apiService.user_input_insight_sales({ user_input: userInput });
    //       // speakMessage(apiResponse.data);
    //       await simulateBotTyping(apiResponse.data, 30);

    //       if (apiResponse.data) {
    //         setShowYesNo(true);
    //       }
    //     } catch (error) {
    //       // Handle errors if necessary
    //       console.error('Error:', error);
    //     } finally {
    //       setLoading(false);
    //       setUserInput('');
    //     }
    //     // setButtonDisabled(true);
    //   };

    const handleInputSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); // Set submitting to true when form is being submitted

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userInput, sender: 'user' },
        ]);

        setLoading(true);
        setUserInput('');

        try {
            const apiResponse = await apiService.user_input_insight_sales({ user_input: userInput });
            setLoading(false);

            await simulateBotTyping(apiResponse.data, 30);

            if (apiResponse.data) {
                setShowYesNo(true);
            }

        } catch (error) {
            console.error('Error calling API:', error.message);
        } finally {
            // setUserInput('');
            setSubmitting(false); // Set submitting back to false after form submission is complete
        }
    };



    // const handleButtonClick = async (response) => {
    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { text: response, sender: 'user' },
    //     ]);
    //     setLoading(true);

    //     try {
    //         if (response === 'yes') {
    //             const user_input = messages[messages.length - 1]?.text;
    //             const newResponse = await apiService.user_input_insight_sales2({ user_input });
    //             setLoading(false);

    //             await simulateBotTyping(newResponse.data, 50);
    //             if (newResponse.status === 'success' && newResponse.data) {
    //                 const dynamicChartData = newResponse.data;
    //                 const datasets = Object.keys(dynamicChartData).map((columnName) => {
    //                     if (Array.isArray(dynamicChartData[columnName])) {
    //                         return {
    //                             label: columnName,
    //                             data: dynamicChartData[columnName],
    //                             backgroundColor: 'rgba(75,192,192,0.4)',
    //                             borderColor: 'rgba(75,192,192,1)',
    //                             borderWidth: 1,
    //                             hoverBackgroundColor: 'rgba(75,192,192,0.6)',
    //                             hoverBorderColor: 'rgba(75,192,192,1)',
    //                         }
    //                         return null;
    //                     }
    //                 }
    //                 ).filter(Boolean);
    //                 setChartData({ datasets });


    //             }


    //         } else if (response === 'no') {

    //         }
    //     } catch (error) {
    //         console.error('Error calling API:', error.message);
    //     } finally {
    //         setUserInput('');
    //     }
    // };




    const handleButtonClick = async (response) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: response, sender: 'user' },
        ]);
        setLoading(true);

        try { 
            if (response === 'Yes') { 
                const user_input = messages[messages.length - 1]?.text; 
                const newResponse = await apiService.user_input_insight_sales2({ user_input });
                setLoading(false);

                await simulateBotTyping(newResponse.data, 50);


            } else if (response === 'No') {

            }
        } catch (error) {
            console.error('Error calling API:', error.message);
        } finally {
            setUserInput('');
        }
    };





    useEffect(() => {
        const chatDiv = document.getElementById('chatDiv');
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }, [messages]);

    useEffect(() => {
        // speakMessage('There is something unusual about your different suppliers. Do you want to know ?');
        const welcome = 'Hi, How May I Help You regarding Data Insights?'
        setMessages([
            { text: welcome, sender: 'bot' },
        ]);
        onLoadWelcome(welcome)
        return () => {
        }
    }, [])


    useEffect(() => {
        // Cleanup function to stop speech synthesis when component is unmounted
        return () => {
            speechSynthesis.cancel(); // Stop any ongoing speech synthesis
        };
    }, [speechSynthesis]);

    const onLoadWelcome = async (welcome) => {
        await simulateBotTyping(welcome, 60);
        // setShowYesNo(true);
    }

    const [chartData, setChartData] = useState(null);

    // const handleClientSelect = async (response) => {
    //     setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { text: response, sender: 'user' },
    //     ]);
    //     setLoading(true);

    //     try {
    //         if (response === 'Here Is The Chart') {
    //             const user_input = messages[messages.length - 1]?.text;
    //             const newResponse = await apiService.user_input_insight_sales2({ user_input });
    //             setLoading(false);

    //             await simulateBotTyping(newResponse.data, 50);
    //             const salesData = newResponse.data;
    //             if (newResponse.status === 'success' && newResponse.data) {


    //                 setShowYesNo(false);
    //                 const userDetailsMessage = (
    //                     <div >

    //                         {(salesData.MATKL_Material_Category && salesData.MATKL_Material_Category.length !== 0) ? (
    //                             // <div style={{ width: '100%', height: '100vh' }}>
    //                             <DistributedColumnChart1
    //                                 labels={salesData.MATKL_Material_Category}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 // flag={totalSalesVQFLoder}
    //                                 // tilesLables="Total Sales by .."
    //                                 height="320"
    //                                 width="450"
    //                                 // height="100%"
    //                                 // width='100%'
    //                             // legend='Total Sales (₹)'
    //                             // format_func={formatRuppes}

    //                             />
    //                             // </div>
    //                             ) : ''
    //                         }

    //                         {(salesData.Customer_Name && salesData.Customer_Name.length !== 0) ? (
    //                             <DistributedColumnChart1
    //                                 labels={salesData.Customer_Name}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="320"
    //                                 width='450'

    //                             />) : ('')
    //                         }
    //                         {(salesData.Customer_Name && salesData.Customer_Name.length !== 0) ? (
    //                             <DonutCharts1
    //                                 labels={salesData.Customer_Name}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="320"
    //                                 width='450'

    //                             />) : ('')
    //                         }
    //                         {(salesData.REGION && salesData.REGION.length !== 0) ? (
    //                             <DistributedColumnChart1
    //                                 labels={salesData.REGION}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="300"
    //                                 width='400'

    //                             />) : ''
    //                         }
    //                         {(salesData.Year && salesData.Year.length !== 0) ? (
    //                             <DistributedColumnChart1
    //                                 labels={salesData.Year}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="320"
    //                                 width='450'

    //                             />) : ''
    //                         }
    //                         {(salesData.SalesPerson && salesData.SalesPerson.length !== 0) ? (
    //                             <DonutCharts1
    //                                 labels={salesData.SalesPerson}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="200"
    //                                 width='450'

    //                             />) : ''
    //                         }
    //                         {(salesData.Month && salesData.Month.length !== 0) ? (
    //                             <DonutCharts1
    //                                 labels={salesData.Month}
    //                                 series={salesData.Total_Sales_Revenue}
    //                                 height="320"
    //                                 width='450'

    //                             />) : ''
    //                         }


    //                     </div>


    //                 );


    //                 setMessages((prevMessages) => [
    //                     ...prevMessages,
    //                     { text: userDetailsMessage, sender: 'bot' },
    //                 ]);
    //             }

    //         }
    //         else {
    //             const userDetailsMessage = (
    //                 <p className="client_text">
    //                     No Data Available For This Client.
    //                 </p>
    //             );

    //             setMessages((prevMessages) => [
    //                 ...prevMessages,
    //                 { text: userDetailsMessage, sender: 'bot' },
    //             ]);
    //         }

    //     } catch (error) {
    //         console.error("Error calling API:", error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // {
    //     chartData && (
    //         <div style={{ marginTop: '20px' }}>
    //             <Bar
    //                 data={chartData}
    //                 options={{
    //                     scales: {
    //                         y: {
    //                             beginAtZero: true,
    //                         },
    //                     },
    //                 }}
    //             />
    //         </div>
    //     )
    // }
    const handleClientSelect = async (response) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: response, sender: 'user' },
        ]);
        setLoading(true);
    
        try {
            // if (response === 'D') {
            //     // Assume user selects 'DistributedColumnChart' by default
            //     let chartType = 'D';
    
            //     // If the user selected 'DonutCharts', update the chartType
            //     if (response === 'D2') {
            //         chartType = 'D2';
            //     }
            let chartType = null;

            if (response === 'Here is the Line Chart' || response === 'Here is the Pie Chart') {
            chartType = response
                
                const user_input = messages[messages.length - 1]?.text;
                const newResponse = await apiService.user_input_insight_sales2({ user_input });
                setLoading(false);
    
                await simulateBotTyping(newResponse.data, 50);
                const salesData = newResponse.data;
                if (newResponse.status === 'success' && newResponse.data) {
                    setShowYesNo(false);
    
                    let chartComponent;
                    switch (response) {
                        case 'Here is the Line Chart':
                            chartComponent = (
                                // <DistributedColumnChart1
                                //     labels={salesData.MATKL_Material_Category}
                                //     series={salesData.Total_Sales_Revenue}
                                //     height="320"
                                //     width="450"
                                // />
                                <div>
                                {(salesData.MATKL_Material_Category && salesData.MATKL_Material_Category.length !== 0) ? (
                                                                // <div style={{ width: '100%', height: '100vh' }}>
                                                                <DistributedColumnChart1
                                                                    labels={salesData.MATKL_Material_Category}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    // flag={totalSalesVQFLoder}
                                                                    // tilesLables="Total Sales by .."
                                                                    height="320"
                                                                    width="450"
                                                                    // height="100%"
                                                                    // width='100%'
                                                                // legend='Total Sales (₹)'
                                                                // format_func={formatRuppes}
                                
                                                                />
                                                                // </div>
                                                                ) : ''
                                                            }
                                
                        
                                                            {(salesData.Customer_Name && salesData.Customer_Name.length !== 0) ? (
                                                                <DistributedColumnChart1
                                                                    labels={salesData.Customer_Name}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ('')
                                                            }
                                                            {(salesData.REGION && salesData.REGION.length !== 0) ? (
                                                                <DistributedColumnChart1
                                                                    labels={salesData.REGION}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="300"
                                                                    width='400'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.Year && salesData.Year.length !== 0) ? (
                                                                <DistributedColumnChart1
                                                                    labels={salesData.Year}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.SalesPerson && salesData.SalesPerson.length !== 0) ? (
                                                                <DistributedColumnChart1
                                                                    labels={salesData.SalesPerson}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="200"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.Month && salesData.Month.length !== 0) ? (
                                                                <DistributedColumnChart1
                                                                    labels={salesData.Month}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            </div>
                                
                            );
                            break;
                        case 'Here is the Pie Chart':
                            chartComponent = (
                                // <DistributedColumnChart1
                                //     labels={salesData.MATKL_Material_Category}
                                //     series={salesData.Total_Sales_Revenue}
                                //     height="320"
                                //     width="450"
                                // />
                                <div>
                                {(salesData.MATKL_Material_Category && salesData.MATKL_Material_Category.length !== 0) ? (
                                                                // <div style={{ width: '100%', height: '100vh' }}>
                                                                <PieCharts1
                                                                    labels={salesData.MATKL_Material_Category}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    // flag={totalSalesVQFLoder}
                                                                    // tilesLables="Total Sales by .."
                                                                    height="320"
                                                                    width="450"
                                                                    // height="100%"
                                                                    // width='100%'
                                                                // legend='Total Sales (₹)'
                                                                // format_func={formatRuppes}
                                
                                                                />
                                                                // </div>
                                                                ) : ''
                                                            }
                                
                                                            {(salesData.Customer_Name && salesData.Customer_Name.length !== 0) ? (
                                                                <PieCharts1
                                                                    labels={salesData.Customer_Name}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ('')
                                                            }
                                                        
                                                            {(salesData.REGION && salesData.REGION.length !== 0) ? (
                                                                <PieCharts1
                                                                    labels={salesData.REGION}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="300"
                                                                    width='400'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.Year && salesData.Year.length !== 0) ? (
                                                                <PieCharts1
                                                                    labels={salesData.Year}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.SalesPerson && salesData.SalesPerson.length !== 0) ? (
                                                                <PieCharts1
                                                                    labels={salesData.SalesPerson}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="200"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            {(salesData.Month && salesData.Month.length !== 0) ? (
                                                                <PieCharts1
                                                                    labels={salesData.Month}
                                                                    series={salesData.Total_Sales_Revenue}
                                                                    height="320"
                                                                    width='450'
                                
                                                                />) : ''
                                                            }
                                                            </div>
                                
                            );
                            break;
                        // Add more cases for other chart types as needed

                        default:
                            chartComponent = null;
                            break;
                    }
    
                    if (chartComponent) {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { text: chartComponent, sender: 'bot' },
                        ]);
                    }
                }
            } else {
                const userDetailsMessage = (
                    <p className="client_text">
                        No Data Available For This Client.
                    </p>
                );
    
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: userDetailsMessage, sender: 'bot' },
                ]);
            }
        } catch (error) {
            console.error("Error calling API:", error.message);
        } finally {
            setLoading(false);
        }
    };
    {
        chartData && (
            <div style={{ marginTop: '20px' }}>
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        )
    }

    // const handleSend = () => {
    //     // e.preventDefault();

    //     // Handle sending the query (e.g., make an API call)

    //     // Clear the input field after sending
    //     setUserInput('');
    //   };





    return (
        <div>
            <div id="chatDiv" className='chat_div'>
                {messages.map((message, index) => (
                    <div key={index}
                        style={{
                            marginBottom: '10px',
                            marginLeft: message.sender === 'user' ? '30px' : '0px',
                            marginRight: message.sender === 'user' ? '0px' : '30px',
                            textAlign: message.sender === 'user' ? 'justify' : 'justify', lineHeight: '2'
                        }}>
                        <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <span style={{ color: 'black', padding: '5px', borderRadius: '5px', background: message.sender === 'user' ? '#bfbfbf' : '#f1f1f1', color: message.sender === 'user' ? 'black' : '#0191E0' }}>
                                {message.sender === 'user' ? null : <TbRobot style={{ marginRight: '8px' }} />}
                                {message.text}
                                {message.sender === 'user' ? <FaUserTie style={{ marginLeft: '10px', marginTop: '6px', float: 'right' }} /> : null}
                            </span>
                        </span>
                    </div>
                ))}
                {/* Render buttons below the last bot reply */}
                {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && showYesNo && (
                    <div style={{ marginTop: '10px', textAlign: 'left' }}>
                        {/* <button className='option_btn1' onClick={() => handleClientSelect('Here Is The Chart')}> Do you Want To Show Chart</button>
                        <button className='option_btn' onClick={() => handleClientSelect('no')}>No</button> */}
                        {/* <button className='option_btn1' onClick={() => handleClientSelect('Yes')}>
                            Yes
                        </button>
                        <button className='option_btn1' onClick={() => handleClientSelect('No')}>
                            No
                        </button> */}

                    </div>
                )}
                {loading && (<BouncingDotsLoader />)}

                {/* Render buttons only if showButtons is true */}
                {/* {showButtons && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                    <div style={{ marginTop: '10px', textAlign: 'left' }}>
                        {isPlaying ? (
                            <button className='option_btn' onClick={pauseSpeech}>Pause</button>
                        ) : (
                            <button className='option_btn' onClick={resumeSpeech}>Resume</button>
                        )}
                        <button className='option_btn' onClick={() => handleButtonClick('no')}>No</button>
                    </div>
                )} */}

            </div>
            {/* Input field and submit button */}
            {/* <form onSubmit={handleInputSubmit} style={{ marginTop: '10px', display: 'flex' }}>
                <input className='input_filed' placeholder='Enter your query' type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                <button type="submit" className='send_button' ><BsSendFill style={{ fontSize: '25px' }} /></button>
               
            </form> */}
            <form onSubmit={handleInputSubmit} style={{ marginTop: '10px', display: 'flex' }}>
                <input className='input_filed' placeholder='Enter your query' type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                <button type="submit" className={`send_button ${submitting ? 'blocked-button' : ''}`} disabled={submitting}>
                    {submitting ? <ImBlocked style={{ fontSize: '25px', color: '#b8b894' }} /> : <BsSendFill style={{ fontSize: '25px', color: '#b8b894' }} />}
                </button>
            </form>
        </div>


    );
};

export default CustomSalesChatbot;