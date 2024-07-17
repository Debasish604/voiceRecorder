import React, { useState, useEffect } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import { BsSendFill } from "react-icons/bs";
import '../../style/Chatbot.css'
import BouncingDotsLoader from './BouncingDotsLoader';
import { apiService } from '../../service/api-service';


const CustomChatbot = () => {
    const { speechSynthesis, SpeechSynthesisUtterance } = window;
    const [messages, setMessages] = useState([{ text: '', sender: 'bot' }]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showYesNo, setShowYesNo] = useState(false);
    // const [selectedClient, setSelectedClient] = useState('');
    // const [showButtons, setShowButtons] = useState(true);
    // const [isPlaying, setIsPlaying] = useState(false); // State for tracking speech synthesis playback


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

    // const speakMessage = (text) => {
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     // You can customize the voice and other properties of the utterance here
    //     speechSynthesis.speak(utterance);
    // };


    const handleButtonClick = async (response) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: response, sender: 'user' },
        ]);
        setLoading(true);
        try {
            const newResponse = await apiService.SupplierRiskScoreForecast_chatButton({
                user_response: response.toLowerCase(),
            });

            setLoading(false);
            setShowYesNo(false);
            // speakMessage(newResponse.data);
            // setShowButtons(false);
            await simulateBotTyping(newResponse.data, 60);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: newResponse.data, sender: 'bot' },
            ]);

            if (newResponse.msg && newResponse.msg.length > 0) {
                // speakMessage(newResponse.msg[0]);
                await simulateBotTyping(newResponse.msg[0], 60);
                setShowYesNo(true);
            }
            if (newResponse.Clients) {
                setShowYesNo(false);
                const userListMessage = (
                    <div className="client_box_container">
                        <p className="client_text">Client Name</p>
                        {newResponse.Clients.Clients.map((client, index) => (
                            <div key={index} className="client_box">
                                <input
                                    type="radio"
                                    id={`clientRadio${index}`}
                                    name="clientRadio"
                                    value={client.MTEXT_ClientName}
                                    onChange={() =>
                                        handleClientSelect(client.MTEXT_ClientName)
                                    }
                                />
                                <label htmlFor={`clientRadio${index}`}>
                                    <p className="message-content">{`${client.MTEXT_ClientName}`}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                );
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: userListMessage, sender: 'bot' },
                ]);
            }

        } catch (error) {
            console.error('Error calling API:', error.message);
        } finally {
            // setShowYesNo(true);
        }
        setUserInput('');
    };

    const handleInputSubmit = async (e) => {
        e.preventDefault();

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userInput, sender: 'user' },
        ]);
        // const botResponse = generateBotResponse(userInput);
        setLoading(true);
        const apiResponse = await apiService.user_input_insight({ user_input: userInput });
        setLoading(false);
        // speakMessage(apiResponse.data);
        await simulateBotTyping(apiResponse.data, 50);
        setUserInput('');
    };

    useEffect(() => {
        const chatDiv = document.getElementById('chatDiv');
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }, [messages]);

    useEffect(() => {
        // speakMessage('There is something unusual about your different suppliers. Do you want to know ?');
        const welcome='There is something unusual about your different suppliers. Do you want to know ?'
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

    const onLoadWelcome = async(welcome)=>{
        await simulateBotTyping(welcome, 60);
        setShowYesNo(true);
    }


    const handleClientSelect = async (clientName) => {
        // setSelectedClient(clientName);
        setLoading(true);
        try {
            const apiResponse = await apiService.get_summary_SupplierRiskScoreData({ client: clientName, });
            if (apiResponse.status === 'success' && apiResponse.clients.length !== 0) {
                setShowYesNo(false);
                const userDetailsMessage = (
                    <div>
                        <label className="client_text">{clientName}</label>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Category</th>
                                    <th>Month</th>
                                    <th>Supplier Quality Index</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiResponse.clients.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Product_category}</td>
                                        <td>{row.BUDAT_PostingDateintheDocument_Month}</td>
                                        <td style={{textAlign:'center'}}>{row['Supplier Quality Index']}</td>
                                        <td>{row.BUDAT_PostingDateintheDocument_YEAR}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: userDetailsMessage, sender: 'bot' },
                ]);

            }
            else {
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

    // const speakMessage = (text) => {
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     utterance.onstart = () => {
    //         setIsPlaying(true);
    //     };
    //     utterance.onend = () => {
    //         setIsPlaying(false);
    //     };
    //     speechSynthesis.speak(utterance);
    // };

    // const pauseSpeech = () => {
    //     speechSynthesis.pause();
    //     setIsPlaying(false);
    // };

    // const resumeSpeech = () => {
    //     speechSynthesis.resume();
    //     setIsPlaying(true);
    // };


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
                            <span style={{ color: 'black', padding: '5px', borderRadius: '5px', background: message.sender === 'user' ? '#bfbfbf' : '#f1f1f1', color: message.sender === 'user' ? 'black' : 'red' }}>
                                {message.sender === 'user' ? null : <FaRobot style={{ marginRight: '8px' }} />}
                                {message.text}
                                {message.sender === 'user' ? <FaUser style={{ marginLeft: '10px', marginTop: '6px', float: 'right' }} /> : null}
                            </span>
                        </span>
                    </div>
                ))}
                {/* Render buttons below the last bot reply */}
                {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && showYesNo && (
                    <div style={{ marginTop: '10px', textAlign: 'left' }}>
                        <button className='option_btn' onClick={() => handleButtonClick('yes')}>Yes</button>
                        <button className='option_btn' onClick={() => handleButtonClick('no')}>No</button>
                    </div>
                )}
                {loading &&  (<BouncingDotsLoader />)}

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
            <form onSubmit={handleInputSubmit} style={{ marginTop: '10px', display: 'flex' }}>
                <input className='input_filed' placeholder='Enter your query' type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                <button type="submit" className='send_button'><BsSendFill style={{fontSize:'25px'}} /></button>
            </form>
        </div>
    );
};

export default CustomChatbot;