

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lsidebar from "./Lsidebar";
import "./ChatbotSection.css";
import userAvatar from "./images/Profile.svg";
import botAvatar from "./images/Chatbot.svg";
import sendIcon from "./images/sendicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';

const ChatbotSection = () => {
  // Load messages from localStorage on mount or when empty
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const userId = user.id;

  // Fetch initial messages from the backend and avoid duplicates
  useEffect(() => {
    apiClient
      .post("/api/chatbot/messages",{userId})
      .then((response) => {
        console.log(response.data);
        
        setMessages(response.data || []);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Check if the prompt already exists in the messages
    // const isDuplicate = messages.some(
    //   (msg) => msg.text === input && msg.sender === "user"
    // );

    // if (isDuplicate) {
    //   console.log("Duplicate prompt detected, not sending:", input);
    //   setInput(""); // Clear the input field
    //   return;
    // }

    const newMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      console.log("Sending message:", input);
      const response = await apiClient.post("/api/chatbot/send", {
        message: input,
      });
      console.log("Received response:", response.data);

      // Add the bot's response (no need to re-add the user message)
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, remove the user message from the state if the request fails
      setMessages((prevMessages) => prevMessages.filter((msg) => msg !== newMessage));
    }

    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
      <Lsidebar />

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
                  {msg.sender === "bot" && " ✨"}
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