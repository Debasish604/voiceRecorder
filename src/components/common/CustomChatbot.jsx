import React, { useState, useEffect } from 'react';

const CustomChatbot = () => {
  const [messages, setMessages] = useState([
    { text: 'Welcome! How can I assist you?', sender: 'bot' }
  ]);

  const handleButtonClick = (response) => {
    setMessages([
      ...messages,
      { text: response, sender: 'user' },
      // { text: generateBotResponse(response), sender: 'bot' },
      { text: generateBotResponse(response), sender: 'bot' },
    ]);
  };

  const generateBotResponse = (userInput) => {
    if (userInput.toLowerCase() === 'yes') {
      return 'Great! You chose yes.';
    }
    else if (userInput.toLowerCase() === 'no') {
      return 'Oh, you chose no.';
    }
    else {
      return "I'm sorry, I only understand yes or no.";
    }
  };




  useEffect(() => {
    const chatDiv = document.getElementById('chatDiv');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [messages]);

  return (
    <div>
      <div id="chatDiv" style={{ height: '300px', minWidth: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <span style={{ color: 'black', padding: '5px', borderRadius: '5px', background: message.sender === 'user' ? '#bfbfbf' : '#f1f1f1', color: message.sender === 'user' ? 'black' : 'red' }}>
              {message.text}
            </span>
          </div>
        ))}
        {/* Render buttons below the last bot reply */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
          <div style={{ marginTop: '10px', textAlign: 'left' }}>
            <button onClick={() => handleButtonClick('yes')}>Yes</button>
            <button onClick={() => handleButtonClick('no')}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomChatbot;



