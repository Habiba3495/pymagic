// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Lsidebar from "./Lsidebar";
// import "./ChatbotSection.css";
// import userAvatar from "./images/Profile.svg";
// import botAvatar from "./images/Chatbot.svg"; 
// import sendIcon from "./images/sendicon.svg";

// const ChatbotSection = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     axios
//       .get("https://your-api.com/messages")
//       .then((response) => setMessages(response.data))
//       .catch((error) => console.error("Error fetching messages:", error));
//   }, []);

//   const sendMessage = async () => {
//     if (input.trim() === "") return;

//     const newMessage = { text: input, sender: "user" };
//     setMessages([...messages, newMessage]);

//     try {
//       const response = await axios.post("https://your-api.com/send", {
//         message: input,
//       });
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         newMessage,
//         { text: response.data.reply, sender: "bot" },
//       ]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }

//     setInput("");
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="chatbot-wrapper">
//       <div className="sidebar-container">
//         <Lsidebar active="Chatbot" />
//       </div>

//       <div className="chatbot-container">
//         <div className="chat-section">
//           <div className="chat-header">Ask Anything</div>

//           <div className="chat-messages">
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.sender}`}>
//                 {msg.sender === "bot" && (
//                   <img src={botAvatar} alt="Bot" className="avatar" />
//                 )}
//                 <div className="message-text">{msg.text}</div>
//                 {msg.sender === "user" && (
//                   <img src={userAvatar} alt="User" className="avatar" />
//                 )}
//               </div>
//             ))}
//             <div ref={chatEndRef}></div>
//           </div>
//         </div>

//         {/* ❗ تم نقل input-container ليكون خارج الشات ❗ */}
//         <div className="input-container">
//           <input
//             type="text"
//             placeholder="Ask..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button onClick={sendMessage} className="send-button">
//             <img src={sendIcon} alt="Send" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatbotSection;



// ChatbotSection.js


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lsidebar from "./Lsidebar";
import "./ChatbotSection.css";
import userAvatar from "./images/Profile.svg";
import botAvatar from "./images/Chatbot.svg";
import sendIcon from "./images/sendicon.svg";
import apiClient from '../services';

const ChatbotSection = () => {
  // Load messages from localStorage on mount or when empty
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Fetch initial messages from the backend
    apiClient
      .get("/api/chatbot/messages")
      .then((response) => {
        setMessages((prevMessages) => {
          const newMessages = response.data.filter(
            (msg) => !prevMessages.some((m) => m.text === msg.text && m.sender === msg.sender)
          );
          return [...prevMessages, ...newMessages];
        });
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;
  
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
  
    try {
      console.log("Sending message:", input); // Debug log
  
      const response = await apiClient.post("/api/chatbot/send", {
        message: input,
      });
      console.log("Received response:", response.data); // Debug log  
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
        { text: response.data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      <div className="sidebar-container">
        <Lsidebar active="Chatbot" />
      </div>

      <div className="chatbot-container">
        <div className="chat-section">
          <div className="chat-header">Ask Your Magical Python Wizard</div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <img src={botAvatar} alt="Bot" className="avatar" />
                )}
                <div className="message-text">
                  {msg.text}
                  {msg.sender === "bot" && " ✨"} {/* Add sparkle for bot responses */}
                </div>
                {msg.sender === "user" && (
                  <img src={userAvatar} alt="User" className="avatar" />
                )}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Ask a magical Python question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="send-button">
            <img src={sendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSection;