import React, { useEffect, useState } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";
import { useLocation } from 'react-router-dom';
import avatarImage from './assets/avatar.png';
const agentId = "agent_dfc93fde3e455a157b5a10f911";

interface RegisterCallResponse {
  access_token: string;
}

const retellWebClient = new RetellWebClient();

const App = () => {
  const [isCalling, setIsCalling] = useState(false);
  const location = useLocation();
  const { name, age, gender } = location.state || {};
  const [transcript, setTranscript] = useState<string[]>([]);
  
  // Initialize the SDK
  useEffect(() => {
    retellWebClient.on("call_started", () => {
      console.log("call started");
    });
    
    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
    });
    
    // When agent starts talking for the utterance
    // useful for animation
    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
    });
    
    // When agent is done talking for the utterance
    // useful for animation
    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
    });
    
    // Real time pcm audio bytes being played back, in format of Float32Array
    // only available when emitRawAudioSamples is true
    retellWebClient.on("audio", (audio) => {
      // console.log(audio);
    });
    
    // Update message such as transcript
    // You can get transcrit with update.transcript
    // Please note that transcript only contains last 5 sentences to avoid the payload being too large
    retellWebClient.on("update", (update) => {
      console.log(update.transcript);
      console.log(Object.keys(update.transcript));
      const lastKey = Object.keys(update.transcript).pop();
// console.log("Last Key:", lastKey); // Output: "city"
// console.log(update.transcript[lastKey].content);
    //  console.log("Type of myObject:", typeof update.transcript);
      if (update.transcript && update.transcript[lastKey].role === 'agent') {
        setTranscript(prev => [ update.transcript[lastKey].content]); // Append new content to the transcript
      }
      // console.log(update);
    });
    
    retellWebClient.on("metadata", (metadata) => {
      // console.log(metadata);
    });
    
    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      // Stop the call
      retellWebClient.stopCall();
    });
  }, []);

  const toggleConversation = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
    } else {
      const registerCallResponse = await registerCall(agentId,name,age,gender);
      if (registerCallResponse.access_token) {
        retellWebClient
          .startCall({
            accessToken: registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true); // Update button to "Stop" when conversation starts
      }
    }
  };

  async function registerCall(agentId: string,user_name: string,age: string,gender: string): Promise<RegisterCallResponse> {
    try {
      // Update the URL to match the new backend endpoint you created
      const response = await fetch("http://localhost:8080/create-web-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId, // Pass the agentId as agent_id
          // You can optionally add metadata and retell_llm_dynamic_variables here if needed
          // metadata: { your_key: "your_value" },
           retell_llm_dynamic_variables: { user_name: user_name,age:age,gender:gender }
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
    {/* Farmako Logo */}
    <div className="p-4">
      <img src={avatarImage} alt="Farmako" className="h-8" />
    </div>

    {/* Main Card Container */}
    <div className="max-w-6xl mx-auto mt-4 rounded-2xl bg-[#1e1e1e] min-h-[80vh] relative p-6">
      {/* Top Start/Stop Button */}
      <button 
        onClick={toggleConversation}
        className="absolute top-6 right-40 px-6 py-2 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
      >
        {isCalling ? "Stop" : "Start"}
      </button>

      {/* User Info */}
      <div className="absolute top-6 right-6 text-right">
        <h2 className="text-2xl font-normal">{name || 'aman'}</h2>
        <p className="text-sm text-gray-400 mt-1">{age || '20'} years, {gender || 'male'}</p>
        <p className="text-xs text-gray-500 mt-4">
          {new Date().toLocaleTimeString()} · Conversation started
        </p>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center h-[60vh]">
        {/* Avatar */}
        <div className="w-32 h-32 bg-[#2a2a2a] rounded-full overflow-hidden mb-8">
          <img 
            src={avatarImage}
            alt="AI Assistant" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Audio Visualization Bars */}
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4].map((bar) => (
            <div 
              key={bar}
              className="w-1 h-4 bg-white rounded-full"
            />
          ))}
        </div>

        {/* Transcript Container */}
        <div className="w-full max-w-2xl mt-8">
          {transcript.map((text, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 mb-4"
            >
              <img 
                src={avatarImage}
                alt="Agent" 
                className="w-10 h-10 rounded-full"
              />
              <p className="text-green-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>);
};

export default App;
