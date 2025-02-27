import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lsidebar from "./Lsidebar";  
import "./ChatbotSection.css";

const ChatbotSection = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Fetch previous messages from API
  useEffect(() => {
    axios
      .get("https://your-api.com/messagesnpm start")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  // Handle sending messages
  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post("https://your-api.com/send", {
        message: input,
      });
      setMessages([
        ...messages,
        newMessage,
        { text: response.data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      
      <Lsidebar active="Chatbot" />

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-header">Ask Anything</div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" && (
                <img src="/bot-avatar.png" alt="Bot" className="avatar" />
              )}
              <div className="message-text">{msg.text}</div>
              {msg.sender === "user" && (
                <img src="/user-avatar.png" alt="User" className="avatar" />
              )}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Box */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➡️</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSection;