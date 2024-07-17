import React, { useState,useEffect } from "react";
import { apiService } from "../../service/api-service";
import "./ChatboxCustom.css"; // Import your CSS file for styling
// {clearAllData}
const ChatboxCustom = () => {
  const [userResponse, setUserResponse] = useState(null);
  const [apiResponses, setApiResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [apiResponses2, setApiResponses2] = useState([]);

  const [userInput, setUserInput] = useState(""); // Add state for user input
  const [responseText, setResponseText] = useState([]);

  const handleButtonClick = async (response) => {
    setUserResponse(response);
    setLoading(true);
    try {
      const newResponse = await apiService.SupplierLeadTimeVariabilityChatData({
        user_response: response,
      });
      // console.log('API Response:', newResponse);
      setApiResponses((prevResponses) => [...prevResponses, newResponse]);
    } catch (error) {
      console.error("Error calling API:", error.message);
    } finally {
      setLoading(false);
    }
  };
  // clearAllData=()=>{
  //   console.log('clear data')
  //   setResponseText([])
  //   setApiResponses([])
  //   setApiResponses2([])
  // }

  const handleClientSelect = async (clientName) => {
    setSelectedClient(clientName);
    setLoading(true);
    try {
      const apiResponse = await apiService.getSummarySupplierLeadTimeVariability(
        {
          client: clientName,
        }
      );
      console.log("table data is ", apiResponse);
      setApiResponses2((prevResponses) => [...prevResponses, apiResponse]);
    } catch (error) {
      console.error("Error calling API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderButtons = () => {
    if (userResponse === "yes") {
      return (
        <div className="user-buttons">
          <button
            className="button-88"
            onClick={() => handleButtonClick("yes")}
          >
            Yes
          </button>
          <button className="button-88" onClick={() => handleButtonClick("no")}>
            No
          </button>
        </div>
      );
    } else if (userResponse === "no") {
      return <div className="user-buttons"></div>;
    }
    return null;
  };



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

  const renderTable = () => {
    console.log('selectedClient', selectedClient);

    if (selectedClient && apiResponses2.length > 0) {
      const clientResponses = apiResponses2.filter(
        (response) => response.Clients && response.Clients.length > 0
      );
      console.log('clientResponses', clientResponses);

      if (clientResponses.length > 0) {
        const selectedClientData = clientResponses.flatMap((response) =>
          response.Clients.filter(
            (clientDetails) =>
              clientDetails.MTEXT_Client_Name === selectedClient
          )
        );

        if (selectedClientData.length > 0) {
          return (
            <table>
              <thead>
                <tr>
                  {/* <th>Client Name</th> */}
                  <th>Material Category</th>
                  <th>Month</th>
                  {/* <th>Supplier Lead Time Variability</th> */}
                  <th>Total Date Difference</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {selectedClientData.map((clientDetails, index) => (
                  <tr key={index}>
                    {/* <td>{clientDetails.MTEXT_Client_Name}</td> */}
                    <td>{clientDetails.Metirial_Category}</td>
                    <td>{clientDetails.Month}</td>
                    {/* <td>{clientDetails.Supplier_Lead_Time_Variability}</td> */}
                    <td>{clientDetails.Total_Date_diff}</td>
                    <td>{clientDetails.Year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else {
          return (
            <p className="button-client">
              No Data Available For The Selected Client.
            </p>
          );
        }
      } else {
        return (
          <p className="button-client">No Data Available For Any Client.</p>
        );
      }
    }
    return null;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };


useEffect(() => {
  const chatDiv = document.getElementById('chatDiv');
  chatDiv.scrollTop = chatDiv.scrollHeight;
}, [apiResponses,selectedClient,apiResponses2,userInput,responseText]);

  return (
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
          There is something unusual about your different suppliers. Do you want
          to know ?
        </p>

      </div>

      <div className="user-buttons">
        <button className="button-88" onClick={() => handleButtonClick("yes")}>
          Yes
        </button>
        <button className="button-88" onClick={() => handleButtonClick("no")}>
          No
        </button>
      </div>

      {/* {renderButtons()} */}


      {apiResponses.map((response, index) => (
        <div key={index}>
          <div className="">
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
          </div>

          {response.msg && (
            <div className="">
              <div className="bot-icon">
                <img
                  alt="profile-user"
                  width="30px"
                  height="40px"
                  src={`../../assets/images/chatbot.jpg`}
                />
              </div>
              <div className="bot-message">
                <p className="message-content">{response.msg}</p>
              </div>
            </div>
          )}

          {response.Clients && response.Clients.Clients && (
            <div className="">
              <div className="bot-icon">
                <img
                  alt="profile-user"
                  width="30px"
                  height="40px"
                  src={`../../assets/images/chatbot.jpg`}
                />
              </div>
              <div className="">
                <div className="client-box-container">
                  <p className="client-name">Client Name</p>
                  {response.Clients.Clients.map((client, index) => (
                    <div key={index} className="client-box">
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
              </div>
            </div>

          )}
          {renderButtons()}

        </div>
      ))}

      {renderTable()}




      

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
          placeholder="Type your message..."
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
  );
};

export default ChatboxCustom;