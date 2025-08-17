import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './user.tsx';
import App from './App5.tsx';
import ThankYouPage from './tnx2.jsx';
import DetailedAssessmentPage from "./assp2.jsx";
ReactDOM.render(
  <React.StrictMode>
   <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/call" element={<App />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/detailed-assessment" element={<DetailedAssessmentPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
