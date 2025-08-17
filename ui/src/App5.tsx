import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RetellWebClient } from "retell-client-js-sdk";
import Lottie from 'lottie-react';
import listeningAnimation from './assets/l.json';
import logo from './assets/avatar.png';
import './chat.css';

interface RegisterCallResponse {
  access_token: string;
  call_id: string;
}

const retellWebClient = new RetellWebClient();

const ChatPage: React.FC = () => {
  const agentId = 'agent_389efc22e52f4145dc7eca35e2';
  const url = process.env.REACT_APP_url;
  console.log(url);
  const [conversationStatus, setConversationStatus] = useState("Initializing...");
  const [waveAnimating, setWaveAnimating] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const currentCallIdRef = useRef<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { name, age, gender } = location.state || { name: "aman", age: "20", gender: "male" };

  async function registerCall(
    agentId: string,
    user_name: string,
    age: string,
    gender: string
  ): Promise<RegisterCallResponse> {
    try {
      const response = await fetch(`${url}/create-web-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          retell_llm_dynamic_variables: { user_name, age, gender },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error during call registration:", err);
      throw new Error("Failed to register call");
    }
  }

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const registerCallResponse = await registerCall(agentId, name, age, gender);
        if (registerCallResponse.access_token) {
          console.log("Call Registered:", registerCallResponse);
          currentCallIdRef.current = registerCallResponse.call_id;
          console.log("callid set", registerCallResponse.call_id);
          await retellWebClient.startCall({
            accessToken: registerCallResponse.access_token,
          });
          setConversationStatus("Active");
        }
      } catch (err) {
        console.error("Error during call initialization:", err);
        setConversationStatus("Connection Failed");
      }
    };

    initializeCall();

    retellWebClient.on("call_started", () => {
      console.log("Call started");
      setConversationStatus("Active");
      setWaveAnimating(true);
    });

    retellWebClient.on("call_ended", async () => {
      console.log("Call ended");
      setConversationStatus("Completed");
      setWaveAnimating(false);
      const currentCallId = currentCallIdRef.current;
      console.log(currentCallId);
      setTimeout(() => {
        navigate("/thank-you", { state: { callId: currentCallId } });
      }, 2000);
    });

    retellWebClient.on("agent_start_talking", () => setWaveAnimating(true));
    retellWebClient.on("agent_stop_talking", () => setWaveAnimating(false));

    retellWebClient.on("update", (update) => {
      const lastKey = Object.keys(update.transcript).pop();
      if (update.transcript && update.transcript[lastKey].role === "agent") {
        setTranscript((prev) => [update.transcript[lastKey].content]);
      }
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      setConversationStatus("Error");
      retellWebClient.stopCall();
    });

    return () => {
      retellWebClient.stopCall();
    };
  }, [name, age, gender, navigate, agentId, url]);

  return (
    <div className="chat-container">
      <div className="top-bar">
        <div className="logo-container">
          <img src={logo} alt="Ultra Care Logo" className="logo-image" />
        </div>
        <div className="user-info">
          <div className="user-detail">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{name}</span>
          </div>
          <div className="user-detail">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{age}</span>
          </div>
          <div className="user-detail">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{gender}</span>
          </div>
        </div>
      </div>

      <div className="chat-card fade-in">
        <div className="status-bar">
          <div className={`status-indicator ${conversationStatus.toLowerCase()}`}></div>
          <span className="status-text">Conversation Status: {conversationStatus}</span>
        </div>

        {transcript.length > 0 && (
          <div className="transcript-section">
            <div className="transcript-content">
              {transcript.map((text, index) => (
                <div key={index} className="message-bubble">
                  <div className="message-header">
                    <span className="agent-name">AI Assistant</span>
                    <span className="message-time">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <p className="message-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lottie-container">
        <Lottie 
          animationData={listeningAnimation}
          loop={true}
          autoplay={true}
          className="lottie-animation"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default ChatPage;
