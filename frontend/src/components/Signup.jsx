import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { TailSpin } from 'react-loader-spinner'; // Import loader

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      // Simulate a signup process (you can replace it with actual API call)
      const userData = {
        username,
        email,
        password,
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      // Stop loading and navigate to login page
      setIsLoading(false);
      navigate('/login'); // Navigate to login page after signup
    }, 2000); // Simulate a delay
  };


  return (
    <div className="signup-page"> 
      <div className="signup-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder='Username'
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter Password'
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm Password'
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
          <p className="login-link">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
