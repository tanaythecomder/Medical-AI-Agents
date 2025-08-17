import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DetailedAssessmentPage = () => {
  const location = useLocation();
  const { callId } = location.state || {}; // Retrieve callId from state
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
        console.log("assessment send?");
        const response = await fetch(`${url}/get-call/${callId}`); // Use the backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch assessment data");
        }

        const data = await response.json();
        console.log("data?");
        console.log(data);
        setAssessmentData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [callId]);

  if (loading) {
    return <div>Loading assessment data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <h1 className="text-3xl mb-4">Detailed Assessment</h1>
      {assessmentData ? (
        <div className="space-y-4">
          <h2 className="text-xl">Summary</h2>
          <p>{assessmentData.summary}</p>

          <h2 className="text-xl">Chief Complaints</h2>
          <ul>
            {assessmentData.chiefComplaints}
          </ul>

          <h2 className="text-xl">Prescriptions</h2>
          <p>{assessmentData.prescriptions}</p>

          <h2 className="text-xl">Advice</h2>
          <p>{assessmentData.advice}</p>
        </div>
      ) : (
        <p>No assessment data available.</p>
      )}
    </div>
  );
};

export default DetailedAssessmentPage;
