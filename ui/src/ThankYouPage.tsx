import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callId } = location.state || {};
  const handleProceed = () => {
    // Redirect to the detailed assessment page
    console.log("moving above");
    navigate("/detailed-assessment",{ state: { callId } });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a1a1a] text-white">
      <h1 className="text-3xl mb-4">Thank You for Contacting AI!</h1>
      <p className="text-lg mb-8">Would you like to proceed to a detailed assessment?</p>
      <button
        onClick={handleProceed}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        Proceed to Detailed Assessment
      </button>
    </div>
  );
};

export default ThankYouPage;
