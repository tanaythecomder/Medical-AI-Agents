import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import listeningAnimation from './assets/l.json';
import logo from './assets/avatar.png';
import bgImage from './assets/a1.png';
import './tnx.css';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name = "aman", age = "20", gender = "male", callId } = location.state || {};

  const handleProceed = () => {
    console.log("Proceeding to detailed assessment with callId:", callId);
    navigate('/detailed-assessment', { state: { callId, name, age, gender } });
  };

  return (
    <div className="thank-you-container">
      {/* Background Image */}
      <img 
        src={bgImage} 
        alt="" 
        className="background-image"
        loading="eager"
      />

      {/* Logo section */}
      <div className="logo-container">
        <img 
          src={logo} 
          alt="Ultra Care Logo" 
          className="logo-image"
        />
      </div>

      {/* Top bar with user info */}
      <div className="top-bar">
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
      
      {/* Main content card */}
      <div className="content-card">
        <div className="content">
          {/* Session completion message */}
          <h2>Session Ended</h2>
          
          {/* Action button */}
          <button 
            onClick={handleProceed}
            className="proceed-button"
          >
            Proceed to Final Assessment
          </button>
        </div>
      </div>

      {/* Bottom animation */}
      <div className="lottie-container">
        <div className="lottie-animation">
          <Lottie 
            animationData={listeningAnimation} 
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
