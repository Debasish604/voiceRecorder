import React, { useState, useEffect } from "react";
import { apiService } from "../../service/api-service";
import "./Question-answer.css"; // Import your CSS file for styling
import { Box } from "@material-ui/core";
// {clearAllData}
const QuestionAnswer = () => {
  const [loading, setLoading] = useState(false);

  const [userInput, setUserInput] = useState(""); // Add state for user input
  const [responseText, setResponseText] = useState([]);

  const handleSendClick = async () => {
    setLoading(true);
    try {
      setUserInput("");
      const qunObj = { data: userInput, responseType: 'Q' };
      setResponseText((prevResponses) => [...prevResponses, qunObj]);
      const apiResponse = await apiService.user_input_insight({
        user_input: userInput,
      });
      const AnsObj = { data: apiResponse.data, responseType: 'A' };
      setResponseText((prevResponses) => [...prevResponses, AnsObj]);

      console.log("user apiResponse", apiResponse);
    } catch (error) {
      console.error("Error calling API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  const getGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime >= 5 && currentTime < 12) {
      return "Good Morning";
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const storedName = localStorage.getItem('Name');
  useEffect(() => {
    const chatDiv = document.getElementById('chatDiv');
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [userInput, responseText]);

  return (
    <div id='chatall'>
      <div className="chat-container" id='chatDiv'>
        <div className="bot-icon">
          <img
            alt="profile-user"
            width="30px"
            height="40px"
            src={`../../assets/images/chatbot.jpg`}
          />
        </div>
        <div className="bot-message">
          <p className="message-content ">
            {getGreeting()} {storedName ? ` ${storedName},` : ''} If You Have Any Question Feel Free To Ask, Type Your Question
          </p>
        </div>

        {responseText.map((response, index) => (
          <>
            {response.responseType == "Q" && (
              <div className="response-box">
                <div className="">
                  <img className="profile-user-image"
                    alt="profile-user"
                    width="30px"
                    height="30px"
                    src={`../../assets/images/customer.png`}
                  />
                </div>
                <div className="message-orange">
                  <p className="message-content">{response.data}</p>
                </div>
              </div>)}

            {response.responseType == "A" && (
              <div className="response-box">
                <div className="bot-icon">
                  <img
                    alt="profile-user"
                    width="30px"
                    height="40px"
                    src={`../../assets/images/chatbot.jpg`}
                  />
                </div>
                <div className="bot-message">
                  <p className="message-content">{response.data}</p>
                </div>
              </div>)}
          </>
        ))}
        {loading && (
          <div className="loader" style={{ color: "black" }}>
            ...
          </div>
        )}

        <div className="user-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="user-input"
          />
          <button
            className="button-send"
            onClick={handleSendClick}
            disabled={loading}
          >
            send
          </button>
        </div>
      </div>

    </div>

  );
};

export default QuestionAnswer;