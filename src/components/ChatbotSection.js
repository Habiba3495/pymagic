import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lsidebar from "./Lsidebar";
import "./ChatbotSection.css";
import userAvatar from "./images/Profile.svg";
import botAvatar from "./images/Chatbot.svg"; 
import sendIcon from "./images/sendicon.svg";

const ChatbotSection = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://your-api.com/messages")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post("https://your-api.com/send", {
        message: input,
      });
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
          <div className="chat-header">Ask Anything</div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <img src={botAvatar} alt="Bot" className="avatar" />
                )}
                <div className="message-text">{msg.text}</div>
                {msg.sender === "user" && (
                  <img src={userAvatar} alt="User" className="avatar" />
                )}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        {/* ❗ تم نقل input-container ليكون خارج الشات ❗ */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask..."
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