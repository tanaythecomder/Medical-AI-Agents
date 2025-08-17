import React, { useEffect, useState } from "react";
import "./App.css"; // Add wave animations to this CSS file
import { RetellWebClient } from "retell-client-js-sdk";
import { useLocation } from "react-router-dom";
import avatarImage from "./assets/avatar.png";

const agentId = "agent_dfc93fde3e455a157b5a10f911";
const retellWebClient = new RetellWebClient();

interface RegisterCallResponse {
  access_token: string;
}

const App = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false); // Track if the agent is talking
  const [transcript, setTranscript] = useState<string[]>([]);
  const location = useLocation();
  const { name, age, gender } = location.state || {};

  useEffect(() => {
    retellWebClient.on("call_started", () => {
      console.log("call started");
    });

    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
      setIsAgentTalking(false); // Stop the wave animation
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
      setIsAgentTalking(true); // Start the wave animation
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
      setIsAgentTalking(false); // Stop the wave animation
    });

    retellWebClient.on("update", (update) => {
        console.log(update.transcript);
      const lastKey = Object.keys(update.transcript).pop();
      if (update.transcript && update.transcript[lastKey].role === "agent") {
        setTranscript((prev) => [update.transcript[lastKey].content]);
        setIsAgentTalking(true); // Trigger wave animation on new transcription
      }

    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      retellWebClient.stopCall();
    });
  }, []);

  const toggleConversation = async () => {
    if (isCalling) {
      retellWebClient.stopCall();
    } else {
      const registerCallResponse = await registerCall(agentId, name, age, gender);
      if (registerCallResponse.access_token) {
        retellWebClient
          .startCall({ accessToken: registerCallResponse.access_token })
          .catch(console.error);
        setIsCalling(true);
      }
    }
  };

  async function registerCall(agentId: string, user_name: string, age: string, gender: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch("http://localhost:8080/create-web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agentId,
          retell_llm_dynamic_variables: { user_name, age, gender },
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err as string);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="p-4">
        <img src={avatarImage} alt="Farmako" className="h-8" />
      </div>

      <div className="max-w-6xl mx-auto mt-4 rounded-2xl bg-[#1e1e1e] min-h-[80vh] relative p-6">
        <button
          onClick={toggleConversation}
          className="absolute top-6 right-40 px-6 py-2 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          {isCalling ? "Stop" : "Start"}
        </button>

        <div className="absolute top-6 right-6 text-right">
          <h2 className="text-2xl font-normal">{name || "aman"}</h2>
          <p className="text-sm text-gray-400 mt-1">{age || "20"} years, {gender || "male"}</p>
          <p className="text-xs text-gray-500 mt-4">
            {new Date().toLocaleTimeString()} · {isCalling ? "Conversation started" : "Conversation ended"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-32 h-32 bg-[#2a2a2a] rounded-full overflow-hidden mb-8">
            <img src={avatarImage} alt="AI Assistant" className="w-full h-full object-cover" />
          </div>

          {/* Wave Animation */}
          <div className={`flex gap-1 items-center ${isAgentTalking ? "wave-active" : ""}`}>
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="w-1 h-4 bg-white rounded-full wave-bar"
              />
            ))}
          </div>

          <div className="w-full max-w-2xl mt-8">
            {transcript.map((text, index) => (
              <div key={index} className="flex items-start gap-4 mb-4">
                <img src={avatarImage} alt="Agent" className="w-10 h-10 rounded-full" />
                <p className="text-green-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
