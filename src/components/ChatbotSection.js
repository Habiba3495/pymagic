import React, { useState, useEffect, useRef } from "react";
import Lsidebar from "./Sidebar";
import "./ChatbotSection.css";
import userAvatar from "./images/Profile.svg";
import botAvatar from "./images/Chatbot.svg";
import sendIcon from "./images/sendicon.svg";
import { useAuth } from '../context/AuthContext';
import apiClient from '../services';
import { useTranslation } from "react-i18next";
import trackEvent from '../utils/trackEvent';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNavigate } from "react-router-dom";
import Loading from "./Loading.js"; 

const ChatbotSection = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula}
          language={match[1]}
          PreTag="div"
          {...props}
          customStyle={{ direction: 'ltr', textAlign: 'left' }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} style={{ direction: 'ltr' }}>
          {children}
        </code>
      );
    },
  };

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !user.id) return;

    trackEvent(user.id, 'pageview', {
      page: '/chatbot',
      category: 'Navigation',
    }, user).catch((error) => {
      console.error('Failed to track pageview:', error);
    });

    const fetchMessages = async () => {
      try {
        const response = await apiClient.post("/api/chatbot/messages", { userId: user.id });

        trackEvent(user.id, 'chatbot_messages_loaded', {
          category: 'Chatbot',
          label: 'Initial Messages Loaded',
          message_count: response.data?.length || 0,
        }, user).catch((error) => {
          console.error('Failed to track chatbot_messages_loaded:', error);
        });

        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(t("errorFetchingMessages"));
        trackEvent(user.id, 'chatbot_error', {
          category: 'Error',
          label: 'Message Load Error',
          error: error.message,
        }, user).catch((error) => {
          console.error('Failed to track chatbot_error:', error);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, t, navigate]);

  const sendMessage = async () => {
    if (!user || !user.id) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    trackEvent(user.id, 'chatbot_message_sent', {
      category: 'Chatbot',
      label: 'User Message Sent',
      message_length: input.length,
      message_hash: hashCode(input),
    }, user).catch((error) => {
      console.error('Failed to track chatbot_message_sent:', error);
    });

    try {
      const detectedLanguage = isArabic(input) ? 'ar' : i18n.language;
      console.log("Sending language:", detectedLanguage);

      const response = await apiClient.post("/api/chatbot/send", {
        userId: user.id,
        message: input,
      }, {
        headers: {
          'Accept-Language': detectedLanguage,
        },
      });

      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages([...newMessages, botMessage]);

      trackEvent(user.id, 'chatbot_response_received', {
        category: 'Chatbot',
        label: 'Bot Response Received',
        response_length: response.data.reply.length,
        response_time: response.headers['x-response-time'] || null,
      }, user).catch((error) => {
        console.error('Failed to track chatbot_response_received:', error);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError(t("errorSendingMessage"));
      setMessages(messages);

      trackEvent(user.id, 'chatbot_error', {
        category: 'Error',
        label: 'Chatbot Response Error',
        error: error.message,
        user_message: input,
      }, user).catch((error) => {
        console.error('Failed to track chatbot_error:', error);
      });
    }
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="chatbot-wrapper">
        <div className="errormessage">
          {error}
          <button className="tryagain" onClick={() => window.location.reload()}>
            {t("tryAgain")}
          </button>
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
                style={{
                  textAlign: isArabic(msg.text) ? 'right' : 'left',
                }}
                onClick={() => {
                  if (user?.id) {
                    trackEvent(user.id, 'chatbot_message_clicked', {
                      category: 'Chatbot',
                      label: 'Message Clicked',
                      sender: msg.sender,
                      message_length: msg.text.length,
                    }, user).catch((error) => {
                      console.error('Failed to track chatbot_message_clicked:', error);
                    });
                  }
                }}
              >
                {msg.sender === "bot" && (
                  <img src={botAvatar} alt="Bot" className="avatar" />
                )}
                <div className="message-text">
                  {msg.sender === "user" ? (
                    <span>{msg.text}</span>
                  ) : (
                    <ReactMarkdown components={components}>
                      {msg.text}
                    </ReactMarkdown>
                  )}
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
                if (user?.id) {
                  trackEvent(user.id, 'chatbot_enter_used', {
                    category: 'Chatbot',
                    label: 'Enter Key Used',
                  }, user).catch((error) => {
                    console.error('Failed to track chatbot_enter_used:', error);
                  });
                }
                sendMessage();
              }
            }}
            style={{ direction: isArabic(input) ? 'rtl' : 'ltr' }}
          />
          <button
            onClick={() => {
              sendMessage();
              if (user?.id) {
                trackEvent(user.id, 'chatbot_send_clicked', {
                  category: 'Chatbot',
                  label: 'Send Button Clicked',
                }, user).catch((error) => {
                  console.error('Failed to track chatbot_send_clicked:', error);
                });
              }
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