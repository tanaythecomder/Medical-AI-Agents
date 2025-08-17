import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import listeningAnimation from './assets/l.json';
import logo from './assets/avatar.png';
import bgImage from './assets/a1.png';
import './user.css';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  });
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/call', { state: formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-container">
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

      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Welcome to Ultra Care</h2>
          <p className="form-subtitle">Please enter your details to begin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Start Call
          </button>
        </form>
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

export default UserForm;
