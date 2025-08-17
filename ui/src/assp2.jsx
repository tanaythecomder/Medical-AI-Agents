import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, X } from 'lucide-react';
import Lottie from 'lottie-react';
import listeningAnimation from './assets/l.json';
import bgImage from './assets/a1.png';
import logo from './assets/avatar.png';
import './dash.css';

const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="card-header">{children}</div>
);

const CardTitle = ({ children }) => (
  <h3 className="card-title">{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

const DetailedAssessmentPage = () => {
  const location = useLocation();
  const { callId, name = "aman", age = "20", gender = "male" } = location.state || {};
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = process.env.REACT_APP_url;

  useEffect(() => {
    if (!callId) {
      setError("Call ID is missing");
      setLoading(false);
      return;
    }

    const fetchAssessmentData = async () => {
      try {
        const response = await fetch(`${url}/get-call/${callId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assessment data");
        }

        const data = await response.json();
        setAssessmentData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [callId, url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-primary">Loading assessment data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-secondary">No assessment data available.</div>
      </div>
    );
  }

  const ItemList = ({ title, items }) => (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items && (
          <div className="item-row">
            <div className="item-dot"></div>
            <span className="text-content">{items}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-100">
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

      <div className="header">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ultra Care Logo" className="h-10" />
            <span className="text-primary font-bold text-xl">ULTRA CARE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="user-info flex items-center gap-6">
              <div className="user-detail">
                <span className="text-gray-600 mr-1">Name:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="user-detail">
                <span className="text-gray-600 mr-1">Age:</span>
                <span className="font-medium">{age}</span>
              </div>
              <div className="user-detail">
                <span className="text-gray-600 mr-1">Gender:</span>
                <span className="font-medium">{gender}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-layout max-w-7xl mx-auto">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-content">
              {assessmentData.summary}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="item-row">
              <div className="item-dot"></div>
              <span className="text-content">{assessmentData.prescriptions}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="item-row">
              <div className="item-dot"></div>
              <span className="text-content">{assessmentData.advice}</span>
            </div>
          </CardContent>
        </Card>

        <ItemList title="Chief Complaints" items={assessmentData.chiefComplaints} />
      </div>

      <div className="lottie-background">
        <Lottie 
          animationData={listeningAnimation}
          loop={true}
          autoplay={true}
          className="lottie-animation"
        />
      </div>
    </div>
  );
};

export default DetailedAssessmentPage;
