import React, { useState } from 'react';
import './Login.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { TailSpin } from 'react-loader-spinner'; // Import a loader

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true); // Start the loading spinner

    setTimeout(() => {
      // Simulate login process (replace with actual API call)
      const storedUserData = JSON.parse(localStorage.getItem('userData'));

      if (!storedUserData) {
        setIsLoading(false); // Stop loading
        alert('No user data found! Please sign up first.');
        return;
      }

      if (storedUserData.email === email && storedUserData.password === password) {
        setIsLoading(false); // Stop loading
        navigate('/'); // Redirect to home or dashboard after login
      } else {
        setIsLoading(false); // Stop loading
        alert('Invalid email or password!');
      }
    }, 2000); // Simulate a delay
  };

  return (
    <div className="login-page"> 
      <div className="login-container">
        <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter Email/Username'
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
            <button type="submit" className="login-button">Login</button>
            <p className="signup-link">Don't have an account? <Link to="/signup">Sign up</Link></p>
          </form>
        
      </div>
    </div>
  );
};

export default Login;
