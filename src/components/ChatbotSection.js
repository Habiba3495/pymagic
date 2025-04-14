import React, { useState, useEffect, useRef } from "react";
import Lsidebar from "./Lsidebar";
import "./ChatbotSection.css";
import userAvatar from "./images/Profile.svg";
import botAvatar from "./images/Chatbot.svg";
import sendIcon from "./images/sendicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import trackEvent from '../utils/trackEvent';

const ChatbotSection = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {

    if (user?.id) {
      trackEvent(user.id, 'pageview', { 
        page: '/chatbot',
        category: 'Navigation'
      });
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await apiClient.post("/api/chatbot/messages", { userId: user.id });
        
        // Track successful message load
        trackEvent(user.id, 'chatbot_messages_loaded', {
          category: 'Chatbot',
          label: 'Initial Messages Loaded',
          message_count: response.data?.length || 0
        });

        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
        
        // Track message load error
        trackEvent(user.id, 'chatbot_error', {
          category: 'Error',
          label: 'Message Load Error',
          error: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    // Track message sent
    trackEvent(user.id, 'chatbot_message_sent', {
      category: 'Chatbot',
      label: 'User Message Sent',
      message_length: input.length,
      message_hash: hashCode(input) // For tracking without storing content
    });

    try {
      const response = await apiClient.post("/api/chatbot/send", {
        userId: user.id,
        message: input
      });

      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages([...newMessages, botMessage]);

      // Track bot response
      trackEvent(user.id, 'chatbot_response_received', {
        category: 'Chatbot',
        label: 'Bot Response Received',
        response_length: response.data.reply.length,
        response_time: response.headers['x-response-time'] || null
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to get response from the wizard");
      setMessages(messages); // Revert to previous messages
      
      // Track chatbot error
      trackEvent(user.id, 'chatbot_error', {
        category: 'Error',
        label: 'Chatbot Response Error',
        error: error.message,
        user_message: input
      });
    }
  };

  // Helper function to create a simple hash of messages for tracking
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="chatbot-wrapper">
        <div className="loading-indicator">Loading chat history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chatbot-wrapper">
        <div className="errormessage">
          {error}
          <button className = "tryagain" onClick={() => window.location.reload()}>{t("Try Again")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <Lsidebar />

        <div className="chat-section">
          <div className="chat-header">{t("askPythonWizard")}</div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.sender}`}
                onClick={() => {
                  // Track message click
                  trackEvent(user.id, 'chatbot_message_clicked', {
                    category: 'Chatbot',
                    label: 'Message Clicked',
                    sender: msg.sender,
                    message_length: msg.text.length
                  });
                }}
              >
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
            placeholder={t("askPythonQuestion") || "Ask a magical Python question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Track enter key usage
                trackEvent(user.id, 'chatbot_enter_used', {
                  category: 'Chatbot',
                  label: 'Enter Key Used'
                });
                sendMessage();
              }
            }}
          />
          <button 
            onClick={() => {
              sendMessage();
              // Track send button click
              trackEvent(user.id, 'chatbot_send_clicked', {
                category: 'Chatbot',
                label: 'Send Button Clicked'
              });
            }} 
            className="send-button"
          >
            <img src={sendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSection;